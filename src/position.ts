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
const date = new Date('1987-09-08T08:53:00+09:00')
const year = date.getFullYear()
const month = date.getMonth() + 1
const day = date.getDate()
const hour = date.getHours()
const minute = date.getMinutes()
const second = date.getSeconds() + date.getMilliseconds() / 1000
const offset = date.getTimezoneOffset()
const utcHourMinuteSecond = hour + (minute + second / 60 + offset) / 60
console.log('Test date:', { year, month, day, hour, minute, offset })

// Julian day
swisseph.swe_julday(year, month, day, utcHourMinuteSecond, swisseph.SE_GREG_CAL, (julday_ut: number) => {
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
