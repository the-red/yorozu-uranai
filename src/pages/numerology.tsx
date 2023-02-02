import { NextPage } from 'next'
import { useRouter } from 'next/router'
import { useEffect, useState } from 'react'

import Menu from '../components/Menu'
import Header from '../components/Header'
import Footer from '../components/Footer'

import { NumerologyForm, NumerologyFormProps, NumerologyFormValues } from '../numerology/components/NumerologyForm'
import { CoreNumbers } from '../numerology/components/CoreNumbers'
import { Numerology } from '../numerology/Numerology'
import { Query, queryToFormValues, formValuesToQuery } from '../lib/params'

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
            birthDate: new Date(f.date),
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
      <div
        className="tw-min-h-screen tw-pb-8 tw-flex tw-flex-col tw-items-center tw-space-y-4"
        style={{ backgroundColor: '#EBEBC1', fontFamily: 'Lato Regular, Noto Sans JP Regular' }}
      >
        <Menu />
        <Header />
        <div className="tw-w-full tw-max-w-screen-md tw-px-4 tw-mx-auto tw-space-y-8">
          <div style={{ fontFamily: 'MTF Wildflower' }} className="tw-text-center tw-text-7xl sm:tw-text-10xl">
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
