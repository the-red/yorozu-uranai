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
  error?: any
}

type Houses = {
  house: [number, number, number, number, number, number, number, number, number, number, number, number]
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
      (body: EclipticPosition) => {
        if (body.error) reject(body.error)
        resolve(body)
      }
    )
  )

// ハウスの計算
export const houses = (julday_ut: number, geolat: number, geolon: number, hsys?: string): Promise<Houses> =>
  new Promise((resolve, reject) =>
    swisseph.swe_houses(julday_ut, geolat, geolon, hsys, (result: Houses) => {
      if (result.error) reject(result.error)
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
