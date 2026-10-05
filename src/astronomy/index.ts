import swisseph from 'swisseph'
import type { Body, EclipticPosition, HouseCusps, Houses } from './types'

const round6 = (num: number) => Math.trunc(num * 10 ** 6) / 10 ** 6

// ユリウス日の計算
export const julday = (date: Date): Promise<number> => {
  // NOTE: 実行環境のタイムゾーンに依らないように、UTCの値から求める。
  // ローカルの値と getTimezoneOffset() から求めると、オフセットに秒の端数がある古い日付でずれる
  const year = date.getUTCFullYear()
  const month = date.getUTCMonth() + 1
  const day = date.getUTCDate()

  const hour = date.getUTCHours()
  const minute = date.getUTCMinutes()
  const second = date.getUTCSeconds() + date.getUTCMilliseconds() / 1000
  const utcHourMinuteSecond = hour + (minute + second / 60) / 60

  return new Promise((resolve) =>
    swisseph.swe_julday(year, month, day, utcHourMinuteSecond, swisseph.SE_GREG_CAL, (julday_ut: number) =>
      resolve(julday_ut)
    )
  )
}

// Swiss Ephemeris での番号
const BODIES: Record<Body, number> = {
  sun: swisseph.SE_SUN,
  moon: swisseph.SE_MOON,
  mercury: swisseph.SE_MERCURY,
  venus: swisseph.SE_VENUS,
  mars: swisseph.SE_MARS,
  jupiter: swisseph.SE_JUPITER,
  saturn: swisseph.SE_SATURN,
  uranus: swisseph.SE_URANUS,
  neptune: swisseph.SE_NEPTUNE,
  pluto: swisseph.SE_PLUTO,
  // NOTE: 平均の位置にするなら、SE_MEAN_NODE
  trueNode: swisseph.SE_TRUE_NODE,
  // NOTE: 真位置にするなら、SE_OSCU_APOG
  meanApogee: swisseph.SE_MEAN_APOG,
}

// 黄道座標の計算
export const eclipticPosition = (julday_ut: number, body: Body): Promise<EclipticPosition> =>
  new Promise((resolve, reject) =>
    swisseph.swe_calc_ut(julday_ut, BODIES[body], swisseph.SEFLG_SPEED, (result) => {
      if ('error' in result) {
        return reject(new Error(result.error))
      }
      if (!('latitude' in result)) {
        return reject(new Error('ERROR!' + JSON.stringify(result)))
      }

      // 処理系が変わると少し誤差が出るので丸めておく
      result.latitude = round6(result.latitude)
      result.longitude = round6(result.longitude)
      result.distance = round6(result.distance)
      result.latitudeSpeed = round6(result.latitudeSpeed)
      result.longitudeSpeed = round6(result.longitudeSpeed)
      result.distanceSpeed = round6(result.distanceSpeed)

      resolve({
        ...result,
        isRetrograde: result.longitudeSpeed < 0,
      })
    })
  )

// 日付から黄経だけを算出
export const getEclipticLongitude = async (date: Date) => {
  const julday_ut = await julday(date)
  const { longitude } = await eclipticPosition(julday_ut, 'sun')
  return longitude
}

// 均時差（視太陽時 − 平均太陽時）を分単位で算出
export const equationOfTime = (julday_ut: number): Promise<number> =>
  new Promise((resolve, reject) =>
    swisseph.swe_time_equ(julday_ut, (result) => {
      if ('error' in result) {
        return reject(new Error(result.error))
      }

      // 日単位で返ってくるので分に直す
      resolve(result.timeEquation * 24 * 60)
    })
  )

// ハウスの計算
export const calcHouses = (julday_ut: number, geolat: number, geolon: number, hsys: string = ''): Promise<Houses> =>
  new Promise((resolve, reject) =>
    swisseph.swe_houses(julday_ut, geolat, geolon, hsys, (result) => {
      if ('error' in result) {
        return reject(new Error(result.error))
      }

      // 処理系が変わると少し誤差が出るので丸めておく
      result.house = result.house.map(round6) as HouseCusps
      result.ascendant = round6(result.ascendant)
      result.mc = round6(result.mc)
      result.armc = round6(result.armc)
      result.vertex = round6(result.vertex)
      result.equatorialAscendant = round6(result.equatorialAscendant)
      result.kochCoAscendant = round6(result.kochCoAscendant)
      result.munkaseyCoAscendant = round6(result.munkaseyCoAscendant)
      result.munkaseyPolarAscendant = round6(result.munkaseyPolarAscendant)

      resolve(result)
    })
  )

// ハウスシステム名を略称から引く
// swe_house_name()がNode.js版では使えないので↓のをコピって独自実装
// https://github.com/mivion/swisseph/blob/327e9ff871db2d27062d96ca30f1656d99cd5ec9/deps/swisseph/swehouse.c#L822-L853
export const houseSystemName = (hsys?: string) => {
  switch (hsys) {
    case 'A':
      return 'equal'
    case 'B':
      return 'Alcabitius'
    case 'C':
      return 'Campanus'
    case 'D':
      return 'equal (MC)'
    case 'E':
      return 'equal'
    case 'F':
      return 'Carter poli-equ.'
    case 'G':
      return 'Gauquelin sectors'
    case 'H':
      return 'horizon/azimut'
    case 'I':
      return 'Sunshine'
    case 'i':
      return 'Sunshine/alt.'
    case 'K':
      return 'Koch'
    case 'L':
      return 'Pullen SD'
    case 'M':
      return 'Morinus'
    case 'N':
      return 'equal/1=Aries'
    case 'O':
      return 'Porphyry'
    case 'Q':
      return 'Pullen SR'
    case 'R':
      return 'Regiomontanus'
    case 'S':
      return 'Sripati'
    case 'T':
      return 'Polich/Page'
    case 'U':
      return 'Krusinski-Pisa-Goelzer'
    case 'V':
      return 'equal/Vehlow'
    case 'W':
      return 'equal/ whole sign'
    case 'X':
      return 'axial rotation system/Meridian houses'
    case 'Y':
      return 'APC houses'
    default:
      return 'Placidus'
  }
}

// 黄経から日付を算出
export const longitudeToDate = async (
  targetLongitude: number,
  nearbyDate: Date, // この日付に一番近い日付を探す
  forward: boolean = true, // 順行ならtrue、逆行ならfalse
  count: number = 0
): Promise<Date> => {
  const secondsOfYear = 365.2422 / 24 / 60 / 60
  const longitudesOfSeconds = secondsOfYear / 360 // 1秒で黄経が進む度数

  const currentLongitude = await getEclipticLongitude(nearbyDate)
  const sign = forward ? 1 : -1

  let longitudeDiff = targetLongitude - currentLongitude
  if (count === 0 && sign * longitudeDiff < 0) {
    longitudeDiff += sign * 360
  }
  const diffSeconds = longitudeDiff / longitudesOfSeconds
  const diffSecondsInt = Math.trunc(diffSeconds)

  if (diffSecondsInt === 0) {
    return nearbyDate
  }

  if (count > 10) {
    // 無限再帰の防止
    return nearbyDate
  }

  const newDate = new Date(nearbyDate.getTime() + diffSecondsInt * 1000)
  return longitudeToDate(targetLongitude, newDate, forward, count + 1)
}
