import { Horoscope, POINT_NAMES_JA, PLANET_NAMES_JA } from '../models'

type Props = {
  horoscope: Horoscope
}

// 記号と名前
// NOTE: 記号が無いもの（VX、ASC、MC）も、記号の幅を空けて、名前の位置をそろえる
const NameCell = ({ icon, name }: { icon?: string; name: string }) => (
  <td>
    <span className="list-icon">{icon !== name && icon}</span>
    {name}
  </td>
)

export default function PlanetPositions({ horoscope }: Props) {
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
          {Object.values(horoscope.points).map((point) => (
            <tr key={point.name}>
              <NameCell icon={point.icon} name={POINT_NAMES_JA[point.name]} />
              <td>{point.sign}</td>
              <td>{point.formattedDegrees}</td>
              <td>{point.house}ハウス</td>
            </tr>
          ))}
          <tr>
            <NameCell name="ASC" />
            <td>{horoscope.house.ascendant.sign}</td>
            <td>{horoscope.house.ascendant.formattedDegrees}</td>
          </tr>
          <tr>
            <NameCell name="MC" />
            <td>{horoscope.house.mc.sign}</td>
            <td>{horoscope.house.mc.formattedDegrees}</td>
          </tr>
        </tbody>
      </table>
    </div>
  )
}
