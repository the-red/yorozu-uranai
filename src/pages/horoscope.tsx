import { useEffect, useMemo, useState } from 'react'
import { useRouter } from 'next/router'
import useSWR from 'swr'
import { DateTime } from 'luxon'

import Header from '../components/Header'
import Footer from '../components/Footer'

import { Horoscope, HoroscopeProps } from '../horoscope'
import { HoroscopeForm, HoroscopeFormProps, HoroscopeFormValues } from '../horoscope/components/HoroscopeForm'
import HoroscopeDetailPage from '../horoscope/components/HoroscopeDetailPage'
import { FORM_DATE_FORMAT, FORM_TIME_FORMAT, queryToFormValues, formValuesToQuery } from '../lib/params'

const DEFAULT_LAT = 35.604839 as const
const DEFAULT_LON = 139.667717 as const

function HoroscopePage() {
  const router = useRouter()
  const [horoscope, setHoroscope] = useState<Horoscope>()

  const formValues = useMemo(() => {
    if (router.isReady) {
      const f = queryToFormValues(router.query)
      const now = DateTime.local({ zone: f.zone })
      const zone = now.zoneName

      let date: string
      let time: string | undefined
      let timeUnknown: boolean = f.timeUnknown

      if (f.date && f.time) {
        date = f.date
        time = f.time
      } else if (f.date && !f.time) {
        // NOTE: クエリで日付だけ指定の場合は、timeUnknownとして扱う
        date = f.date
        timeUnknown = true
      } else if (!f.date && f.time) {
        date = now.toFormat(FORM_DATE_FORMAT)
        time = f.time
      } else {
        date = now.toFormat(FORM_DATE_FORMAT)
        time = now.toFormat(FORM_TIME_FORMAT)
      }

      if (timeUnknown || !time) {
        timeUnknown = true
        time = '12:00'
      }

      const lat = f.lat === undefined ? DEFAULT_LAT : f.lat
      const lon = f.lon === undefined ? DEFAULT_LON : f.lon

      return { ...f, date, time, zone, timeUnknown, lat, lon }
    }
  }, [router])

  const { data, error } = useSWR<Horoscope>(
    ['/api/horoscope-props', formValues],
    async (url: string, formValues: HoroscopeFormValues) => {
      const { date, time, zone, lat, lon } = formValues
      const horoscopeSeed: {
        dateTime: DateTime
        lat: number
        lon: number
        // hsys?: string
      } = {
        dateTime: DateTime.fromISO(`${date}T${time}`, { zone }),
        lat,
        lon,
      }
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

  const handleSubmit: HoroscopeFormProps['onSubmit'] = (formValues) => {
    router.push({
      query: {
        ...router.query,
        ...formValuesToQuery(formValues),
      },
    })
  }

  return (
    <div className="horoscope">
      <Header whiteIcon={true} />
      <div className="container">
        <div className="title">Horoscope</div>
        <HoroscopeDetailPage horoscope={horoscope} orb={orb}>
          <HoroscopeForm onSubmit={handleSubmit} defaultValues={formValues} />
        </HoroscopeDetailPage>
      </div>
      <Footer />
    </div>
  )
}

export default HoroscopePage
