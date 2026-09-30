import {
  ASTEROID_NAMES_JA,
  Horoscope,
  POINT_NAMES_JA,
  POINT_NEEDS_BIRTH_TIME,
  PLANET_NAMES_JA,
  Visibility,
  isAsteroidVisible,
  isPointVisible,
} from '../models'

type Props = {
  horoscope: Horoscope
  visibility: Visibility
}

// 記号と名前
// NOTE: 記号が無いもの（Asc、Mc、Vx、PoF）も、記号の幅を空けて、名前の位置をそろえる
const NameCell = ({ icon, name }: { icon?: string; name: string }) => (
  <td>
    <span className="list-icon">{icon !== name && icon}</span>
    {name}
  </td>
)

export default function PlanetPositions({ horoscope, visibility }: Props) {
  // NOTE: Asc と Mc も、ハウスを出す。ハウスシステムによっては、1ハウスと 10ハウスの起点にならない
  const { house } = horoscope
  const { ascendant, mc } = house
  // NOTE: 小惑星とキロンは、計算できない日付（1800年より前、2400年より後）では、無い
  const asteroids = Object.values(horoscope.asteroids ?? {}).filter((_) => isAsteroidVisible(_.name, visibility))
  const points = Object.values(horoscope.points).filter((point) => isPointVisible(point.name, visibility))
  const toRow = (point: (typeof points)[number]) => (
    <tr key={point.name}>
      <NameCell icon={point.icon} name={POINT_NAMES_JA[point.name]} />
      <td>{point.sign}</td>
      <td>{point.formattedDegrees}</td>
      <td>{point.house}ハウス</td>
    </tr>
  )

  return (
    <div className="list-container">
      <div className="list">Planet Positions</div>
      <table className="list-table">
        <tbody>
          {Object.values(horoscope.planets).map((planet, i) => (
            <tr key={i}>
              <NameCell icon={planet.icon} name={PLANET_NAMES_JA[planet.name]} />
              <td>{planet.sign}</td>
              <td>{planet.formattedDegrees}</td>
              <td>{planet.house}ハウス</td>
            </tr>
          ))}
          {/* 出生時刻と場所で決まるもの（Asc、Mc、Vx、PoF）を先に、日時だけで決まるものを後に並べる */}
          {visibility.ascMc && (
            <>
              <tr>
                <NameCell name="Asc" />
                <td>{ascendant.sign}</td>
                <td>{ascendant.formattedDegrees}</td>
                <td>{house.where(ascendant.longitude)}ハウス</td>
              </tr>
              <tr>
                <NameCell name="Mc" />
                <td>{mc.sign}</td>
                <td>{mc.formattedDegrees}</td>
                <td>{house.where(mc.longitude)}ハウス</td>
              </tr>
            </>
          )}
          {points.filter((_) => POINT_NEEDS_BIRTH_TIME[_.name]).map(toRow)}
          {asteroids.map((asteroid) => (
            <tr key={asteroid.name}>
              <NameCell icon={asteroid.icon} name={ASTEROID_NAMES_JA[asteroid.name]} />
              <td>{asteroid.sign}</td>
              <td>{asteroid.formattedDegrees}</td>
              <td>{asteroid.house}ハウス</td>
            </tr>
          ))}
          {points.filter((_) => !POINT_NEEDS_BIRTH_TIME[_.name]).map(toRow)}
        </tbody>
      </table>
    </div>
  )
}
