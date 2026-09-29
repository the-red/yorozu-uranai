import { Horoscope, POINT_NAMES_JA, PLANET_NAMES_JA } from '../models'

type Props = {
  horoscope: Horoscope
}

export default function PlanetPositions({ horoscope }: Props) {
  return (
    <div className="list-container">
      <div className="list">Planet Positions</div>
      <table className="list-table">
        <tbody>
          {Object.values(horoscope.planets).map((planet, i) => (
            <tr key={i}>
              <td>{PLANET_NAMES_JA[planet.name]}</td>
              <td>{planet.sign}</td>
              <td>{planet.formattedDegrees}</td>
              <td>{planet.house}ハウス</td>
            </tr>
          ))}
          {Object.values(horoscope.points).map((point) => (
            <tr key={point.name}>
              <td>{POINT_NAMES_JA[point.name]}</td>
              <td>{point.sign}</td>
              <td>{point.formattedDegrees}</td>
              <td>{point.house}ハウス</td>
            </tr>
          ))}
          <tr>
            <td>ASC</td>
            <td>{horoscope.house.ascendant.sign}</td>
            <td>{horoscope.house.ascendant.formattedDegrees}</td>
          </tr>
          <tr>
            <td>MC</td>
            <td>{horoscope.house.mc.sign}</td>
            <td>{horoscope.house.mc.formattedDegrees}</td>
          </tr>
        </tbody>
      </table>
    </div>
  )
}
