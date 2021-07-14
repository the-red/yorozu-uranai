// @ts-ignore
import swisseph from 'swisseph'
import type { PlanetName } from './Planet'

type EclipticPosition = {
  latitude: number
  longitude: number
  distance: number
  latitudeSpeed: number
  longitudeSpeed: number
  distanceSpeed: number
  rflag: number
  isRetrograde: boolean // trueなら逆行
  error?: any
}

type HouseCusps = [number, number, number, number, number, number, number, number, number, number, number, number]
type Houses = {
  house: HouseCusps
  ascendant: number
  mc: number
  armc: number
  vertex: number
  equatorialAscendant: number
  kochCoAscendant: number
  munkaseyCoAscendant: number
  munkaseyPolarAscendant: number
  error?: any
}

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
export const eclipticPosition = (julday_ut: number, planet: PlanetName): Promise<EclipticPosition> =>
  new Promise((resolve, reject) =>
    swisseph.swe_calc_ut(
      julday_ut,
      swisseph[`SE_${planet.toUpperCase()}`],
      swisseph.SEFLG_SPEED,
      (result: EclipticPosition) => {
        if (result.error) reject(result.error)

        // 処理系が変わると少し誤差が出るので丸めておく
        result.latitude = round6(result.latitude)
        result.longitude = round6(result.longitude)
        result.distance = round6(result.distance)
        result.latitudeSpeed = round6(result.latitudeSpeed)
        result.longitudeSpeed = round6(result.longitudeSpeed)
        result.distanceSpeed = round6(result.distanceSpeed)

        result.isRetrograde = result.longitudeSpeed < 0
        resolve(result)
      }
    )
  )

// ハウスの計算
export const houses = (julday_ut: number, geolat: number, geolon: number, hsys: string = ''): Promise<Houses> =>
  new Promise((resolve, reject) =>
    swisseph.swe_houses(julday_ut, geolat, geolon, hsys, (result: Houses) => {
      if (result.error) reject(result.error)

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
