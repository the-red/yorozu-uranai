import { useState } from 'react'
import { useRouter } from 'next/router'

import Menu from '../components/Menu'
import Header from '../components/Header'
import Footer from '../components/Footer'

import { Horoscope } from '../horoscope/models'
import HoroscopeDetailPage from '../horoscope/components/HoroscopeDetailPage'
import { Query, formValuesToQuery } from '../lib/params'
import { FormProps, FormValues } from '../hooks/useYorozuUranaiForm'
import { useFormValues } from '../hooks/useFormValues'
import { useResult } from '../hooks/useResult'
import { getHash, useHoroscopeSettings } from '../hooks/useHoroscopeSettings'
import { fetchJson, toErrorGuide } from '../lib/fetch-json'
import type { HoroscopeJson } from '../lib/json-api'

export type OptionalQuery = Query

const loadHoroscope = async (formValues: FormValues) => {
  const { raw } = await fetchJson<HoroscopeJson>('/horoscope', formValues)
  return new Horoscope(raw)
}

function HoroscopePage() {
  const router = useRouter()
  const [formValues, setFormValues] = useState<FormValues>()
  useFormValues(setFormValues, router)
  const { result: horoscope, error, loading } = useResult(formValues, loadHoroscope)
  const [settings, setSettings] = useHoroscopeSettings(router)

  const handleSubmit: FormProps['onSubmit'] = (formValues) => {
    router.push({
      query: {
        ...router.query,
        ...formValuesToQuery(formValues),
      },
      // 画面の設定は、入力を変えても、そのまま使う
      hash: getHash(),
    })
  }

  return (
    <div className="horoscope">
      <Menu />
      <Header whiteIcon={true} />
      <div className="container">
        <div className="title">Horoscope</div>
        {formValues ? (
          <HoroscopeDetailPage
            horoscope={horoscope}
            settings={settings}
            onChangeSettings={setSettings}
            loading={loading}
            onSubmit={handleSubmit}
            defaultValues={formValues}
            errorMessage={
              error === undefined ? undefined : `ホロスコープを作成できませんでした。\n${toErrorGuide(error)}`
            }
          ></HoroscopeDetailPage>
        ) : (
          <div className="loading">読み込み中…</div>
        )}
      </div>
      <Footer />
    </div>
  )
}

export default HoroscopePage
