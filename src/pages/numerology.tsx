import { NextPage } from 'next'
import { useRouter } from 'next/router'
import { useEffect, useState } from 'react'
import { DateTime } from 'luxon'

import Header from '../components/Header'
import Footer from '../components/Footer'

import { NumerologyForm, NumerologyFormProps } from '../numerology/components/NumerologyForm'
import { CoreNumbers } from '../numerology/components/CoreNumbers'
import { Numerology } from '../numerology/Numerology'
import params from '../lib/params'

type NumerologySeed = {
  name: string
  date: DateTime
}

const NumerologyPage: NextPage = () => {
  const router = useRouter()
  const [numerologySeed, setNumerologySeed] = useState<NumerologySeed>()
  const [numerology, setNumerology] = useState<Numerology>()

  useEffect(() => {
    if (router.isReady) {
      const p = params.fromQuery(router.query)

      if (p.name && p.date) {
        const date = DateTime.fromISO(p.date)

        setNumerologySeed({
          name: p.name,
          date,
        })

        setNumerology(
          new Numerology({
            birthDate: date.toJSDate(),
            fullName: p.name,
            maxSameNumber: 22,
          })
        )
      }
    }
  }, [router, router.query])

  const handleSubmit: NumerologyFormProps['onSubmit'] = (formValues) => {
    router.push({ query: params.toQuery(formValues) })
  }

  return (
    <div className="numerology">
      <div
        className="tw-min-h-screen tw-pb-8 tw-flex tw-flex-col tw-justify-between tw-items-center tw-space-y-4"
        style={{ backgroundColor: '#EBEBC1', fontFamily: 'Lato Regular, Noto Sans JP Regular' }}
      >
        <Header />
        <div className="tw-w-full tw-max-w-screen-md tw-px-4 tw-mx-auto tw-space-y-8">
          <div style={{ fontFamily: 'MTF Wildflower' }} className="tw-text-center tw-text-7xl sm:tw-text-10xl">
            numerology
          </div>
          <NumerologyForm
            onSubmit={handleSubmit}
            defaultValues={
              numerologySeed && {
                name: numerologySeed.name,
                date: numerologySeed.date.toISODate(),
              }
            }
          />
          {numerology && <CoreNumbers numerology={numerology} />}
        </div>
        <Footer />
      </div>
    </div>
  )
}

export default NumerologyPage
