import { useEffect, useState } from 'react'
import { useRouter } from 'next/router'
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
  const [error, setError] = useState<string>()
  useFormValues(setFormValues, router)

  useEffect(() => {
    const load = async () => {
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
        const errorText = await res.text()
        try {
          const { errorMessage } = JSON.parse(errorText)
          let message = `ホロスコープを作成できませんでした。入力値が不正です。\n\n${errorMessage}`
          switch (errorMessage) {
            case 'Invalid birthday':
              message += '\n生年月日を修正してください。'
              break
            case `Can't calculate houses.`:
              message += '\n出生場所を修正してください。'
              break
          }
          alert(message)
        } catch (e) {
          alert(errorText)
        } finally {
          return
        }
      }
      const json = await res.json()
      const horoscopeProps = json.data as HoroscopeProps
      setHoroscope(new Horoscope(horoscopeProps))
    }
    load()
  }, [formValues])

  // TODO: useEffect内のalertよりも、errorの内容をtoastで表示したい
  if (error) return <div>failed to load: {error}</div>
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
