import { NextPage } from 'next'
import { useRouter } from 'next/router'
import { useEffect, useMemo, useState } from 'react'
import { DateTime } from 'luxon'
import { Kanshi, SekkiPair } from '../suimei'

import Header from '../components/Header'
import Footer from '../components/Footer'

import { Query } from '../lib/params'
import useSWR from 'swr'

export type OptionalQuery = Query

type Suimei = { sekki: string; kanshi: Kanshi }
type SuimeiFormValues = any

const SuimeiPage: NextPage = () => {
  const router = useRouter()
  const [suimei, setSuimei] = useState<Suimei>()

  const formValues = useMemo(() => {
    if (router.isReady) {
      return {}
    }
  }, [router])

  // 暫定的な固定値
  const NOW = DateTime.now()

  const { data, error } = useSWR<Suimei>([formValues], async (formValues: SuimeiFormValues) => {
    const { date, time, zone } = formValues
    const suimeiSeed: {
      dateTime: DateTime
    } = {
      dateTime: NOW,
      // dateTime: DateTime.fromISO(`${date}T${time}`, { zone }),
    }
    const res = await fetch('/api/suimei-props', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(suimeiSeed),
    })
    if (!res.ok) {
      const { errorMessage } = await res.json()
      throw new Error(errorMessage)
    }
    const json = await res.json()
    const sekkiPair = json.data as SekkiPair
    return {
      sekki: sekkiPair.today,
      kanshi: new Kanshi(suimeiSeed.dateTime, sekkiPair),
    }
  })

  useEffect(() => {
    // NOTE: refetchのたびにdataにundefが入り、画面がチラつくことを避ける
    if (data) {
      setSuimei(data)
    }
  }, [data])

  if (error) return <div>failed to load: {JSON.stringify(error.message)}</div>
  if (!suimei) return <div>loading...</div>

  const { sekki, kanshi } = suimei

  return (
    <div className="suimei">
      <div
        className="tw-min-h-screen tw-pb-8 tw-flex tw-flex-col tw-justify-between tw-items-center tw-space-y-4"
        style={{ fontFamily: 'Serif' }}
      >
        <Header />
        <div className="tw-w-full tw-max-w-screen-md tw-px-4 tw-mx-auto tw-space-y-8">
          <div className="tw-text-center tw-text-7xl sm:tw-text-10xl">四柱推命</div>
          <p>{NOW.toString()}</p>
          <p>二十四節気： {sekki}</p>
          <table>
            <thead>
              <tr>
                <th></th>
                <th>時柱</th>
                <th>月柱</th>
                <th>日柱</th>
                <th>年柱</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <th>天干</th>
                <td>{kanshi.年柱[0]}</td>
                <td>{kanshi.月柱[0]}</td>
                <td>{kanshi.日柱[0]}</td>
                <td>{kanshi.時柱[0]}</td>
              </tr>
              <tr>
                <th>地支</th>
                <td>{kanshi.年柱[1]}</td>
                <td>{kanshi.月柱[1]}</td>
                <td>{kanshi.日柱[1]}</td>
                <td>{kanshi.時柱[1]}</td>
              </tr>
              <tr>
                <th>干支</th>
                <td>{kanshi.年柱}</td>
                <td>{kanshi.月柱}</td>
                <td>{kanshi.日柱}</td>
                <td>{kanshi.時柱}</td>
              </tr>
            </tbody>
          </table>
        </div>
        <Footer />
      </div>
    </div>
  )
}

export default SuimeiPage
