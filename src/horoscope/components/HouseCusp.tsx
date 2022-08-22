import type { Horoscope } from '../'

type Props = {
  horoscope: Horoscope
}

export default function HouseCusp({ horoscope }: Props) {
  return (
    <div style={{ width: '100%' }}>
      <div className="list">House Cusps</div>
      <table style={{ width: '100%' }}>
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
