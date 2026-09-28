import { Horoscope, MajorAspect, PLANET_ICONS, PlanetName, ALL_PLANETS } from '../models'
type Props = { horoscope: Horoscope; orb: number }

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

type AspectRowProps = Props & {
  targetPlanet: PlanetName
}
// 対象の惑星と、それより前の惑星とのアスペクト
const AspectRow = ({ horoscope: { planets }, orb, targetPlanet }: AspectRowProps) => (
  <>
    {ALL_PLANETS.filter((planet, index) => index < ALL_PLANETS.indexOf(targetPlanet)).map((basePlanet, i) => (
      <AspectCell key={i} aspect={planets[basePlanet].majorAspect(planets[targetPlanet], orb)} />
    ))}
    <PlanetCell planetIcon={PLANET_ICONS[targetPlanet]} />
  </>
)

export default function AspectChart({ horoscope, orb }: Props) {
  return (
    <div>
      <div className="list">Aspect Chart</div>
      <div className="aspect-chart-container">
        {ALL_PLANETS.map((planet, i) => (
          <div key={i} className="outer-item">
            <AspectRow horoscope={horoscope} orb={orb} targetPlanet={planet} />
          </div>
        ))}
      </div>
    </div>
  )
}
