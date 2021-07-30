import useSWR from 'swr'
import { useState } from 'react'
import type { Planet as PlanetClass } from '../../horoscope'
import type { Houses } from '../../horoscope'

import HouseCusp from '../../components/HouseCusp'
import SignTable from '../../components/SignTable'
import PlanetPositions from '../../components/PlanetPositions'
import { HoroscopeForm, FormValues } from '../../components/HoroscopeForm'
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

type HoroscopeSeed = { birthday: Date; lat: number; lon: number; hsys?: string }
function HoroscopePage() {
  const defaultValues = {
    birthday: new Date(),
    lat: 35.604839,
    lon: 139.667717,
    // hsys: 'Placidus(default)',
  }
  // {
  //   birthday: new Date('1987-09-08T08:53:00+09:00'),
  //   lat: 43.066666,
  //   lon: 141.35,
  //   // hsys: 'Placidus(default)',
  // }

  const [horoscopeSeed, setHoroscopeSeed] = useState<HoroscopeSeed>(defaultValues)
  const { data: horoscope, error } = useSWR(
    '/api/horoscope',
    async (url) => {
      console.log('swr', horoscopeSeed.birthday)
      const bd = document.querySelector('#birthday-text')?.textContent
      console.log(bd)
      const res = await fetch(url, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        // @ts-ignore
        body: JSON.stringify({ ...horoscopeSeed, birthday: new Date(bd) }),
      })
      if (!res.ok) {
        const { errorMessage } = await res.json()
        throw new Error(errorMessage)
      }
      const json = await res.json()
      const { houses, ...planets } = json.data
      return { houses, planets } as Horoscope
    },
    { onSuccess: (data) => console.log('success!', data.planets.sun), refreshInterval: 1000 }
  )

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
            <HoroscopeForm
              onSubmit={({ birthday: dateTime, lat: latitude, lon: longitude }: FormValues) => {
                setHoroscopeSeed({
                  birthday: dateTime,
                  lat: latitude,
                  lon: longitude,
                })
                console.log('submit', horoscopeSeed.birthday)
              }}
              defaultValues={defaultValues}
            />
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
      <p style={{ visibility: 'hidden' }} id="birthday-text">
        {horoscopeSeed.birthday.toISOString()}
      </p>
    </div>
  )
}

export default HoroscopePage
