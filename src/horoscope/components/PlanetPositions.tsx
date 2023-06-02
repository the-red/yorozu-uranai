import { Horoscope, PLANET_NAMES_JA } from '../'

type Props = {
  horoscope: Horoscope
}

export default function PlanetPositions({ horoscope }: Props) {
  return (
    <div style={{ width: '100%' }}>
      <div className="list">Planet Positions</div>
      <table style={{ width: '100%' }}>
        <tbody>
          {Object?.values(horoscope.planets).map((planet, i) => (
            <tr key={i}>
              <td>{PLANET_NAMES_JA[planet.name]}</td>
              <td>{planet.sign}</td>
              <td>{planet.formattedDegrees}</td>
              <td>{planet.house}ハウス</td>
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
