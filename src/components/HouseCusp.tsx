import type { Horoscope } from '../horoscope'

type Props = {
  house: Horoscope['formattedHouse']
}

export default function HouseCusp({ house }: Props) {
  return (
    <div style={{ width: '100%' }}>
      <div style={{ fontSize: '30px' }}>House Cusps</div>
      <table style={{ width: '100%' }}>
        <tbody>
          {house.map((longitude, i) => (
            <tr key={i}>
              <td>{i + 1}ハウス</td>
              <td>{longitude}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}
