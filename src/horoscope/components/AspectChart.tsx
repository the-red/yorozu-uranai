import {
  Horoscope,
  MajorAspect,
  POINT_ICONS,
  POINT_NAMES,
  POINT_NAMES_JA,
  PLANET_ICONS,
  PLANET_NAMES_JA,
  PlanetName,
  ALL_PLANETS,
  getPointConjunctions,
} from '../models'
type Props = { horoscope: Horoscope; orb: number; pointOrb: number }

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

type AspectRowProps = Omit<Props, 'pointOrb'> & {
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

// 感受点と、コンジャンクションになっている惑星
const PointConjunctions = ({ horoscope, pointOrb }: Omit<Props, 'orb'>) => {
  const conjunctions = getPointConjunctions(horoscope, pointOrb)
  return (
    <table className="list-table point-conjunctions">
      <caption>コンジャンクション（オーブ {pointOrb}°）</caption>
      <tbody>
        {POINT_NAMES.map((point) => {
          const planets = conjunctions.filter((_) => _.point === point).map((_) => PLANET_NAMES_JA[_.planet])
          return (
            <tr key={point}>
              <td>
                {POINT_ICONS[point]} {POINT_NAMES_JA[point]}
              </td>
              <td>{planets.length > 0 ? planets.join(' / ') : 'なし'}</td>
            </tr>
          )
        })}
      </tbody>
    </table>
  )
}

export default function AspectChart({ horoscope, orb, pointOrb }: Props) {
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
      <PointConjunctions horoscope={horoscope} pointOrb={pointOrb} />
    </div>
  )
}
