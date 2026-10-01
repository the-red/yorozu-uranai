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
import { JsonApiError, fetchJson, toErrorGuide } from '../lib/fetch-json'
import type { HoroscopeJson } from '../lib/json-api'
import { toUrl } from '../lib/url'
import type { AspectQuery } from '../horoscope/models'

export type OptionalQuery = Query & AspectQuery

const loadHoroscope = async (formValues: FormValues) => {
  const { input, raw } = await fetchJson<HoroscopeJson>('/horoscope', formValues)
  return { horoscope: new Horoscope(raw), houseSystem: input.house }
}

// 利用者への案内
const toGuide = (error: unknown) => {
  // ハウスを計算できない場所（極圏の、プラシーダスとコッホ）でも、ほかのハウスシステムなら、計算できる
  const isHousesError =
    error instanceof JsonApiError && error.error.code === 'calculation_failed' && error.error.params.includes('lat')
  return toErrorGuide(error) + (isHousesError ? '\nまたは、ハウスシステムを変えてください。' : '')
}

function HoroscopePage() {
  const router = useRouter()
  const [formValues, setFormValues] = useState<FormValues>()
  useFormValues(setFormValues, router)
  const { result, error, loading } = useResult(formValues, loadHoroscope)
  const [settings, setSettings] = useHoroscopeSettings(router)

  const handleSubmit: FormProps['onSubmit'] = (formValues) => {
    // NOTE: ハウスは、最初の状態（プラシーダス）のときに、クエリに入れない。前の値が残らないように、外しておく
    const { house: _, ...rest } = router.query
    // NOTE: 画面の設定は、入力を変えても、そのまま使う。アスペクトの求め方は、クエリに残っている。表示するものは、ハッシュ
    router.push(toUrl(router.pathname, { ...rest, ...formValuesToQuery(formValues) }, getHash()))
  }

  return (
    <div className="horoscope">
      <Menu />
      <Header whiteIcon={true} />
      <div className="container">
        <div className="title">Horoscope</div>
        {formValues ? (
          <HoroscopeDetailPage
            horoscope={result?.horoscope}
            houseSystem={result?.houseSystem}
            settings={settings}
            onChangeSettings={setSettings}
            loading={loading}
            onSubmit={handleSubmit}
            defaultValues={formValues}
            errorMessage={error === undefined ? undefined : `ホロスコープを作成できませんでした。\n${toGuide(error)}`}
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
