import { NextPage } from 'next'
import { useRouter } from 'next/router'
import { useState } from 'react'

import { Query, formValuesToQuery } from '../lib/params'
import Menu from '../components/Menu'
import Header from '../components/Header'
import Footer from '../components/Footer'
import { Suimei, TenkanTsuhensei, Zoukan, ZoukanTsuhensei, tokushusei } from '../suimei/models'
import { SuimeiContent } from '../suimei/components/SuimeiContent'
import { useFormValues } from '../hooks/useFormValues'
import { useResult } from '../hooks/useResult'
import { FormProps, FormValues } from '../hooks/useYorozuUranaiForm'
import { Juuniun } from '../suimei/models/Juuniun'
import { generateSaiun } from '../suimei/models/Saiun'
import { fetchSuimei } from '../lib/fetch-suimei'
import { toErrorGuide } from '../lib/fetch-json'

export type OptionalQuery = Query

const loadSuimei = async (formValues: FormValues): Promise<Suimei> => {
  const { dateTime, thisYear, sekkiPair, solarTime, kanshi, daiun } = await fetchSuimei(formValues)
  const zoukan = new Zoukan(kanshi)

  const saiun1stYear = Math.max(thisYear - 5, dateTime.year)
  const saiunLastYear = Math.max(thisYear, dateTime.year) + 10
  const saiun = generateSaiun(kanshi, dateTime, sekkiPair, thisYear, saiun1stYear, saiunLastYear)

  return {
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
  }
}

const SuimeiPage: NextPage = () => {
  const router = useRouter()
  const [formValues, setFormValues] = useState<FormValues>()
  useFormValues(setFormValues, router)
  const { result: suimei, error, loading } = useResult(formValues, loadSuimei)

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
        {formValues ? (
          <SuimeiContent
            suimei={suimei}
            query={router.query}
            loading={loading}
            onSubmit={handleSubmit}
            defaultValues={formValues}
            errorMessage={error === undefined ? undefined : `命式を作成できませんでした。\n${toErrorGuide(error)}`}
          />
        ) : (
          <div className="main">
            <div className="loading">読み込み中…</div>
          </div>
        )}
        <Footer />
      </div>
    </div>
  )
}

export default SuimeiPage
