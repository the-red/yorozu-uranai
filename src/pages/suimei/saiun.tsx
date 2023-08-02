import { NextPage } from 'next'

import { Query } from '../../lib/params'
import { DateTime } from 'luxon'
import { useRouter } from 'next/router'
import { useState, useEffect } from 'react'
import { useFormValues } from '../../hooks/useFormValues'
import { SekkiPair, Kanshi } from '../../suimei/models'
import { Gender } from '../../suimei/models/Daiun'
import { Saiun, generateSaiun } from '../../suimei/models/Saiun'
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
      const saiun = generateSaiun(kanshi, suimeiSeed.dateTime, sekkiPair, DateTime.now().year)

      setSaiun(saiun)
    }
    load()
  }, [formValues])

  if (errorMessage) return <div>failed to load: {JSON.stringify(errorMessage)}</div>
  if (!saiun) return <div>loading...</div>

  return (
    <div className="suimei">
      <div className="main" style={{ paddingTop: '30px' }}>
        <SaiunContent saiun={saiun} />
      </div>
    </div>
  )
}

export default SuimeiSaiunPage
