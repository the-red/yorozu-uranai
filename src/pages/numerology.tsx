import { NextPage } from 'next'
import { useRouter } from 'next/router'
import { useEffect, useState } from 'react'
import { DateTime } from 'luxon'

import Menu from '../components/Menu'
import Header from '../components/Header'
import Footer from '../components/Footer'

import { NumerologyForm, NumerologyFormProps, NumerologyFormValues } from '../numerology/components/NumerologyForm'
import { CoreNumbers } from '../numerology/components/CoreNumbers'
import { Numerology } from '../numerology/models/Numerology'
import { Query, queryToFormValues, formValuesToQuery, FORM_DATE_FORMAT } from '../lib/params'

export type OptionalQuery = Query

const NumerologyPage: NextPage = () => {
  const router = useRouter()
  const [formValues, setFormValues] = useState<Partial<NumerologyFormValues>>()
  const [numerology, setNumerology] = useState<Numerology>()

  useEffect(() => {
    if (router.isReady) {
      const f = queryToFormValues(router.query)
      setFormValues(f)

      if (f.name && f.date) {
        setNumerology(
          new Numerology({
            birthDate: DateTime.fromFormat(f.date, FORM_DATE_FORMAT),
            fullName: f.name,
            maxSameNumber: 22,
          })
        )
      }
    }
  }, [router])

  const handleSubmit: NumerologyFormProps['onSubmit'] = (formValues) => {
    router.push({
      query: {
        ...router.query,
        ...formValuesToQuery(formValues),
      },
    })
  }

  return (
    <div className="numerology">
      <div className="wrapper" style={{ backgroundColor: '#EBEBC1', fontFamily: 'Lato Regular, Noto Sans JP Regular' }}>
        <Menu />
        <Header />
        <div className="contents">
          <div style={{ fontFamily: 'MTF Wildflower' }} className="page_title">
            numerology
          </div>
          <NumerologyForm onSubmit={handleSubmit} defaultValues={formValues} />
          {numerology && <CoreNumbers numerology={numerology} />}
        </div>
        <Footer />
      </div>
    </div>
  )
}

export default NumerologyPage
