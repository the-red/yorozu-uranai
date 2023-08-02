import Image from 'next/image'
import { staticPath } from '../../lib/$path'
import type { Daiun } from '../models/Daiun'

type Props = { daiun: Daiun[] }
export const DaiunContent = ({ daiun }: Props) => (
  <section className="result daiun">
    <div className="inner">
      <h3>
        <div className="heading_icon">
          <Image src={staticPath.images.suimei.kintoun_svg} className="image" fill alt="筋斗雲のアイコン"></Image>
        </div>
        <div>大運</div>
      </h3>
      <table>
        <thead>
          <tr>
            <th></th>
            <th>
              天干<br className="header_br_sp"></br>通変星
            </th>
            <th>大運</th>
            <th>蔵干</th>
            <th>
              蔵干<br className="header_br_sp"></br>通変星
            </th>
            <th>十二運</th>
          </tr>
        </thead>
        <tbody>
          {daiun.map((d: Daiun, key) => {
            return (
              <tr key={key} className={d.thisYear ? 'current' : ''}>
                <th>
                  {d.fromAge}〜<br className="header_br_sp"></br>
                  {d.toAge}歳
                </th>
                <td>{d.tenkanTsuhensei}</td>
                <td>{d.kanshi}</td>
                <td>{d.zoukan}</td>
                <td>{d.zoukanTsuhensei}</td>
                <td>{d.juuniun}</td>
              </tr>
            )
          })}
        </tbody>
      </table>
    </div>
  </section>
)
