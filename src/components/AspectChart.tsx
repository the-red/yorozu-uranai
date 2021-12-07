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
  const planets = horoscope.planets
  const ALL_PLANETS = [
    'sun',
    'moon',
    'mercury',
    'venus',
    'mars',
    'jupiter',
    'saturn',
    'uranus',
    'neptune',
    'pluto',
  ] as const
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
    targetPlanet: PlanetName
  }
  const AspectRow = (props: AspectRowProps) => (
    <>
      {ALL_PLANETS.filter((planet, index) => index < ALL_PLANETS.indexOf(props.targetPlanet)).map((basePlanet, i) => (
        <AspectCell
          key={i}
          degrees={planets[basePlanet].majorAspect(planets[props.targetPlanet], orb)?.degrees}
        ></AspectCell>
      ))}
      <PlanetCell planetIcon={PLANET_ICONS[props.targetPlanet]}></PlanetCell>
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
          <AspectRow targetPlanet={'sun'}></AspectRow>
        </div>
        <div className={styles['outer-item']}>
          <AspectRow targetPlanet={'moon'}></AspectRow>
        </div>
        <div className={styles['outer-item']}>
          <AspectRow targetPlanet={'mercury'}></AspectRow>
        </div>
        <div className={styles['outer-item']}>
          <AspectRow targetPlanet={'venus'}></AspectRow>
        </div>
        <div className={styles['outer-item']}>
          <AspectRow targetPlanet={'mars'}></AspectRow>
        </div>
        <div className={styles['outer-item']}>
          <AspectRow targetPlanet={'jupiter'}></AspectRow>
        </div>
        <div className={styles['outer-item']}>
          <AspectRow targetPlanet={'saturn'}></AspectRow>
        </div>
        <div className={styles['outer-item']}>
          <AspectRow targetPlanet={'uranus'}></AspectRow>
        </div>
        <div className={styles['outer-item']}>
          <AspectRow targetPlanet={'neptune'}></AspectRow>
        </div>
        <div className={styles['outer-item']}>
          <AspectRow targetPlanet={'pluto'}></AspectRow>
        </div>
      </div>
    </div>
  )
}
