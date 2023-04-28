import Image from 'next/image'
import { staticPath } from '../../lib/$path'

export const GogyoBalance = () => (
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
            <td>1</td>
            <td>2</td>
            <td>2</td>
            <td>3</td>
            <td>0</td>
          </tr>
        </tbody>
      </table>
    </div>
  </section>
)
