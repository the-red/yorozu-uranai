import { useEffect, useMemo, useState } from 'react'
import useSWR from 'swr'

import Header from '../../components/Header'
import Footer from '../../components/Footer'

import { Horoscope, HoroscopeProps } from '../../horoscope'
import { FormValues, HoroscopeForm, HoroscopeFormProps } from '../../horoscope/components/HoroscopeForm'
import HoroscopeDetailPage from '../../horoscope/components/HoroscopeDetailPage'

type HoroscopeSeed = {
  birthday: Date
  lat: number
  lon: number
  hsys?: string
  timeUnknown: boolean
}

function HoroscopePage() {
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

  // TODO:固定値ではなく、ユーザーが画面から指定した値を使うようにしたい
  const orb = 6

  const handleSubmit: HoroscopeFormProps['onSubmit'] = ({ birthday: dateTime, lat, lon, timeUnknown }: FormValues) => {
    setHoroscopeSeed({
      birthday: dateTime,
      lat,
      lon,
      timeUnknown,
    })
  }

  return (
    <div className="horoscope">
      <Header whiteIcon={true} />
      <div className="container">
        <div className="title">Horoscope</div>
        <HoroscopeDetailPage horoscope={horoscope} orb={orb}>
          <HoroscopeForm onSubmit={handleSubmit} defaultValues={horoscopeSeed} />
        </HoroscopeDetailPage>
      </div>
      <Footer />
    </div>
  )
}

export default HoroscopePage
