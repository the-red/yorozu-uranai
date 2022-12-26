import { NextPage } from 'next'
import { SuimeiContent } from '../suimei/components/SuimeiContent'

import Header from '../components/Header'
import Footer from '../components/Footer'

const SuimeiPage: NextPage = () => {
  return (
    <div className="suimei">
      <div
        className="tw-min-h-screen tw-pb-8 tw-flex tw-flex-col tw-justify-between tw-items-center tw-space-y-4"
        style={{ fontFamily: 'Serif' }}
      >
        <Header />
        <SuimeiContent />
        <Footer />
      </div>
    </div>
  )
}

export default SuimeiPage
