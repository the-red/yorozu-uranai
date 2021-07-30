import { Houses } from '../horoscope'

type Props = {
  houses: Houses
}

export default function HouseCusp({ houses }: Props) {
  return (
    <div>
      <p>【ハウスのカスプ】</p>
      <table>
        <tbody>
          {houses.house.map((longitude, i) => (
            <tr>
              <td>{i + 1}ハウス</td>
              <td>{longitude}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}
