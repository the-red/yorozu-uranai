import { Horoscope, ALL_MAJOR_ASPECTS, ALL_MINOR_ASPECTS } from '../horoscope'
import styles from '../pages/horoscope/HoroscopePage.module.css'
type Props = { horoscope: Horoscope }

export default function AspectChart({ horoscope }: Props) {
  const softAspects = ALL_MAJOR_ASPECTS.map((aspect) => String(aspect.degrees))
  const hardAspects = ['0', '90', '180']
  const itemElements = document.querySelectorAll<HTMLDivElement>('.inner-item')
  if (itemElements) {
    for (const itemElement of itemElements) {
      if (itemElement.textContent && softAspects.includes(itemElement.textContent)) {
        itemElement.classList.add('soft-aspect')
      }
      if (itemElement.textContent && hardAspects.includes(itemElement.textContent)) {
        itemElement.classList.add('hard-aspect')
      }
    }
  }
  const planets = horoscope.planets
  return (
    <div>
      <div style={{ fontSize: '30px', marginBottom: '10px' }}>Aspect Chart</div>
      <div className={styles['aspect-chart-container']}>
        <div className={styles['outer-item']}>
          <div className={`${styles['inner-item']} ${styles['planet-icon']}`}>⦿</div>
        </div>
        <div className={styles['outer-item']}>
          <div className={styles['inner-item']}>{planets.sun.majorAspect(planets.moon, 6)?.degrees}</div>
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
