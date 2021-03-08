const Astronomy = require('astronomy-engine')

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
  if (process.argv.length === 4 || process.argv.length === 5) {
    const latitude = ParseNumber(process.argv[2], 'latitude')
    const longitude = ParseNumber(process.argv[3], 'longitude')
    const observer = new Astronomy.Observer(latitude, longitude, 0)
    const date = process.argv.length === 5 ? ParseDate(process.argv[4]) : new Date()
    console.log(`UTC date = ${date.toISOString()}`)
    console.log('')
    console.log(`${'BODY'.padEnd(8)} ${'RA'.padStart(8)} ${'DEC'.padStart(8)} ${'AZ'.padStart(8)} ${'ALT'.padStart(8)}`)
    for (let body of ['Sun', 'Moon', 'Mercury', 'Venus', 'Mars', 'Jupiter', 'Saturn', 'Uranus', 'Neptune', 'Pluto']) {
      let equ_2000 = Astronomy.Equator(body, date, observer, false, true)
      let equ_ofdate = Astronomy.Equator(body, date, observer, true, true)
      let hor = Astronomy.Horizon(date, observer, equ_ofdate.ra, equ_ofdate.dec, 'normal')
      console.log(
        `${body.padEnd(8)} ${Format(equ_2000.ra)} ${Format(equ_2000.dec)} ` +
          `${Format(hor.azimuth)} ${Format(hor.altitude)}`
      )
    }
    process.exit(0)
  }
  console.log('USAGE: node positions.js latitude longitude [date]')
  process.exit(1)
}

Demo()
