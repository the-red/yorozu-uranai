import useSWR from 'swr'
import { Horoscope, HoroscopeProps } from '../horoscope'

import HouseCusp from './HouseCusp'
import SignTable from './SignTable'
import PlanetPositions from './PlanetPositions'
import { FormValues, HoroscopeForm } from './HoroscopeForm'
import dynamic from 'next/dynamic'
import { useEffect, useMemo, useState } from 'react'

const HoroscopeCircle = dynamic(() => import('./HoroscopeCircle'), { ssr: false })

type HoroscopeSeed = {
  birthday: Date
  lat: number
  lon: number
  hsys?: string
  timeUnknown: boolean
}

function HoroscopeDetailPage() {
  const defaultValues: HoroscopeSeed = useMemo(
    () => ({
      birthday: new Date(),
      lat: 35.604839,
      lon: 139.667717,
      // hsys: 'Placidus(default)',
      timeUnknown: false,
    }),
    []
  )

  const [horoscopeSeed, setHoroscopeSeed] = useState<HoroscopeSeed>(defaultValues)

  const [horoscope, setHoroscope] = useState<Horoscope>()

  const { data, error } = useSWR<Horoscope>(['/api/horoscope', horoscopeSeed], async (url, horoscopeSeed) => {
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
    const horoscopeProps = json.data as HoroscopeProps
    return new Horoscope(horoscopeProps)
  })

  useEffect(() => {
    // NOTE: refetchのたびにdataにundefが入り、画面がチラつくことを避ける
    if (data) {
      setHoroscope(data)
    }
  }, [data])

  if (error) return <div>failed to load: {JSON.stringify(error.message)}</div>
  if (!horoscope) return <div>loading...</div>

  const planets = Object.values(horoscope.planets)

  return (
    <div>
      <div style={{ display: 'flex' }}>
        <div style={{ width: '50%', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
          <div style={{ width: '360px', padding: '16px 8px' }}>
            <HoroscopeForm
              onSubmit={({ birthday: dateTime, lat, lon, timeUnknown }: FormValues) => {
                setHoroscopeSeed({
                  birthday: dateTime,
                  lat,
                  lon,
                  timeUnknown,
                })
              }}
              defaultValues={horoscopeSeed}
            />
          </div>
        </div>
        <div style={{ width: '50%', display: 'flex', justifyContent: 'center' }}>
          <div style={{ marginLeft: '0px' }}>
            <HoroscopeCircle horoscope={horoscope} origin={{ x: 250, y: 250 }} radius={220} />
          </div>
        </div>
      </div>
      <div style={{ display: 'flex', marginTop: '40px' }}>
        <div style={{ width: '50%', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
          <div style={{ width: '360px', padding: '16px 8px' }}>
            <PlanetPositions planets={planets} />
          </div>
        </div>
        <div style={{ width: '50%', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
          <div style={{ width: '360px', padding: '16px 8px' }}>
            <HouseCusp house={horoscope.formattedHouse} />
          </div>
        </div>
      </div>
      <div style={{ display: 'flex', marginTop: '40px' }}>
        <div style={{ width: '50%', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
          <div style={{ width: '360px', padding: '16px 8px' }}>
            <SignTable planets={planets} />
          </div>
        </div>
      </div>
    </div>
  )
}

export default HoroscopeDetailPage
