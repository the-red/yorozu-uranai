// @ts-ignore
import swisseph from 'swisseph'

export const ALL_PLANETS = [
  'sun',
  'moon',
  'mercury',
  'venus',
  'mars',
  'jupiter',
  'saturn',
  'uranus',
  'neptune',
  'pluto',
] as const
export type PlanetName = typeof ALL_PLANETS[number]


type EclipticPosition = {
  longitude: number
  latitude: number
  distance: number
  longitudeSpeed: number
  latitudeSpeed: number
  distanceSpeed: number
  rflag: number
  error?: any
}

// ユリウス日の計算（ライブラリの関数をラップ）
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
    swisseph.swe_julday(year, month, day, utcHourMinuteSecond, swisseph.SE_GREG_CAL, (julday_ut: number) => resolve(julday_ut))
  )
}

// 黄道座標の計算（ライブラリの関数をラップ）
export const eclipticPosition = (julday_ut: number, planet: PlanetName): Promise<EclipticPosition> =>
  new Promise((resolve, reject) =>
    swisseph.swe_calc_ut(julday_ut, swisseph[`SE_${planet.toUpperCase()}`], swisseph.SEFLG_SPEED, (body: EclipticPosition) => {
      if (body.error) reject(body.error)
      resolve(body)
    })
  )
