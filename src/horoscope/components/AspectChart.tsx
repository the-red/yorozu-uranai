import { Horoscope, MajorAspect, PLANET_ICONS, PlanetName, ALL_PLANETS } from '../'
type Props = { horoscope: Horoscope; orb: number }

export default function AspectChart({ horoscope, orb }: Props) {
  const planets = horoscope.planets

  const addClassByAspectType = (aspect: MajorAspect | undefined) => {
    return `${aspect?.type === 'hard' && 'hard-aspect'}
              ${aspect?.type === 'soft' && 'soft-aspect'}`
  }

  type AspectCellProps = {
    aspect: MajorAspect | undefined
  }
  const AspectCell = ({ aspect }: AspectCellProps) => {
    return <div className={`inner-item ${addClassByAspectType(aspect)}`}>{aspect?.degrees}</div>
  }

  type PlanetCellProps = {
    planetIcon: string
  }
  const PlanetCell = (props: PlanetCellProps) => <div className="inner-item planet-icon">{props.planetIcon}</div>

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
      <div className="aspect-chart-container">
        {ALL_PLANETS.map((planet, i) => (
          <div className="outer-item">
            <AspectRow key={i} targetPlanet={planet} />
          </div>
        ))}
      </div>
    </>
  )

  return (
    <div>
      <div className="list">Aspect Chart</div>
      <AspectChart />
    </div>
  )
}
