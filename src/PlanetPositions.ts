// @ts-ignore
import swisseph from 'swisseph'

const ALL_PLANETS = [
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
type PlanetName = typeof ALL_PLANETS[number]

const ALL_SIGNS = [
  '牡羊座',
  '牡牛座',
  '双子座',
  '蟹座',
  '獅子座',
  '乙女座',
  '天秤座',
  '蠍座',
  '射手座',
  '山羊座',
  '水瓶座',
  '魚座',
] as const
type Sign = typeof ALL_SIGNS[number]

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
const julday = (date: Date, gregflag: number): Promise<number> => {
  const year = date.getFullYear()
  const month = date.getMonth() + 1
  const day = date.getDate()

  const hour = date.getHours()
  const minute = date.getMinutes()
  const second = date.getSeconds() + date.getMilliseconds() / 1000
  const offset = date.getTimezoneOffset()
  const utcHourMinuteSecond = hour + (minute + second / 60 + offset) / 60

  return new Promise((resolve) =>
    swisseph.swe_julday(year, month, day, utcHourMinuteSecond, gregflag, (julday_ut: number) => resolve(julday_ut))
  )
}

// 黄道座標の計算（ライブラリの関数をラップ）
const eclipticPosition = (julday_ut: number, planetNumber: number, iflag: number): Promise<EclipticPosition> =>
  new Promise((resolve, reject) =>
    swisseph.swe_calc_ut(julday_ut, planetNumber, iflag, (body: EclipticPosition) => {
      if (body.error) reject(body.error)
      resolve(body)
    })
  )

// 惑星1つ分の座標
class PlanetPosition {
  private INTERVAL = 30 as const

  static async getInstance(planet: PlanetName, julday_ut: number) {
    const position = await eclipticPosition(julday_ut, swisseph[`SE_${planet.toUpperCase()}`], swisseph.SEFLG_SPEED)
    return new PlanetPosition(position.longitude)
  }

  constructor(readonly longitude: number) {}

  get degrees() {
    return this.longitude % this.INTERVAL
  }

  get formattedDegrees() {
    const degreesInt = Math.trunc(this.degrees)
    const degreesStr = `${String(degreesInt).padStart(2)}°`

    const MINUTE = 60
    const degreesMin = (this.degrees - degreesInt) * MINUTE
    const degreesMinInt = Math.trunc(degreesMin)
    const degreesMinStr = `${String(degreesMinInt).padStart(2, '0')}′`

    const degreesSec = (degreesMin - degreesMinInt) * MINUTE
    const degreesSecInt = Math.round(degreesSec)
    const degreesSecStr = `${String(degreesSecInt).padStart(2, '0')}″`

    return degreesStr + degreesMinStr + degreesSecStr
  }

  get sign() {
    let index = Math.trunc(this.longitude / this.INTERVAL)
    if (this.degrees === 0) {
      index = index > 0 ? index - 1 : ALL_SIGNS.length - 1
    }
    return ALL_SIGNS[index]
  }
}

// 全惑星の座標
export class PlanetPositions {
  readonly sun: PlanetPosition
  readonly moon: PlanetPosition
  readonly mercury: PlanetPosition
  readonly venus: PlanetPosition
  readonly mars: PlanetPosition
  readonly jupiter: PlanetPosition
  readonly saturn: PlanetPosition
  readonly uranus: PlanetPosition
  readonly neptune: PlanetPosition
  readonly pluto: PlanetPosition

  static async getInstance(date: Date) {
    const julday_ut = await julday(date, swisseph.SE_GREG_CAL)

    const positions = await Promise.all(
      ALL_PLANETS.map(async (planet) => {
        const planetPosition = await PlanetPosition.getInstance(planet, julday_ut)
        return [planet, planetPosition] as [PlanetName, PlanetPosition]
      })
    )
    const positionsMap = Object.fromEntries(positions) as Record<PlanetName, PlanetPosition>
    return new PlanetPositions(positionsMap)
  }

  constructor(readonly all: Record<PlanetName, PlanetPosition>) {
    this.sun = all.sun
    this.moon = all.moon
    this.mercury = all.mercury
    this.venus = all.venus
    this.mars = all.mars
    this.jupiter = all.jupiter
    this.saturn = all.saturn
    this.uranus = all.uranus
    this.neptune = all.neptune
    this.pluto = all.pluto
  }
}
