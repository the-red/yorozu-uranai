import type { Planet as PlanetClass } from '../horoscope'
type Planet = ReturnType<PlanetClass['toJSON']>

type Props = {
  planets: Planet[]
}

export default function PlanetPositions({ planets }: Props) {
  return (
    <>
      <div style={{ fontSize: '30px' }}>Planet Positions</div>
      <table>
        <tbody>
          {planets.map((planet, i) => (
            <tr key={i}>
              <td>{planet.name}</td>
              <td>{planet.sign}</td>
              <td>{planet.formattedDegrees}</td>
              <td>1ハウス</td>
            </tr>
          ))}
        </tbody>
      </table>
    </>
  )
}
