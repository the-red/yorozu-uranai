import { NextPage } from 'next'

import { Query } from '../../lib/params'
import { useRouter } from 'next/router'
import { useState, useEffect } from 'react'
import { useFormValues } from '../../hooks/useFormValues'
import { Saiun, generateSaiun } from '../../suimei/models/Saiun'
import { fetchSuimei } from '../../lib/fetch-suimei'
import { toErrorGuide } from '../../lib/fetch-json'
import { SaiunContent } from '../../suimei/components/Saiun'

export type OptionalQuery = Query

type SuimeiFormValues = any

const SuimeiSaiunPage: NextPage = () => {
  const router = useRouter()
  const [saiun, setSaiun] = useState<Saiun[]>()
  const [formValues, setFormValues] = useState<SuimeiFormValues>()
  const [errorMessage, setErrorMessage] = useState<string>()
  useFormValues(setFormValues, router)

  useEffect(() => {
    const load = async () => {
      if (!formValues) {
        return
      }

      try {
        const { dateTime, thisYear, sekkiPair, kanshi } = await fetchSuimei(formValues)
        setSaiun(generateSaiun(kanshi, dateTime, sekkiPair, thisYear, dateTime.year, dateTime.year + 120))
      } catch (e) {
        setErrorMessage(toErrorGuide(e))
      }
    }
    load()
  }, [formValues])

  if (errorMessage) return <div>failed to load: {errorMessage}</div>
  if (!saiun) return <div>loading...</div>

  return (
    <div className="suimei">
      <div className="main saiun_page">
        <SaiunContent saiun={saiun} />
      </div>
    </div>
  )
}

export default SuimeiSaiunPage
