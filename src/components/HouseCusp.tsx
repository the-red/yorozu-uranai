import { Houses } from '../horoscope'

type Props = {
  houses: Houses
}

export default function HouseCusp({ houses }: Props) {
  return (
    <>
      <div style={{ fontSize: '30px' }}>House Cusps</div>
      <table>
        <tbody>
          {houses.house.map((longitude, i) => (
            <tr key={i}>
              <td>{i + 1}ハウス</td>
              <td>{longitude}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </>
  )
}
