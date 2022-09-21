import { NextPage } from 'next'
import { useRouter } from 'next/router'
import { useEffect, useMemo, useState } from 'react'
import { DateTime } from 'luxon'
import { Kanshi, Sekki } from '../suimei'

import Header from '../components/Header'
import Footer from '../components/Footer'

import { Query } from '../lib/params'
import useSWR from 'swr'

export type OptionalQuery = Query

type Suimei = any
type SuimeiFormValues = any

const SuimeiPage: NextPage = () => {
  const router = useRouter()
  const [suimei, setSuimei] = useState<Suimei>()

  const formValues = useMemo(() => {
    if (router.isReady) {
      return {}
    }
  }, [router])

  const { data, error } = useSWR<Kanshi>([formValues], async (formValues: SuimeiFormValues) => {
    const { date, time, zone } = formValues
    const suimeiSeed: {
      dateTime: DateTime
    } = {
      dateTime: DateTime.now(),
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
    const sekki = json.data as Sekki
    return new Kanshi(suimeiSeed.dateTime, sekki)
  })

  useEffect(() => {
    // NOTE: refetchのたびにdataにundefが入り、画面がチラつくことを避ける
    if (data) {
      setSuimei(data)
    }
  }, [data])

  if (error) return <div>failed to load: {JSON.stringify(error.message)}</div>
  if (!suimei) return <div>loading...</div>

  console.log(suimei)

  return (
    <div className="suimei">
      <div
        className="tw-min-h-screen tw-pb-8 tw-flex tw-flex-col tw-justify-between tw-items-center tw-space-y-4"
        style={{ fontFamily: 'Serif' }}
      >
        <Header />
        <div className="tw-w-full tw-max-w-screen-md tw-px-4 tw-mx-auto tw-space-y-8">
          <div className="tw-text-center tw-text-7xl sm:tw-text-10xl">四柱推命</div>
          <table>
            <tr>
              <th></th>
              <th>時柱</th>
              <th>日柱</th>
              <th>月柱</th>
              <th>年柱</th>
            </tr>
            {['天干', '地支'].map((kanshi, i) => (
              <tr key={i}>
                <td>{kanshi}</td>
                <td>foo</td>
                <td>bar</td>
                <td>baz</td>
                <td>qux</td>
              </tr>
            ))}
          </table>
        </div>
        <Footer />
      </div>
    </div>
  )
}

export default SuimeiPage
