import { useEffect, useMemo, useState } from 'react'
import dynamic from 'next/dynamic'
import useSWR from 'swr'

import { Horoscope, HoroscopeProps } from '../'

import { FormValues, HoroscopeForm } from './HoroscopeForm'
import PlanetPositions from './PlanetPositions'
import HouseCusp from './HouseCusp'
import SignTable from './SignTable'
import AspectChart from './AspectChart'
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

  // TODO:固定値ではなく、ユーザーが画面から指定した値を使うようにしたい
  const orb = 6

  return (
    <div>
      <div className="content-row">
        <div className="content form">
          <div className="content-inner">
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
        <>
          <div className="content circle pc">
            <HoroscopeCircle horoscope={horoscope} radius={220} orb={orb} />
          </div>
          <div className="content circle sp">
            <HoroscopeCircle horoscope={horoscope} radius={170} orb={orb} />
          </div>
        </>
      </div>
      <div className="content-row">
        <div className="content">
          <div className="content-inner">
            <PlanetPositions horoscope={horoscope} />
          </div>
        </div>
        <div className="content">
          <div className="content-inner">
            <HouseCusp horoscope={horoscope} />
          </div>
        </div>
      </div>
      <div className="content-row">
        <div className="content">
          <div className="content-inner">
            <SignTable planets={planets} />
          </div>
        </div>
        <div className="content">
          <div className="content-inner">
            <AspectChart horoscope={horoscope} orb={orb} />
          </div>
        </div>
      </div>
    </div>
  )
}

export default HoroscopeDetailPage
