import { NextPage } from 'next'
import { useRouter } from 'next/router'
import { useState, useEffect } from 'react'
import { DateTime } from 'luxon'

import { Query, formValuesToQuery } from '../lib/params'
import Menu from '../components/Menu'
import Header from '../components/Header'
import Footer from '../components/Footer'
import { Kanshi, SekkiPair, Suimei, TenkanTsuhensei, Zoukan, ZoukanTsuhensei, tokushusei } from '../suimei/models'
import { Daiun, Gender } from '../suimei/models/Daiun'
import { SuimeiContent } from '../suimei/components/SuimeiContent'
import { useFormValues } from '../hooks/useFormValues'
import { FormProps } from '../hooks/useYorozuUranaiForm'
import { Juuniun } from '../suimei/models/Juuniun'

export type OptionalQuery = Query

type SuimeiFormValues = any

const SuimeiPage: NextPage = () => {
  const router = useRouter()
  const [suimei, setSuimei] = useState<Suimei>()
  const [formValues, setFormValues] = useState<SuimeiFormValues>()
  const [errorMessage, setErrorMessage] = useState<string>()
  useFormValues(setFormValues, router)

  useEffect(() => {
    const load = async () => {
      if (!formValues) {
        return
      }

      const { date, time, zone, gender } = formValues
      const suimeiSeed: {
        dateTime: DateTime
        gender: Gender
      } = {
        dateTime: DateTime.fromISO(`${date}T${time}`, { zone }),
        gender,
      }
      const res = await fetch('/api/suimei-props', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(suimeiSeed),
      })
      if (!res.ok) {
        const { errorMessage } = await res.json()
        setErrorMessage(errorMessage)
      }
      const json = await res.json()
      const sekkiPair = json.sekkiPair as SekkiPair
      const kanshi = new Kanshi(suimeiSeed.dateTime, sekkiPair)
      const zoukan = new Zoukan(kanshi)
      const daiunDetail = json.daiun as Daiun[]

      setSuimei({
        sekki: sekkiPair.today,
        kanshi,
        tenkanTsuhensei: new TenkanTsuhensei(kanshi),
        zoukan,
        zoukanTsuhensei: new ZoukanTsuhensei(zoukan),
        tokushusei: tokushusei(kanshi),
        juuniun: new Juuniun(kanshi),
        daiun: daiunDetail,
      })
    }
    load()
  }, [formValues])

  if (errorMessage) return <div>failed to load: {JSON.stringify(errorMessage)}</div>
  if (!suimei) return <div>loading...</div>

  const handleSubmit: FormProps['onSubmit'] = (formValues) => {
    router.push({
      query: {
        ...router.query,
        ...formValuesToQuery(formValues),
      },
    })
  }

  return (
    <div className="suimei">
      <div>
        <Menu />
        <Header />
        <SuimeiContent suimei={suimei} onSubmit={handleSubmit} defaultValues={formValues} />
        <Footer />
      </div>
    </div>
  )
}

export default SuimeiPage
