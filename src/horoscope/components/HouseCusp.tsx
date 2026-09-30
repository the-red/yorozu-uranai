import { HOUSE_SYSTEM_NAMES, Horoscope, HouseSystem } from '../models'

type Props = {
  horoscope: Horoscope
  houseSystem: HouseSystem // horoscope を計算したときの、ハウスシステム
}

export default function HouseCusp({ horoscope, houseSystem }: Props) {
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
      <div className="list-note">{HOUSE_SYSTEM_NAMES[houseSystem]}</div>
    </div>
  )
}
