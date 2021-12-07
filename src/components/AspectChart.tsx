import { Horoscope, ALL_MAJOR_ASPECTS, PLANET_ICONS, PlanetName, ALL_MINOR_ASPECTS, Planet } from '../horoscope'
import styles from '../pages/horoscope/HoroscopePage.module.css'
type Props = { horoscope: Horoscope }

export default function AspectChart({ horoscope }: Props) {
  const softAspects = ALL_MAJOR_ASPECTS.filter((aspect) => aspect.type === 'soft').map((aspect) =>
    String(aspect.degrees)
  )
  const hardAspects = ALL_MAJOR_ASPECTS.filter((aspect) => aspect.type === 'hard').map((aspect) =>
    String(aspect.degrees)
  )
  // const itemElements = document.querySelectorAll<HTMLDivElement>('.inner-item')
  // if (itemElements) {
  //   for (const itemElement of itemElements) {
  //     if (itemElement.textContent && softAspects.includes(itemElement.textContent)) {
  //       itemElement.classList.add('soft-aspect')
  //     }
  //     if (itemElement.textContent && hardAspects.includes(itemElement.textContent)) {
  //       itemElement.classList.add('hard-aspect')
  //     }
  //   }
  // }
  const planets = horoscope.planets
  const orb = 6

  const addClassByAspectType = (degrees: string) => {
    return `${hardAspects.includes(degrees) && styles['hard-aspect']}
              ${softAspects.includes(degrees) && styles['soft-aspect']}`
  }

  type PlanetCellProps = {
    planetIcon: string
  }
  const PlanetCell = (props: PlanetCellProps) => {
    const planetIcon = props.planetIcon
    return <div className={`${styles['inner-item']} ${styles['planet-icon']}`}>{planetIcon}</div>
  }

  type AspectRowProps = {
    basePlanets: PlanetName[]
    targetPlanet: PlanetName
  }
  const AspectRow = (props: AspectRowProps) => (
    <>
      {props.basePlanets.map((basePlanet, i) => (
        <AspectCell
          key={i}
          degrees={planets[basePlanet].majorAspect(planets[props.targetPlanet], orb)?.degrees}
        ></AspectCell>
      ))}
    </>
  )

  type AspectCellProps = {
    degrees: number | undefined
  }
  const AspectCell = (props: AspectCellProps) => {
    const degrees = props.degrees
    return <div className={`${styles['inner-item']} ${addClassByAspectType(String(degrees))}`}>{degrees}</div>
  }

  return (
    <div>
      <div style={{ fontSize: '30px', marginBottom: '10px' }}>Aspect Chart</div>
      <div className={styles['aspect-chart-container']}>
        <div className={styles['outer-item']}>
          <PlanetCell planetIcon={PLANET_ICONS.sun}></PlanetCell>
        </div>
        <div className={styles['outer-item']}>
          <AspectRow basePlanets={['sun']} targetPlanet={'moon'}></AspectRow>
          <PlanetCell planetIcon={PLANET_ICONS.moon}></PlanetCell>
        </div>
        <div className={styles['outer-item']}>
          <AspectRow basePlanets={['sun', 'moon']} targetPlanet={'mercury'}></AspectRow>
          <PlanetCell planetIcon={PLANET_ICONS.mercury}></PlanetCell>
        </div>
        <div className={styles['outer-item']}>
          <AspectRow basePlanets={['sun', 'moon', 'mercury']} targetPlanet={'venus'}></AspectRow>
          <PlanetCell planetIcon={PLANET_ICONS.venus}></PlanetCell>
        </div>
        <div className={styles['outer-item']}>
          <AspectRow basePlanets={['sun', 'moon', 'mercury', 'venus']} targetPlanet={'mars'}></AspectRow>
          <PlanetCell planetIcon={PLANET_ICONS.mars}></PlanetCell>
        </div>
        <div className={styles['outer-item']}>
          <AspectRow basePlanets={['sun', 'moon', 'mercury', 'venus', 'mars']} targetPlanet={'jupiter'}></AspectRow>
          <PlanetCell planetIcon={PLANET_ICONS.jupiter}></PlanetCell>
        </div>
        <div className={styles['outer-item']}>
          <AspectRow
            basePlanets={['sun', 'moon', 'mercury', 'venus', 'mars', 'jupiter']}
            targetPlanet={'saturn'}
          ></AspectRow>
          <PlanetCell planetIcon={PLANET_ICONS.saturn}></PlanetCell>
        </div>
        <div className={styles['outer-item']}>
          <AspectRow
            basePlanets={['sun', 'moon', 'mercury', 'venus', 'mars', 'jupiter', 'saturn']}
            targetPlanet={'uranus'}
          ></AspectRow>
          <PlanetCell planetIcon={PLANET_ICONS.uranus}></PlanetCell>
        </div>
        <div className={styles['outer-item']}>
          <AspectRow
            basePlanets={['sun', 'moon', 'mercury', 'venus', 'mars', 'jupiter', 'saturn', 'uranus']}
            targetPlanet={'neptune'}
          ></AspectRow>
          <PlanetCell planetIcon={PLANET_ICONS.neptune}></PlanetCell>
        </div>
        <div className={styles['outer-item']}>
          <AspectRow
            basePlanets={['sun', 'moon', 'mercury', 'venus', 'mars', 'jupiter', 'saturn', 'uranus', 'neptune']}
            targetPlanet={'pluto'}
          ></AspectRow>
          <PlanetCell planetIcon={PLANET_ICONS.pluto}></PlanetCell>
        </div>
      </div>
    </div>
  )
}
