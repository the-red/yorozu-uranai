import { NextPage } from 'next'
import { useState } from 'react'

import Header from '../../components/Header'
import Footer from '../../components/Footer'

import { NumerologyForm, NumerologyFormProps } from '../../numerology/components/NumerologyForm'
import { CoreNumbers } from '../../numerology/components/CoreNumbers'
import { Numerology } from '../../numerology/Numerology'

const NumerologyPage: NextPage = () => {
  const [numerology, setNumerology] = useState<Numerology>()

  const handleSubmit: NumerologyFormProps['onSubmit'] = ({ birthday, name }) => {
    setNumerology(new Numerology({ birthDate: birthday, fullName: name, maxSameNumber: 22 }))
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

          <NumerologyForm onSubmit={handleSubmit} />
          {numerology && <CoreNumbers numerology={numerology} />}
        </div>
        <Footer />
      </div>
    </div>
  )
}

export default NumerologyPage
