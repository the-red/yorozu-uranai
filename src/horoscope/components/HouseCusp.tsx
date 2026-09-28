import type { Horoscope } from '../models'

type Props = {
  horoscope: Horoscope
}

export default function HouseCusp({ horoscope }: Props) {
  return (
    <div className="list-container">
      <div className="list">House Cusps</div>
      <table className="list-table">
        <tbody>
          {horoscope.house.cusps.map((cusp, i) => (
            <tr key={i}>
              <td>{i + 1}ハウス</td>
              <td>{cusp.sign}</td>
              <td>{cusp.formattedDegrees}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}
