import { Horoscope, ALL_MAJOR_ASPECTS, ALL_MINOR_ASPECTS } from '../horoscope'
import styles from '../pages/horoscope/HoroscopePage.module.css'
type Props = { horoscope: Horoscope }

export default function AspectChart({ horoscope }: Props) {
  const softAspects = ALL_MAJOR_ASPECTS.filter((aspect) => aspect.type === 'soft').map((aspect) =>
    String(aspect.degrees)
  )
  const hardAspects = ALL_MAJOR_ASPECTS.filter((aspect) => aspect.type === 'hard').map((aspect) =>
    String(aspect.degrees)
  )
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
  const orb = 6

  const addClassByAspectType = (degrees: string) => {
    return `${hardAspects.includes(degrees) && styles['hard-aspect']}
              ${softAspects.includes(degrees) && styles['soft-aspect']}`
  }

  type CellProps = {
    degrees: number | undefined
  }
  const Cell = (props: CellProps) => {
    const degrees = props.degrees
    return <div className={`${styles['inner-item']} ${addClassByAspectType(String(degrees))}`}>{degrees}</div>
  }

  return (
    <div>
      <div style={{ fontSize: '30px', marginBottom: '10px' }}>Aspect Chart</div>
      <div className={styles['aspect-chart-container']}>
        <div className={styles['outer-item']}>
          <div className={`${styles['inner-item']} ${styles['planet-icon']}`}>⦿</div>
        </div>
        <div className={styles['outer-item']}>
          <Cell degrees={planets.sun.majorAspect(planets.moon, orb)?.degrees}></Cell>
          <div className={`${styles['inner-item']} ${styles['planet-icon']}`}>☽</div>
        </div>
        <div className={styles['outer-item']}>
          <Cell degrees={planets.sun.majorAspect(planets.mercury, orb)?.degrees}></Cell>
          <Cell degrees={planets.moon.majorAspect(planets.mercury, orb)?.degrees}></Cell>
          <div className={`${styles['inner-item']} ${styles['planet-icon']}`}>☿</div>
        </div>
        <div className={styles['outer-item']}>
          <Cell degrees={planets.sun.majorAspect(planets.venus, orb)?.degrees}></Cell>
          <Cell degrees={planets.moon.majorAspect(planets.venus, orb)?.degrees}></Cell>
          <Cell degrees={planets.mercury.majorAspect(planets.venus, orb)?.degrees}></Cell>
          <div className={`${styles['inner-item']} ${styles['planet-icon']}`}>♀</div>
        </div>
        <div className={styles['outer-item']}>
          <Cell degrees={planets.sun.majorAspect(planets.mars, orb)?.degrees}></Cell>
          <Cell degrees={planets.moon.majorAspect(planets.mars, orb)?.degrees}></Cell>
          <Cell degrees={planets.mercury.majorAspect(planets.mars, orb)?.degrees}></Cell>
          <Cell degrees={planets.venus.majorAspect(planets.mars, orb)?.degrees}></Cell>
          <div className={`${styles['inner-item']} ${styles['planet-icon']}`}>♂</div>
        </div>
        <div className={styles['outer-item']}>
          <Cell degrees={planets.sun.majorAspect(planets.jupiter, orb)?.degrees}></Cell>
          <Cell degrees={planets.moon.majorAspect(planets.jupiter, orb)?.degrees}></Cell>
          <Cell degrees={planets.mercury.majorAspect(planets.jupiter, orb)?.degrees}></Cell>
          <Cell degrees={planets.venus.majorAspect(planets.jupiter, orb)?.degrees}></Cell>
          <Cell degrees={planets.mars.majorAspect(planets.jupiter, orb)?.degrees}></Cell>
          <div className={`${styles['inner-item']} ${styles['planet-icon']}`}>♃</div>
        </div>
        <div className={styles['outer-item']}>
          <Cell degrees={planets.sun.majorAspect(planets.saturn, orb)?.degrees}></Cell>
          <Cell degrees={planets.moon.majorAspect(planets.saturn, orb)?.degrees}></Cell>
          <Cell degrees={planets.mercury.majorAspect(planets.saturn, orb)?.degrees}></Cell>
          <Cell degrees={planets.venus.majorAspect(planets.saturn, orb)?.degrees}></Cell>
          <Cell degrees={planets.mars.majorAspect(planets.saturn, orb)?.degrees}></Cell>
          <Cell degrees={planets.jupiter.majorAspect(planets.saturn, orb)?.degrees}></Cell>
          <div className={`${styles['inner-item']} ${styles['planet-icon']}`}>♄</div>
        </div>
        <div className={styles['outer-item']}>
          <Cell degrees={planets.sun.majorAspect(planets.uranus, orb)?.degrees}></Cell>
          <Cell degrees={planets.moon.majorAspect(planets.uranus, orb)?.degrees}></Cell>
          <Cell degrees={planets.mercury.majorAspect(planets.uranus, orb)?.degrees}></Cell>
          <Cell degrees={planets.venus.majorAspect(planets.uranus, orb)?.degrees}></Cell>
          <Cell degrees={planets.mars.majorAspect(planets.uranus, orb)?.degrees}></Cell>
          <Cell degrees={planets.jupiter.majorAspect(planets.uranus, orb)?.degrees}></Cell>
          <Cell degrees={planets.saturn.majorAspect(planets.uranus, orb)?.degrees}></Cell>
          <div className={`${styles['inner-item']} ${styles['planet-icon']}`}>♅</div>
        </div>
        <div className={styles['outer-item']}>
          <Cell degrees={planets.sun.majorAspect(planets.neptune, orb)?.degrees}></Cell>
          <Cell degrees={planets.moon.majorAspect(planets.neptune, orb)?.degrees}></Cell>
          <Cell degrees={planets.mercury.majorAspect(planets.neptune, orb)?.degrees}></Cell>
          <Cell degrees={planets.venus.majorAspect(planets.neptune, orb)?.degrees}></Cell>
          <Cell degrees={planets.mars.majorAspect(planets.neptune, orb)?.degrees}></Cell>
          <Cell degrees={planets.jupiter.majorAspect(planets.neptune, orb)?.degrees}></Cell>
          <Cell degrees={planets.saturn.majorAspect(planets.neptune, orb)?.degrees}></Cell>
          <Cell degrees={planets.uranus.majorAspect(planets.neptune, orb)?.degrees}></Cell>
          <div className={`${styles['inner-item']} ${styles['planet-icon']}`}>♆</div>
        </div>
        <div className={styles['outer-item']}>
          <Cell degrees={planets.sun.majorAspect(planets.pluto, orb)?.degrees}></Cell>
          <Cell degrees={planets.moon.majorAspect(planets.pluto, orb)?.degrees}></Cell>
          <Cell degrees={planets.mercury.majorAspect(planets.pluto, orb)?.degrees}></Cell>
          <Cell degrees={planets.venus.majorAspect(planets.pluto, orb)?.degrees}></Cell>
          <Cell degrees={planets.mars.majorAspect(planets.pluto, orb)?.degrees}></Cell>
          <Cell degrees={planets.jupiter.majorAspect(planets.pluto, orb)?.degrees}></Cell>
          <Cell degrees={planets.saturn.majorAspect(planets.pluto, orb)?.degrees}></Cell>
          <Cell degrees={planets.uranus.majorAspect(planets.pluto, orb)?.degrees}></Cell>
          <Cell degrees={planets.neptune.majorAspect(planets.pluto, orb)?.degrees}></Cell>
          <div className={`${styles['inner-item']} ${styles['planet-icon']}`}>♇</div>
        </div>
      </div>
    </div>
  )
}
