import { NextPage } from 'next'
import Link from 'next/link'
import { useRouter } from 'next/router'
import { useState } from 'react'

import { pagesPath } from '../../lib/$path'
import { Query } from '../../lib/params'
import { useFormValues } from '../../hooks/useFormValues'
import { useResult } from '../../hooks/useResult'
import { FormValues } from '../../hooks/useYorozuUranaiForm'
import { generateSaiun } from '../../suimei/models/Saiun'
import { fetchSuimei } from '../../lib/fetch-suimei'
import { toErrorGuide } from '../../lib/fetch-json'
import { SaiunContent } from '../../suimei/components/Saiun'

export type OptionalQuery = Query

// 生まれ年から120年分
const loadSaiun = async (formValues: FormValues) => {
  const { dateTime, thisYear, sekkiPair, kanshi } = await fetchSuimei(formValues)
  return generateSaiun(kanshi, dateTime, sekkiPair, thisYear, dateTime.year, dateTime.year + 120)
}

const SuimeiSaiunPage: NextPage = () => {
  const router = useRouter()
  const [formValues, setFormValues] = useState<FormValues>()
  useFormValues(setFormValues, router)
  const { result: saiun, error } = useResult(formValues, loadSaiun)

  return (
    <div className="suimei">
      <div className="main saiun_page">
        {saiun ? (
          <SaiunContent saiun={saiun} />
        ) : error === undefined ? (
          <div className="loading">読み込み中…</div>
        ) : (
          // このページにはフォームが無いので、入力を直せるページに案内する
          <div className="load_error" role="alert">
            <p>{`歳運を表示できませんでした。\n${toErrorGuide(error)}`}</p>
            <Link href={pagesPath.suimei.$url({ query: router.query })}>四柱推命のページで、入力を修正する</Link>
          </div>
        )}
      </div>
    </div>
  )
}

export default SuimeiSaiunPage
