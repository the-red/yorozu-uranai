import { useEffect, useState } from 'react'
import router, { useRouter } from 'next/router'
import useSWR from 'swr'
import { DateTime } from 'luxon'
import { Client } from '@googlemaps/google-maps-services-js'

import Menu from '../components/Menu'
import Header from '../components/Header'
import Footer from '../components/Footer'

import { Horoscope, HoroscopeProps } from '../horoscope'
import { HoroscopeForm, HoroscopeFormProps, HoroscopeFormValues } from '../horoscope/components/HoroscopeForm'
import HoroscopeDetailPage from '../horoscope/components/HoroscopeDetailPage'
import { Query, FORM_DATE_FORMAT, FORM_TIME_FORMAT, queryToFormValues, formValuesToQuery } from '../lib/params'
import { TOKYO_STATION } from '../lib/location'

export type OptionalQuery = Query

const geocode = async ({ lat, lng }: { lat: number; lng: number }) => {
  const client = new Client()
  const addresses = await client
    .reverseGeocode({
      params: {
        key: process.env.NEXT_PUBLIC_GOOGLE_GEOCODING_API_KEY!,
        latlng: { lat, lng },
      },
    })
    .then(({ data }) => data.results)

  const localityAddress = addresses
    // @ts-expect-error
    .find((a) => a.types.includes('locality'))
  const politicalAddress = addresses
    // @ts-expect-error
    .find((a) => a.types.includes('political'))

  const [address] = [localityAddress, politicalAddress].map((_) => _?.formatted_address)
  return address
}

function HoroscopePage() {
  const router = useRouter()
  const [horoscope, setHoroscope] = useState<Horoscope>()
  const [formValues, setFormValues] = useState<HoroscopeFormValues>()

  useEffect(() => {
    const setDefaultFormValues = async () => {
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

        const defaultLocation = TOKYO_STATION
        const lat = f.lat === undefined ? defaultLocation.lat : f.lat
        const lng = f.lng === undefined ? defaultLocation.lng : f.lng

        const address = await geocode({ lat, lng })
        // TODO: 画面に表示
        console.log(address)

        setFormValues({ ...f, date, time, zone, timeUnknown, lat, lng })
      }
    }
    setDefaultFormValues()
  }, [router])

  const { data, error } = useSWR<Horoscope | undefined>([formValues], async (formValues: HoroscopeFormValues) => {
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
  // TODO: loading時にヘッダー・タイトル・背景色くらいは出したい
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
      <Menu />
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
