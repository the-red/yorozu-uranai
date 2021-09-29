import type { Planet } from '../horoscope'

type Props = {
  planets: Planet[]
}

export default function PlanetPositions({ planets }: Props) {
  return (
    <div style={{ width: '100%' }}>
      <div style={{ fontSize: '30px' }}>Planet Positions</div>
      <table style={{ width: '100%' }}>
        <tbody>
          {planets.map((planet, i) => (
            <tr key={i}>
              <td>{planet.name}</td>
              <td>{planet.sign}</td>
              <td>{planet.formattedDegrees}</td>
              <td>{planet.house}ハウス</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}
