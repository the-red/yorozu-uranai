import HoroscopeDetailPage from '../../components/HoroscopeDetailPage'
import styles from './HoroscopePage.module.css'

function HoroscopePage() {
  return (
    <div className={styles.container}>
      <div className={styles.title}>Horoscope</div>
      <HoroscopeDetailPage />
    </div>
  )
}

export default HoroscopePage
