import useSWR from 'swr'
import { Horoscope, HoroscopeProps } from '../horoscope'

import HouseCusp from './HouseCusp'
import SignTable from './SignTable'
import PlanetPositions from './PlanetPositions'
import dynamic from 'next/dynamic'

const HoroscopeCircle = dynamic(() => import('./HoroscopeCircle'), { ssr: false })

type HoroscopeSeed = {
  birthday: Date
  lat: number
  lon: number
  hsys?: string
  timeUnknown: boolean
}

type Props = { horoscopeSeed: HoroscopeSeed }
function HoroscopeDetailPage({ horoscopeSeed }: Props) {
  const { data: horoscope, error } = useSWR<Horoscope>(
    ['/api/horoscope', horoscopeSeed],
    async (url, horoscopeSeed) => {
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
    }
  )

  if (error) return <div>failed to load: {JSON.stringify(error.message)}</div>
  if (!horoscope) return <div>loading...</div>

  const planets = Object.values(horoscope.planets)

  return (
    <div>
      <div style={{ display: 'flex', marginBottom: '20px' }}>
        <div style={{ width: '50%', display: 'flex', justifyContent: 'center' }}>
          <HoroscopeCircle horoscope={horoscope} origin={{ x: 250, y: 250 }} radius={220}></HoroscopeCircle>
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
