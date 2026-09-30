import { Horoscope, POINT_NAMES_JA, POINT_NEEDS_BIRTH_TIME, PLANET_NAMES_JA } from '../models'

type Props = {
  horoscope: Horoscope
}

// 記号と名前
// NOTE: 記号が無いもの（Asc、Mc、Vx、PoF）も、記号の幅を空けて、名前の位置をそろえる
const NameCell = ({ icon, name }: { icon?: string; name: string }) => (
  <td>
    <span className="list-icon">{icon !== name && icon}</span>
    {name}
  </td>
)

export default function PlanetPositions({ horoscope }: Props) {
  const { ascendant, mc } = horoscope.house
  const points = Object.values(horoscope.points).map((point) => (
    <tr key={point.name}>
      <NameCell icon={point.icon} name={POINT_NAMES_JA[point.name]} />
      <td>{point.sign}</td>
      <td>{point.formattedDegrees}</td>
      <td>{point.house}ハウス</td>
    </tr>
  ))
  // 感受点のうち、出生時刻と場所で決まるもの（Vx、PoF）が始まる位置
  const local = Object.values(horoscope.points).findIndex((point) => POINT_NEEDS_BIRTH_TIME[point.name])

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
          {/* 日時だけで決まるもの（惑星、ヘッド、テイル、リリス）の後に、出生時刻と場所で決まるものを並べる */}
          {points.slice(0, local)}
          <tr>
            <NameCell name="Asc" />
            <td>{ascendant.sign}</td>
            <td>{ascendant.formattedDegrees}</td>
          </tr>
          <tr>
            <NameCell name="Mc" />
            <td>{mc.sign}</td>
            <td>{mc.formattedDegrees}</td>
          </tr>
          {points.slice(local)}
        </tbody>
      </table>
    </div>
  )
}
