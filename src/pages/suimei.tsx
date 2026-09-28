import { NextPage } from 'next'
import { useRouter } from 'next/router'
import { useState, useEffect } from 'react'

import { Query, formValuesToQuery } from '../lib/params'
import Menu from '../components/Menu'
import Header from '../components/Header'
import Footer from '../components/Footer'
import { Suimei, TenkanTsuhensei, Zoukan, ZoukanTsuhensei, tokushusei } from '../suimei/models'
import { SuimeiContent } from '../suimei/components/SuimeiContent'
import { useFormValues } from '../hooks/useFormValues'
import { FormProps } from '../hooks/useYorozuUranaiForm'
import { Juuniun } from '../suimei/models/Juuniun'
import { generateSaiun } from '../suimei/models/Saiun'
import { fetchSuimei } from '../lib/fetch-suimei'
import { toErrorGuide } from '../lib/fetch-json'

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

      try {
        const { dateTime, thisYear, sekkiPair, solarTime, kanshi, daiun } = await fetchSuimei(formValues)
        const zoukan = new Zoukan(kanshi)

        const saiun1stYear = Math.max(thisYear - 5, dateTime.year)
        const saiunLastYear = Math.max(thisYear, dateTime.year) + 10
        const saiun = generateSaiun(kanshi, dateTime, sekkiPair, thisYear, saiun1stYear, saiunLastYear)

        setSuimei({
          sekki: sekkiPair.today,
          solarTime,
          kanshi,
          tenkanTsuhensei: new TenkanTsuhensei(kanshi),
          zoukan,
          zoukanTsuhensei: new ZoukanTsuhensei(zoukan),
          tokushusei: tokushusei(kanshi),
          juuniun: new Juuniun(kanshi),
          daiun,
          saiun,
        })
      } catch (e) {
        setErrorMessage(toErrorGuide(e))
      }
    }
    load()
  }, [formValues])

  if (errorMessage) return <div>failed to load: {errorMessage}</div>
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
        <SuimeiContent suimei={suimei} query={router.query} onSubmit={handleSubmit} defaultValues={formValues} />
        <Footer />
      </div>
    </div>
  )
}

export default SuimeiPage
