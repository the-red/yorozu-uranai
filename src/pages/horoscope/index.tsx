import { useEffect, useState } from 'react'
import { useRouter } from 'next/router'
import useSWR from 'swr'
import { DateTime } from 'luxon'

import Header from '../../components/Header'
import Footer from '../../components/Footer'

import { Horoscope, HoroscopeProps } from '../../horoscope'
import { FormValues, HoroscopeForm, HoroscopeFormProps } from '../../horoscope/components/HoroscopeForm'
import HoroscopeDetailPage from '../../horoscope/components/HoroscopeDetailPage'
import params from '../../lib/params'

type HoroscopeSeed = {
  dateTime: DateTime
  zone: string
  timeUnknown: boolean
  lat: number
  lon: number
  // hsys?: string
}

function HoroscopePage() {
  const router = useRouter()
  const [horoscopeSeed, setHoroscopeSeed] = useState<HoroscopeSeed>()
  const [horoscope, setHoroscope] = useState<Horoscope>()

  useEffect(() => {
    if (router.isReady) {
      const p = params.fromQuery(router.query)
      setHoroscopeSeed({
        ...horoscopeSeed,
        dateTime: p.dateTime,
        zone: p.zone,
        timeUnknown: p.timeUnknown,
        lat: p.lat,
        lon: p.lon,
        // hsys: 'Placidus(default)',
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

  const handleSubmit: HoroscopeFormProps['onSubmit'] = (p: FormValues) => {
    router.push({ query: params.toQuery(p) })
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
