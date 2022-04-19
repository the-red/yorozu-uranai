import { Horoscope, MajorAspect, PLANET_ICONS, PlanetName } from '../horoscope'
import styles from '../pages/horoscope/HoroscopePage.module.css'
type Props = { horoscope: Horoscope }

export default function AspectChart({ horoscope }: Props) {
  const planets = horoscope.planets
  // TODO:horoscopeFactory.tsにも同じ定義があるので、将来的に定義を1箇所にしたい。
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
  // TODO:固定値ではなく、ユーザーが画面から指定した値を使うようにしたい
  const orb = 6

  const addClassByAspectType = (aspect: MajorAspect | undefined) => {
    return `${aspect?.type === 'hard' && styles['hard-aspect']}
              ${aspect?.type === 'soft' && styles['soft-aspect']}`
  }

  type AspectCellProps = {
    aspect: MajorAspect | undefined
  }
  const AspectCell = ({ aspect }: AspectCellProps) => {
    return <div className={`${styles['inner-item']} ${addClassByAspectType(aspect)}`}>{aspect?.degrees}</div>
  }

  type PlanetCellProps = {
    planetIcon: string
  }
  const PlanetCell = (props: PlanetCellProps) => (
    <div className={`${styles['inner-item']} ${styles['planet-icon']}`}>{props.planetIcon}</div>
  )

  type AspectRowProps = {
    targetPlanet: PlanetName
  }
  const AspectRow = (props: AspectRowProps) => (
    <>
      {ALL_PLANETS.filter((planet, index) => index < ALL_PLANETS.indexOf(props.targetPlanet)).map((basePlanet, i) => (
        <AspectCell key={i} aspect={planets[basePlanet].majorAspect(planets[props.targetPlanet], orb)} />
      ))}
      <PlanetCell planetIcon={PLANET_ICONS[props.targetPlanet]} />
    </>
  )

  const AspectChart = () => (
    <>
      <div className={styles['aspect-chart-container']}>
        {ALL_PLANETS.map((planet, i) => (
          <div className={styles['outer-item']}>
            <AspectRow key={i} targetPlanet={planet} />
          </div>
        ))}
      </div>
    </>
  )

  return (
    <div>
      <div style={{ fontSize: '30px', marginBottom: '10px' }}>Aspect Chart</div>
      <AspectChart />
    </div>
  )
}
