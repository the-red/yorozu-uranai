const { Observer, GeoVector, Ecliptic, Equator } = require('astronomy-engine')

function Format(x) {
  return x.toFixed(2).padStart(8)
}

function ParseNumber(text, name) {
  const x = Number(text)
  if (!Number.isFinite(x)) {
    console.error(`ERROR: Not a valid numeric value for ${name}: "${text}"`)
    process.exit(1)
  }
  return x
}

function ParseDate(text) {
  const d = new Date(text)
  if (!Number.isFinite(d.getTime())) {
    console.error(`ERROR: Not a valid date: "${text}"`)
    process.exit(1)
  }
  return d
}

function Demo() {
  if (process.argv.length < 5) {
    console.log('USAGE: node positions.js latitude longitude date')
    process.exit(1)
  }

  const latitude = ParseNumber(process.argv[2], 'latitude')
  const longitude = ParseNumber(process.argv[3], 'longitude')
  const observer = new Observer(latitude, longitude, 0)
  const date = ParseDate(process.argv[4])
  console.log(`UTC date = ${date.toISOString()}`)
  console.log('')
  console.log(`${'BODY'.padEnd(8)} ${'SIGN'} ${'DEGREES'.padStart(8)} ${'ELON'.padStart(8)} ${'DEC'.padStart(8)}`)
  for (let body of ['Sun', 'Moon', 'Mercury', 'Venus', 'Mars', 'Jupiter', 'Saturn', 'Uranus', 'Neptune', 'Pluto']) {
    const vector = GeoVector(body, date, true)
    const ecliptic = Ecliptic(vector.x, vector.y, vector.z)
    const equator = Equator(body, date, observer, false, true)
    const sign = Math.trunc(ecliptic.elon / 30)
    const degrees = ecliptic.elon - sign * 30
    console.log(
      `${body.padEnd(8)} ${String(sign).padStart(4)} ${Format(degrees)} ${Format(ecliptic.elon)} ${Format(equator.dec)}`
    )
  }
}

Demo()
