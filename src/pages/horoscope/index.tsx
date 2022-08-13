import Header from '../../components/Header'
import Footer from '../../components/Footer'
import HoroscopeDetailPage from '../../horoscope/components/HoroscopeDetailPage'

function HoroscopePage() {
  return (
    <div className="horoscope">
      <Header whiteIcon={true} />
      <div className="container">
        <div className="title">Horoscope</div>
        <HoroscopeDetailPage />
      </div>
      <Footer />
    </div>
  )
}

export default HoroscopePage
