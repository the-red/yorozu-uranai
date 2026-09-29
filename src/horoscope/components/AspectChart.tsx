import {
  Horoscope,
  MajorAspect,
  NODE_ICONS,
  NODE_NAMES,
  NODE_NAMES_JA,
  PLANET_ICONS,
  PLANET_NAMES_JA,
  PlanetName,
  ALL_PLANETS,
  getNodeConjunctions,
} from '../models'
type Props = { horoscope: Horoscope; orb: number; nodeOrb: number }

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

type AspectRowProps = Omit<Props, 'nodeOrb'> & {
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

// ドラゴンヘッド・ドラゴンテイルと、コンジャンクションになっている惑星
// NOTE: コンジャンクションだけを求めるので、表の行にはせずに、一覧にする
const NodeConjunctions = ({ horoscope, nodeOrb }: Omit<Props, 'orb'>) => {
  const conjunctions = getNodeConjunctions(horoscope, nodeOrb)
  return (
    <table className="list-table node-conjunctions">
      <caption>コンジャンクション（オーブ {nodeOrb}°）</caption>
      <tbody>
        {NODE_NAMES.map((node) => {
          const planets = conjunctions.filter((_) => _.node === node).map((_) => PLANET_NAMES_JA[_.planet])
          return (
            <tr key={node}>
              <td>
                {NODE_ICONS[node]} {NODE_NAMES_JA[node]}
              </td>
              <td>{planets.length > 0 ? planets.join(' / ') : 'なし'}</td>
            </tr>
          )
        })}
      </tbody>
    </table>
  )
}

export default function AspectChart({ horoscope, orb, nodeOrb }: Props) {
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
      <NodeConjunctions horoscope={horoscope} nodeOrb={nodeOrb} />
    </div>
  )
}
