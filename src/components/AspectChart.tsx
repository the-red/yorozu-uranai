import styles from '../pages/horoscope/HoroscopePage.module.css'

export default function AspectChart() {
  return (
    <div>
      <div style={{ fontSize: '30px' }}>Aspect Chart</div>
      <div className={styles['aspect-chart-container']}>
        <div className={styles['outer-item']}>
          <div className={`${styles['inner-item']} ${styles['planet-icon']}`}>⦿</div>
        </div>
        <div className={styles['outer-item']}>
          <div className={styles['inner-item']}>60</div>
          <div className={`${styles['inner-item']} ${styles['planet-icon']}`}>☽</div>
        </div>
        <div className={styles['outer-item']}>
          <div className={styles['inner-item']}>120</div>
          <div className={styles['inner-item']}>120</div>
          <div className={`${styles['inner-item']} ${styles['planet-icon']}`}>☿</div>
        </div>
        <div className={styles['outer-item']}>
          <div className={styles['inner-item']}>0</div>
          <div className={styles['inner-item']}>0</div>
          <div className={styles['inner-item']}>0</div>
          <div className={`${styles['inner-item']} ${styles['planet-icon']}`}>♀</div>
        </div>
        <div className={styles['outer-item']}>
          <div className={styles['inner-item']}>90</div>
          <div className={styles['inner-item']}>90</div>
          <div className={styles['inner-item']}>90</div>
          <div className={styles['inner-item']}>90</div>
          <div className={`${styles['inner-item']} ${styles['planet-icon']}`}>♂</div>
        </div>
        <div className={styles['outer-item']}>
          <div className={styles['inner-item']}>180</div>
          <div className={styles['inner-item']}>180</div>
          <div className={styles['inner-item']}>180</div>
          <div className={styles['inner-item']}>180</div>
          <div className={styles['inner-item']}>180</div>
          <div className={`${styles['inner-item']} ${styles['planet-icon']}`}>♃</div>
        </div>
        <div className={styles['outer-item']}>
          <div className={styles['inner-item']}>90</div>
          <div className={styles['inner-item']}>90</div>
          <div className={styles['inner-item']}>90</div>
          <div className={styles['inner-item']}>90</div>
          <div className={styles['inner-item']}>90</div>
          <div className={styles['inner-item']}>90</div>
          <div className={`${styles['inner-item']} ${styles['planet-icon']}`}>♄</div>
        </div>
        <div className={styles['outer-item']}>
          <div className={styles['inner-item']}>90</div>
          <div className={styles['inner-item']}>90</div>
          <div className={styles['inner-item']}>90</div>
          <div className={styles['inner-item']}>90</div>
          <div className={styles['inner-item']}>90</div>
          <div className={styles['inner-item']}>90</div>
          <div className={styles['inner-item']}>90</div>
          <div className={`${styles['inner-item']} ${styles['planet-icon']}`}>♅</div>
        </div>
        <div className={styles['outer-item']}>
          <div className={styles['inner-item']}>90</div>
          <div className={styles['inner-item']}>90</div>
          <div className={styles['inner-item']}>90</div>
          <div className={styles['inner-item']}>90</div>
          <div className={styles['inner-item']}>90</div>
          <div className={styles['inner-item']}>90</div>
          <div className={styles['inner-item']}>90</div>
          <div className={styles['inner-item']}>90</div>
          <div className={`${styles['inner-item']} ${styles['planet-icon']}`}>♆</div>
        </div>
        <div className={styles['outer-item']}>
          <div className={styles['inner-item']}>90</div>
          <div className={styles['inner-item']}>90</div>
          <div className={styles['inner-item']}>90</div>
          <div className={styles['inner-item']}>90</div>
          <div className={styles['inner-item']}>90</div>
          <div className={styles['inner-item']}>90</div>
          <div className={styles['inner-item']}>90</div>
          <div className={styles['inner-item']}>90</div>
          <div className={styles['inner-item']}>90</div>
          <div className={`${styles['inner-item']} ${styles['planet-icon']}`}>♇</div>
        </div>
      </div>
    </div>
  )
}
