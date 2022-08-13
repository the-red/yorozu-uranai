import { useEffect, useState } from 'react'
import { useRouter } from 'next/router'
import useSWR from 'swr'
import { DateTime } from 'luxon'

import Header from '../../components/Header'
import Footer from '../../components/Footer'

import { Horoscope, HoroscopeProps } from '../../horoscope'
import { FormValues, HoroscopeForm, HoroscopeFormProps } from '../../horoscope/components/HoroscopeForm'
import HoroscopeDetailPage from '../../horoscope/components/HoroscopeDetailPage'

type HoroscopeSeed = {
  birthday: DateTime
  lat: number
  lon: number
  hsys?: string
  timeUnknown: boolean
  zone: string
}

function HoroscopePage() {
  const router = useRouter()
  const [horoscopeSeed, setHoroscopeSeed] = useState<HoroscopeSeed>()
  const [horoscope, setHoroscope] = useState<Horoscope>()

  useEffect(() => {
    const singleValue = (value: string | string[] | undefined) => (Array.isArray(value) ? value[0] : value)

    if (router.isReady) {
      const { query } = router

      const unixTime = singleValue(query.birthday)
      const birthday = unixTime ? DateTime.fromSeconds(Number(unixTime)) : DateTime.now()

      const lat = singleValue(query.lat)
      const lon = singleValue(query.lon)
      const timeUnknown = singleValue(query.tmeUnknown)

      setHoroscopeSeed({
        ...horoscopeSeed,
        birthday,
        lat: lat ? Number(lat) : 35.604839,
        lon: lon ? Number(lon) : 139.667717,
        // hsys: 'Placidus(default)',
        timeUnknown: !timeUnknown || timeUnknown === 'false' ? false : true,
        zone: birthday.zoneName,
      })
    }
  }, [router])

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
  if (!horoscopeSeed || !horoscope) return <div>loading...</div>

  // TODO:固定値ではなく、ユーザーが画面から指定した値を使うようにしたい
  const orb = 6

  const handleSubmit: HoroscopeFormProps['onSubmit'] = ({ birthday: dateTime, lat, lon, timeUnknown }: FormValues) => {
    router.push({
      query: {
        birthday: dateTime.toSeconds(),
        lat,
        lon,
        timeUnknown,
      },
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
