import { Houses } from '../horoscope'

type Props = {
  houses: Houses
}

export default function HouseCusp({ houses }: Props) {
  return (
    <div style={{ width: '100%' }}>
      <div style={{ fontSize: '30px' }}>House Cusps</div>
      <table style={{ width: '100%' }}>
        <tbody>
          {houses.house.map((longitude, i) => (
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
