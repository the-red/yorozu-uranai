const { strict: assert } = require('assert')
const swisseph = require('swisseph')

const planets = [
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
]

// Test date
const year = 1987
const month = 9
const day = 8
const hour = 8
const minutes = 53
const offset = 9
console.log('Test date:', { year, month, day, hour, minutes, offset })

// Julian day
swisseph.swe_julday(year, month, day, hour + minutes / 60 - offset, swisseph.SE_GREG_CAL, function (julday_ut) {
  assert.equal(julday_ut, 2447046.4951388887)
  console.log('Julian UT day for date:', julday_ut)

  planets.forEach((planet) => {
    // position
    swisseph.swe_calc_ut(julday_ut, swisseph[`SE_${planet}`], swisseph.SEFLG_SPEED, function (body) {
      assert(!body.error, body.error)
      const fullDegrees = body.longitude

      const sign = Math.trunc(fullDegrees / 30)

      const degrees = fullDegrees % 30
      const degreesInt = Math.trunc(degrees)
      const degreesMin = (degrees - degreesInt) * 60
      const degreesMinInt = Math.trunc(degreesMin)
      const degreesSec = (degreesMin - degreesMinInt) * 60
      const degreesSecInt = Math.trunc(degreesSec)
      const degreesToPrint = `${String(degreesInt).padStart(2)}°${String(degreesMinInt).padStart(2, 0)}′${String(
        degreesSecInt
      ).padStart(2, 0)}″`
      console.log(`${planet}:`, { sign, degrees: degreesToPrint })
    })
  })
})
