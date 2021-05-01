import { strict as assert } from 'assert'
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
  'SUN',
  'MOON',
  'MERCURY',
  'VENUS',
  'MARS',
  'JUPITER',
  'SATURN',
  'URANUS',
  'NEPTUNE',
  'PLUTO',
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
type PlanetPosition = { planet: PlanetName } & EclipticPosition

const eclipticPosition = (julday_ut: number, planetNumber: number, iflag: number): Promise<EclipticPosition> =>
  new Promise((resolve, reject) =>
    swisseph.swe_calc_ut(julday_ut, planetNumber, iflag, (body: EclipticPosition) => {
      if (body.error) reject(body.error)
      resolve(body)
    })
  )

// Test date
const date = new Date('1987-09-08T08:53:00+09:00')
console.log('Test date:', date)

// Julian day
julday(date, swisseph.SE_GREG_CAL).then(async (julday_ut) => {
  assert.equal(julday_ut, 2447046.4951388887)
  console.log('Julian UT day for date:', julday_ut)

  const positions = await Promise.all(
    ALL_PLANETS.map(
      async (planet): Promise<PlanetPosition> => {
        const position = await eclipticPosition(julday_ut, swisseph[`SE_${planet}`], swisseph.SEFLG_SPEED)
        return { planet, ...position }
      }
    )
  )

  for (const position of positions) {
    const fullDegrees = position.longitude

    const sign = Math.trunc(fullDegrees / 30)

    const degrees = fullDegrees % 30
    const degreesInt = Math.trunc(degrees)
    const degreesMin = (degrees - degreesInt) * 60
    const degreesMinInt = Math.trunc(degreesMin)
    const degreesSec = (degreesMin - degreesMinInt) * 60
    const degreesSecInt = Math.trunc(degreesSec)
    const degreesToPrint = `${String(degreesInt).padStart(2)}°${String(degreesMinInt).padStart(2, '0')}′${String(
      degreesSecInt
    ).padStart(2, '0')}″`
    console.log(`${position.planet}:`, { sign, degrees: degreesToPrint })
  }
})
