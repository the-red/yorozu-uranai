import { NextPage } from 'next'
import { useRouter } from 'next/router'
import { useState, useMemo, useEffect } from 'react'
import useSWR from 'swr'
import { DateTime } from 'luxon'

import { Query } from '../lib/params'
import Header from '../components/Header'
import Footer from '../components/Footer'
import { Kanshi, SekkiPair, Suimei, TenkanTsuhensei } from '../suimei'
import { SuimeiContent } from '../suimei/components/SuimeiContent'

export type OptionalQuery = Query

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
    const kanshi = new Kanshi(suimeiSeed.dateTime, sekkiPair)
    return {
      sekki: sekkiPair.today,
      kanshi,
      tsuhensei: new TenkanTsuhensei(kanshi),
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

  return (
    <div className="suimei">
      <div>
        <Header />
        <SuimeiContent suimei={suimei} />
        <Footer />
      </div>
    </div>
  )
}

export default SuimeiPage
