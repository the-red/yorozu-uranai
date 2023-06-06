import { useEffect, useState } from 'react'
import { useRouter } from 'next/router'
import useSWR from 'swr'
import { DateTime } from 'luxon'

import Menu from '../components/Menu'
import Header from '../components/Header'
import Footer from '../components/Footer'

import { Horoscope, HoroscopeProps } from '../horoscope/models'
import HoroscopeDetailPage from '../horoscope/components/HoroscopeDetailPage'
import { Query, formValuesToQuery } from '../lib/params'
import { FormProps, FormValues } from '../hooks/useYorozuUranaiForm'
import { useFormValues } from '../hooks/useFormValues'

export type OptionalQuery = Query

function HoroscopePage() {
  const router = useRouter()
  const [horoscope, setHoroscope] = useState<Horoscope>()
  const [formValues, setFormValues] = useState<FormValues>()
  useFormValues(setFormValues, router)

  const { data, error } = useSWR<Horoscope | undefined>([formValues], async (formValues: FormValues) => {
    if (!formValues) {
      return
    }

    const { date, time, zone, lat, lng } = formValues
    const horoscopeSeed: {
      dateTime: DateTime
      lat: number
      lng: number
      // hsys?: string
    } = {
      dateTime: DateTime.fromISO(`${date}T${time}`, { zone }),
      lat,
      lng,
    }
    const res = await fetch('/api/horoscope-props', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(horoscopeSeed),
    })
    if (!res.ok) {
      const errorMessage = await res.text()
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

  if (error) return <div>failed to load: {error.message}</div>
  // TODO: loading時にヘッダー・タイトル・背景色くらいは出したい
  if (!horoscope) return <div>loading...</div>

  // TODO:固定値ではなく、ユーザーが画面から指定した値を使うようにしたい
  const orb = 6

  const handleSubmit: FormProps['onSubmit'] = (formValues) => {
    router.push({
      query: {
        ...router.query,
        ...formValuesToQuery(formValues),
      },
    })
  }

  return (
    <div className="horoscope">
      <Menu />
      <Header whiteIcon={true} />
      <div className="container">
        <div className="title">Horoscope</div>
        <HoroscopeDetailPage
          horoscope={horoscope}
          orb={orb}
          onSubmit={handleSubmit}
          defaultValues={formValues}
        ></HoroscopeDetailPage>
      </div>
      <Footer />
    </div>
  )
}

export default HoroscopePage
