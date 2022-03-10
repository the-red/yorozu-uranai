// @ts-ignore
import swisseph from 'swisseph'
import type { PlanetName, EclipticPosition, HouseCusps, Houses } from './types'

type UpperPlanetName =
  | 'SUN'
  | 'MOON'
  | 'MERCURY'
  | 'VENUS'
  | 'MARS'
  | 'JUPITER'
  | 'SATURN'
  | 'URANUS'
  | 'NEPTUNE'
  | 'PLUTO'

const round6 = (num: number) => Math.trunc(num * 10 ** 6) / 10 ** 6

// ユリウス日の計算
export const julday = (date: Date): Promise<number> => {
  const year = date.getFullYear()
  const month = date.getMonth() + 1
  const day = date.getDate()

  const hour = date.getHours()
  const minute = date.getMinutes()
  const second = date.getSeconds() + date.getMilliseconds() / 1000
  const offset = date.getTimezoneOffset()
  const utcHourMinuteSecond = hour + (minute + second / 60 + offset) / 60

  return new Promise((resolve) =>
    swisseph.swe_julday(year, month, day, utcHourMinuteSecond, swisseph.SE_GREG_CAL, (julday_ut: number) =>
      resolve(julday_ut)
    )
  )
}

// 黄道座標の計算
export const eclipticPosition = (julday_ut: number, _planet: PlanetName): Promise<EclipticPosition> =>
  new Promise((resolve, reject) => {
    const planet = _planet.toUpperCase() as UpperPlanetName
    return swisseph.swe_calc_ut(julday_ut, swisseph[`SE_${planet}`], swisseph.SEFLG_SPEED, (r) => {
      if ('error' in r) {
        return reject(r.error)
      }

      const result = r as Omit<EclipticPosition, 'isRetrograde'>

      resolve({
        // 処理系が変わると少し誤差が出るので丸めておく
        latitude: round6(result.latitude),
        longitude: round6(result.longitude),
        distance: round6(result.distance),
        latitudeSpeed: round6(result.latitudeSpeed),
        longitudeSpeed: round6(result.longitudeSpeed),
        distanceSpeed: round6(result.distanceSpeed),
        rflag: result.rflag,
        isRetrograde: result.longitudeSpeed < 0,
      })
    })
  })

// 日付から黄経だけを算出
export const getLongitude = async (date: Date) => {
  const julday_ut = await julday(date)
  const { longitude } = await eclipticPosition(julday_ut, 'sun')
  return longitude
}

// ハウスの計算
export const calcHouses = (julday_ut: number, geolat: number, geolon: number, hsys: string = ''): Promise<Houses> =>
  new Promise((resolve, reject) =>
    swisseph.swe_houses(julday_ut, geolat, geolon, hsys, (result) => {
      if ('error' in result) {
        return reject(result.error)
      }

      resolve({
        // 処理系が変わると少し誤差が出るので丸めておく
        house: result.house.map(round6),
        ascendant: round6(result.ascendant),
        mc: round6(result.mc),
        armc: round6(result.armc),
        vertex: round6(result.vertex),
        equatorialAscendant: round6(result.equatorialAscendant),
        kochCoAscendant: round6(result.kochCoAscendant),
        munkaseyCoAscendant: round6(result.munkaseyCoAscendant),
        munkaseyPolarAscendant: round6(result.munkaseyPolarAscendant),
      })
    })
  )

// 地方恒星時
export const localSiderealTime = (julday_ut: number, geolon: number): Promise<number> =>
  new Promise((resolve) => {
    // note: ライブラリ側がtypoしてる(siderial)
    const { siderialTime: siderealTime } = swisseph.swe_sidtime(julday_ut)
    const localSiderealTime = geolon / 15 + siderealTime
    resolve(localSiderealTime)
  })

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
