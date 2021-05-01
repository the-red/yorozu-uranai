// @ts-ignore
import swisseph from 'swisseph'

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

const eclipticPosition = (julday_ut: number, planetNumber: number, iflag: number): Promise<EclipticPosition> =>
  new Promise((resolve, reject) =>
    swisseph.swe_calc_ut(julday_ut, planetNumber, iflag, (body: EclipticPosition) => {
      if (body.error) reject(body.error)
      resolve(body)
    })
  )

export class PlanetPosition {
  static async getInstance(planet: PlanetName, julday_ut: number) {
    const position = await eclipticPosition(julday_ut, swisseph[`SE_${planet.toUpperCase()}`], swisseph.SEFLG_SPEED)
    return new PlanetPosition(position)
  }

  constructor(readonly position: EclipticPosition) {}

  get fullDegrees() {
    return this.position.longitude
  }
  get sign() {
    return Math.trunc(this.fullDegrees / 30)
  }
  get degrees() {
    const degrees = this.fullDegrees % 30
    const degreesInt = Math.trunc(degrees)
    const degreesStr = `${String(degreesInt).padStart(2)}°`

    const degreesMin = (degrees - degreesInt) * 60
    const degreesMinInt = Math.trunc(degreesMin)
    const degreesMinStr = `${String(degreesMinInt).padStart(2, '0')}′`

    const degreesSec = (degreesMin - degreesMinInt) * 60
    const degreesSecInt = Math.trunc(degreesSec)
    const degreesSecStr = `${String(degreesSecInt).padStart(2, '0')}″`

    return degreesStr + degreesMinStr + degreesSecStr
  }
}

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

// Test date
const date = new Date('1987-09-08T08:53:00+09:00')
console.log('Test date:', date)

PlanetPositions.getInstance(date).then((positions) => {
  const { fullDegrees, sign, degrees } = positions.sun
  console.log({ fullDegrees, sign, degrees })
})
