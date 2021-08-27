import useSWR from 'swr'
import type { Planet as PlanetClass } from '../horoscope'
import type { Houses } from '../horoscope'

import HouseCusp from './HouseCusp'
import SignTable from './SignTable'
import PlanetPositions from './PlanetPositions'
import dynamic from 'next/dynamic'

const HoroscopeCircle = dynamic(() => import('./HoroscopeCircle'), { ssr: false })

type Planet = ReturnType<PlanetClass['toJSON']>
type Horoscope = {
  houses: Houses
  planets: {
    sun: Planet
    moon: Planet
    mercury: Planet
    venus: Planet
    mars: Planet
    jupiter: Planet
    saturn: Planet
    uranus: Planet
    neptune: Planet
    pluto: Planet
  }
}

type HoroscopeSeed = {
  birthday: Date
  lat: number
  lon: number
  hsys?: string
  timeUnknown: boolean
}

type Props = { horoscopeSeed: HoroscopeSeed }
function HoroscopeDetailPage({ horoscopeSeed }: Props) {
  const { data: horoscope, error } = useSWR(['/api/horoscope', horoscopeSeed], async (url, horoscopeSeed) => {
    const res = await fetch(url, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(horoscopeSeed),
    })
    if (!res.ok) {
      const { errorMessage } = await res.json()
      throw new Error(errorMessage)
    }
    const json = await res.json()
    const { houses, ...planets } = json.data
    return { houses, planets } as Horoscope
  })

  if (error) return <div>failed to load: {JSON.stringify(error.message)}</div>
  if (!horoscope) return <div>loading...</div>

  const planets = Object.values<Planet>(horoscope.planets).map<Planet>((value) => ({
    name: value.name,
    degrees: value.degrees,
    element: value.element,
    formattedDegrees: value.formattedDegrees,
    longitude: value.longitude,
    polarity: value.polarity,
    quality: value.quality,
    sign: value.sign,
    coordinate: value.coordinate,
  }))

  return (
    <div>
      <div style={{ display: 'flex', marginBottom: '20px' }}>
        <div style={{ width: '50%', display: 'flex', justifyContent: 'center' }}>
          <HoroscopeCircle horoscope={horoscope}></HoroscopeCircle>
        </div>
      </div>
      <div style={{ display: 'flex', marginBottom: '20px' }}>
        <div style={{ width: '50%', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
          <PlanetPositions planets={planets}></PlanetPositions>
        </div>
        <div style={{ width: '50%', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
          <HouseCusp houses={horoscope.houses}></HouseCusp>
        </div>
      </div>
      <div style={{ display: 'flex' }}>
        <div style={{ width: '50%', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
          <SignTable planets={planets}></SignTable>
        </div>
      </div>
    </div>
  )
}

export default HoroscopeDetailPage
