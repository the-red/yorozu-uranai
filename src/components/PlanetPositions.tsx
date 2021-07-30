import type { Planet as PlanetClass } from '../horoscope'
type Planet = ReturnType<PlanetClass['toJSON']>

type Props = {
  planets: Planet[]
}

export default function PlanetPositions({ planets }: Props) {
  return (
    <>
      <div>Planet Positions</div>
      <div>
        <p>【天体の位置】</p>
        <table>
          <thead>
            <tr>
              <th>惑星</th>
              <th>星座</th>
              <th>角度</th>
              <th>ハウス</th>
            </tr>
          </thead>
          <tbody>
            {planets.map((planet) => (
              <tr>
                <td>{planet.name}</td>
                <td>{planet.sign}</td>
                <td>{planet.formattedDegrees}</td>
                <td>1ハウス</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </>
  )
}
