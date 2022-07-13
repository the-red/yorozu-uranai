import Header from '../../components/Header'
import Footer from '../../components/Footer'
import HoroscopeDetailPage from '../../components/HoroscopeDetailPage'
import styles from './HoroscopePage.module.css'

function HoroscopePage() {
  return (
    <div className={`${styles['horoscope-page']} horoscope-index-root`}>
      <Header />
      <div className={styles.container}>
        <div className={styles.title}>Horoscope</div>
        <HoroscopeDetailPage />
      </div>
      <Footer />
    </div>
  )
}

export default HoroscopePage
