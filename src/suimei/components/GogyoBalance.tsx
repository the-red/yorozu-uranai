import Image from 'next/image'
import { staticPath } from '../../lib/$path'
import type { Kanshi } from '../models/Kanshi'

type Props = { kanshi: Kanshi }
export const GogyoBalance = ({ kanshi }: Props) => (
  <section className="result gogyo_balance">
    <div className="inner">
      <h3>
        <div className="heading_icon">
          <Image src={staticPath.images.suimei.lotus_svg} className="image" fill alt="蓮のアイコン"></Image>
        </div>
        <div>五行バランス</div>
      </h3>
      <table>
        <thead>
          <tr>
            <th>木</th>
            <th>火</th>
            <th>土</th>
            <th>金</th>
            <th>水</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td>{kanshi.五行.木}</td>
            <td>{kanshi.五行.火}</td>
            <td>{kanshi.五行.土}</td>
            <td>{kanshi.五行.金}</td>
            <td>{kanshi.五行.水}</td>
          </tr>
        </tbody>
      </table>
    </div>
  </section>
)
