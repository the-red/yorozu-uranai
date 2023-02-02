import { NextPage } from 'next'
import { SuimeiContent } from '../suimei/components/SuimeiContent'

import Header from '../components/Header'
import Footer from '../components/Footer'

const SuimeiPage: NextPage = () => {
  return (
    <div className="suimei">
      <div>
        <Header />
        <SuimeiContent />
        <Footer />
      </div>
    </div>
  )
}

export default SuimeiPage
