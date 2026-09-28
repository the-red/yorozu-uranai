import { NextPage } from 'next'
import { useRouter } from 'next/router'
import { useMemo } from 'react'
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

  // NOTE: クエリは、ブラウザで表示してからでないと読めない（router.isReady）
  const formValues = useMemo(
    () => (router.isReady ? queryToFormValues(router.query) : undefined),
    [router.isReady, router.query]
  )
  const numerology = useMemo(() => {
    if (!formValues?.name || !formValues.date) {
      return undefined
    }
    return new Numerology({
      birthDate: DateTime.fromFormat(formValues.date, FORM_DATE_FORMAT),
      fullName: formValues.name,
      maxSameNumber: 22,
    })
  }, [formValues])

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
      <div className="wrapper">
        <Menu />
        <Header />
        <div className="contents">
          <div className="page_title">numerology</div>
          <NumerologyForm onSubmit={handleSubmit} defaultValues={formValues} />
          {numerology && <CoreNumbers numerology={numerology} />}
        </div>
        <Footer />
      </div>
    </div>
  )
}

export default NumerologyPage
