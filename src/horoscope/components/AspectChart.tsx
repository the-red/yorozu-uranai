import {
  Horoscope,
  MajorAspect,
  POINT_ICONS,
  POINT_NAMES,
  POINT_NAMES_JA,
  PLANET_ICONS,
  Planet,
  PlanetName,
  PointName,
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

// コンジャンクション
const [CONJUNCTION] = Planet.ALL_MAJOR_ASPECTS

// 惑星と、感受点のアスペクト
// NOTE: 感受点どうしのアスペクトは読まないので、三角の表には足さずに、惑星 × 感受点の四角い表にする
const PointChart = ({ horoscope, pointOrb }: Omit<Props, 'orb'>) => {
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
        {POINT_NAMES.map((point) => (
          <div key={point} className="outer-item">
            <PlanetCell planetIcon={POINT_ICONS[point]} />
            {ALL_PLANETS.map((planet) => (
              <AspectCell key={planet} aspect={isConjunction(point, planet) ? CONJUNCTION : undefined} />
            ))}
          </div>
        ))}
      </div>
      <div className="aspect-chart-note">
        {POINT_NAMES.map((point) => `${POINT_ICONS[point]} ${POINT_NAMES_JA[point]}`).join('　')}
        <br />
        コンジャンクション（0°）だけを表示。オーブ {pointOrb}°
      </div>
    </>
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
      <PointChart horoscope={horoscope} pointOrb={pointOrb} />
    </div>
  )
}
