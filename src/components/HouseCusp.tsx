import type { Horoscope } from '../horoscope'

type Props = {
  horoscope: Horoscope
}

export default function HouseCusp({ horoscope }: Props) {
  return (
    <div style={{ width: '100%' }}>
      <div style={{ fontSize: '30px' }}>House Cusps</div>
      <table style={{ width: '100%' }}>
        <tbody>
          {horoscope.formattedHouse.map((house, i) => (
            <tr key={i}>
              <td>{i + 1}ハウス</td>
              <td>{house}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}
