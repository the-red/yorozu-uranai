import {
  Horoscope,
  MajorAspect,
  POINT_ICONS,
  POINT_NAMES,
  PLANET_ICONS,
  Planet,
  PlanetName,
  PointName,
  ALL_PLANETS,
  Visibility,
  getPointConjunctions,
  isPointVisible,
} from '../models'
type Props = { horoscope: Horoscope; orb: number; pointOrb: number; visibility: Visibility }

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
// NOTE: 記号が1文字でないもの（Vx、PoF）は、マスに収まるように、文字を小さくする
const PlanetCell = ({ planetIcon }: PlanetCellProps) => (
  <div className={`inner-item planet-icon ${planetIcon.length > 1 ? 'text-icon' : ''}`}>{planetIcon}</div>
)

type AspectRowProps = Omit<Props, 'pointOrb' | 'visibility'> & {
  targetPlanet: PlanetName
}
// 対象の惑星と、それより前の惑星とのアスペクト
// NOTE: 左に1マス空けて、惑星の記号の横の位置を、下の表（惑星 × 感受点）とそろえる
const AspectRow = ({ horoscope: { planets }, orb, targetPlanet }: AspectRowProps) => (
  <>
    <div className="inner-item corner" />
    {ALL_PLANETS.filter((planet, index) => index < ALL_PLANETS.indexOf(targetPlanet)).map((basePlanet, i) => (
      <AspectCell key={i} aspect={planets[basePlanet].majorAspect(planets[targetPlanet], orb)} />
    ))}
    <PlanetCell planetIcon={PLANET_ICONS[targetPlanet]} />
  </>
)

// コンジャンクション
const [CONJUNCTION] = Planet.ALL_MAJOR_ASPECTS

// 惑星と、感受点のアスペクト
// NOTE: 感受点どうしのアスペクトは読まないので、三角の表には足さずに、惑星 × 感受点の四角い表にする
const PointChart = ({ horoscope, pointOrb, visibility }: Omit<Props, 'orb'>) => {
  const points = POINT_NAMES.filter((_) => isPointVisible(_, visibility))
  if (points.length === 0) {
    return null
  }

  const conjunctions = getPointConjunctions(horoscope, pointOrb)
  const isConjunction = (point: PointName, planet: PlanetName) =>
    conjunctions.some((_) => _.point === point && _.planet === planet)

  return (
    <>
      <div className="aspect-chart-container point-chart">
        <div className="outer-item">
          <div className="inner-item corner" />
          {ALL_PLANETS.map((planet) => (
            <PlanetCell key={planet} planetIcon={PLANET_ICONS[planet]} />
          ))}
        </div>
        {points.map((point) => (
          <div key={point} className="outer-item">
            <PlanetCell planetIcon={POINT_ICONS[point]} />
            {ALL_PLANETS.map((planet) => (
              <AspectCell key={planet} aspect={isConjunction(point, planet) ? CONJUNCTION : undefined} />
            ))}
          </div>
        ))}
      </div>
      <div className="aspect-chart-note">
        オーブ {pointOrb}°
        <br />
        コンジャンクション（0°）だけを表示
      </div>
    </>
  )
}

export default function AspectChart({ horoscope, orb, pointOrb, visibility }: Props) {
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
      <div className="aspect-chart-note">オーブ {orb}°</div>
      <PointChart horoscope={horoscope} pointOrb={pointOrb} visibility={visibility} />
    </div>
  )
}
