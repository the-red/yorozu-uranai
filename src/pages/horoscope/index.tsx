import HoroscopeDetailPage from '../../components/HoroscopeDetailPage'
import styles from './HoroscopePage.module.css'

function HoroscopePage() {
  return (
    <div className={styles['horoscope-page']}>
      <div className={styles.container}>
        <div className={styles.title}>Horoscope</div>
        <HoroscopeDetailPage />
      </div>
    </div>
  )
}

export default HoroscopePage
