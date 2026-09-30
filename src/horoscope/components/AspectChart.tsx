import {
  ALL_PLANETS,
  ASTEROID_ICONS,
  ASTEROID_NAMES,
  Aspect,
  AspectSettings,
  GroupSettings,
  Horoscope,
  POINT_ICONS,
  POINT_NAMES,
  POINT_NEEDS_BIRTH_TIME,
  PLANET_ICONS,
  PlanetName,
  Visibility,
  getAngleAspects,
  getAsteroidAspects,
  getPlanetAspect,
  getPointAspects,
  isAsteroidVisible,
  isPointVisible,
} from '../models'
type Props = { horoscope: Horoscope; settings: AspectSettings; visibility: Visibility }

const ASPECT_CLASSES = { hard: 'hard-aspect', soft: 'soft-aspect', minor: 'minor-aspect' } as const

type AspectCellProps = {
  aspect: Aspect | undefined
}
const AspectCell = ({ aspect }: AspectCellProps) => {
  return <div className={`inner-item ${aspect ? ASPECT_CLASSES[aspect.type] : ''}`}>{aspect?.degrees}</div>
}

type PlanetCellProps = {
  planetIcon: string
}
// NOTE: 記号が1文字でないもの（Asc、Mc、Vx、PoF）は、マスに収まるように、文字を小さくする
const PlanetCell = ({ planetIcon }: PlanetCellProps) => (
  <div className={`inner-item planet-icon ${planetIcon.length > 1 ? 'text-icon' : ''}`}>{planetIcon}</div>
)

type AspectRowProps = Omit<Props, 'visibility'> & {
  targetPlanet: PlanetName
}
// 対象の惑星と、それより前の惑星とのアスペクト
// NOTE: 左に1マス空けて、惑星の記号の横の位置を、下の表（惑星 × 惑星以外）とそろえる
const AspectRow = ({ horoscope, settings, targetPlanet }: AspectRowProps) => (
  <>
    <div className="inner-item corner" />
    {ALL_PLANETS.filter((planet, index) => index < ALL_PLANETS.indexOf(targetPlanet)).map((basePlanet, i) => (
      <AspectCell key={i} aspect={getPlanetAspect(horoscope, basePlanet, targetPlanet, settings)} />
    ))}
    <PlanetCell planetIcon={PLANET_ICONS[targetPlanet]} />
  </>
)

// オーブの説明
const toOrbNote = ({ orb, sunMoonPlus, minor, minorOrb }: AspectSettings) =>
  [
    `オーブ ${orb}°`,
    sunMoonPlus > 0 && `太陽・月は ${orb + sunMoonPlus}°`,
    minor.length > 0 && `マイナーは ${minorOrb}°`,
  ]
    .filter(Boolean)
    .join('、')

const toGroupNote = (label: string, { aspects, orb }: GroupSettings) =>
  `${label}: オーブ ${orb}°${aspects === 'conjunction' ? '、0° だけ' : ''}`

type PointRow = { key: string; icon: string; aspects: Partial<Record<PlanetName, Aspect>> }

// 惑星と、惑星以外のもの（小惑星、感受点、Asc、Mc）のアスペクト
// NOTE: 惑星以外どうしのアスペクトは読まないので、三角の表には足さずに、惑星 × 惑星以外の四角い表にする
const PointChart = ({ horoscope, settings, visibility }: Props) => {
  const toAspects = (found: { planet: PlanetName; aspect: Aspect }[]) =>
    Object.fromEntries(found.map((_) => [_.planet, _.aspect]))

  const asteroidAspects = getAsteroidAspects(horoscope, settings.asteroid)
  const asteroids: PointRow[] = (horoscope.asteroids ? ASTEROID_NAMES : [])
    .filter((_) => isAsteroidVisible(_, visibility))
    .map((name) => ({
      key: name,
      icon: ASTEROID_ICONS[name],
      aspects: toAspects(asteroidAspects.filter((_) => _.asteroid === name)),
    }))

  const pointAspects = getPointAspects(horoscope, settings.point)
  const points = POINT_NAMES.filter((_) => isPointVisible(_, visibility)).map((name) => ({
    name,
    key: name,
    icon: POINT_ICONS[name],
    aspects: toAspects(pointAspects.filter((_) => _.point === name)),
  }))

  const angleAspects = getAngleAspects(horoscope, settings.ascMc)
  const angles: PointRow[] = visibility.ascMc
    ? [
        { key: 'ascendant', icon: 'Asc', aspects: toAspects(angleAspects.filter((_) => _.angle === 'ascendant')) },
        { key: 'mc', icon: 'Mc', aspects: toAspects(angleAspects.filter((_) => _.angle === 'mc')) },
      ]
    : []

  // 並び順は、惑星の位置の表と同じ
  const rows: PointRow[] = [
    ...angles,
    ...points.filter((_) => POINT_NEEDS_BIRTH_TIME[_.name]),
    ...asteroids,
    ...points.filter((_) => !POINT_NEEDS_BIRTH_TIME[_.name]),
  ]
  if (rows.length === 0) {
    return null
  }

  // 表示しているものの、説明だけを出す
  const notes = [
    angles.length > 0 && toGroupNote('Asc・Mc', settings.ascMc),
    asteroids.length > 0 && toGroupNote('小惑星・キロン', settings.asteroid),
    points.length > 0 && toGroupNote('感受点', settings.point),
  ].filter(Boolean)

  return (
    <>
      <div className="aspect-chart-container point-chart">
        <div className="outer-item">
          <div className="inner-item corner" />
          {ALL_PLANETS.map((planet) => (
            <PlanetCell key={planet} planetIcon={PLANET_ICONS[planet]} />
          ))}
        </div>
        {rows.map(({ key, icon, aspects }) => (
          <div key={key} className="outer-item">
            <PlanetCell planetIcon={icon} />
            {ALL_PLANETS.map((planet) => (
              <AspectCell key={planet} aspect={aspects[planet]} />
            ))}
          </div>
        ))}
      </div>
      <div className="aspect-chart-note">
        {notes.map((note, i) => (
          <div key={i}>{note}</div>
        ))}
      </div>
    </>
  )
}

export default function AspectChart({ horoscope, settings, visibility }: Props) {
  return (
    <div>
      <div className="list">Aspect Chart</div>
      <div className="aspect-chart-container">
        {ALL_PLANETS.map((planet, i) => (
          <div key={i} className="outer-item">
            <AspectRow horoscope={horoscope} settings={settings} targetPlanet={planet} />
          </div>
        ))}
      </div>
      <div className="aspect-chart-note">{toOrbNote(settings)}</div>
      <PointChart horoscope={horoscope} settings={settings} visibility={visibility} />
    </div>
  )
}
