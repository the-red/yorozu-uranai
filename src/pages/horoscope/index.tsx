import useSWR from 'swr'
import Head from 'next/head'
import type { Planet as PlanetClass } from '../../horoscope'
import type { Houses } from '../../horoscope'

import HouseCusp from '../../components/HouseCusp'
import SignTable from '../../components/SignTable'
import PlanetPositions from '../../components/PlanetPositions'
import { HoroscopeForm } from '../../components/HoroscopeForm'
import dynamic from 'next/dynamic'

const HoroscopeCircle = dynamic(() => import('../../components/HoroscopeCircle'), { ssr: false })

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

function HoroscopePage() {
  const { data: horoscope, error } = useSWR('/api/horoscope', async (url) => {
    const res = await fetch(url, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        birthday: '1987-09-08T08:53:00+09:00',
        lat: 43.0666666666666666,
        lon: 141.35,
        // hsys: 'Placidus(default)',
      }),
    })
    if (!res.ok) {
      const { errorMessage } = await res.json()
      throw new Error(errorMessage)
    }
    const json = await res.json()
    const { houses, ...planets } = json.data
    console.log({ houses, planets })
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
      <div style={{ width: '960px', margin: '20px auto' }}>
        <div style={{ fontFamily: 'Farewell Pro Regular', fontSize: '60px', marginBottom: '20px' }}>Horoscope</div>
        <div style={{ display: 'flex', marginBottom: '20px' }}>
          <div style={{ width: '50%', display: 'flex', justifyContent: 'center' }}>
            <HoroscopeCircle horoscope={horoscope}></HoroscopeCircle>
          </div>
          <div style={{ width: '50%', display: 'flex', justifyContent: 'center', paddingTop: '50px' }}>
            <HoroscopeForm onSubmit={(val) => console.log(val)} />
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
    </div>
  )
}

export default HoroscopePage
