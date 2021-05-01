import { strict as assert } from 'assert'
// @ts-ignore
import swisseph from 'swisseph'

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

const planets = ['SUN', 'MOON', 'MERCURY', 'VENUS', 'MARS', 'JUPITER', 'SATURN', 'URANUS', 'NEPTUNE', 'PLUTO'] as const

// Test date
const year = 1987
const month = 9
const day = 8
const hour = 8
const minute = 53
const offset = 9
console.log('Test date:', { year, month, day, hour, minute, offset })

// Julian day
swisseph.swe_julday(year, month, day, hour + minute / 60 - offset, swisseph.SE_GREG_CAL, (julday_ut: number) => {
  assert.equal(julday_ut, 2447046.4951388887)
  console.log('Julian UT day for date:', julday_ut)

  planets.forEach((planet) => {
    // position
    swisseph.swe_calc_ut(julday_ut, swisseph[`SE_${planet}`], swisseph.SEFLG_SPEED, (body: EclipticPosition) => {
      assert(!body.error, body.error)
      const fullDegrees = body.longitude

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
      console.log(`${planet}:`, { sign, degrees: degreesToPrint })
    })
  })
})
