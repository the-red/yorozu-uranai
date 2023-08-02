import Image from 'next/image'
import { staticPath } from '../../lib/$path'
import { Saiun } from '../models/Saiun'

type Props = { saiun: Saiun[] }

export const SaiunContent = ({ saiun }: Props) => (
  <section className="result saiun">
    <div className="inner">
      <h3>
        <div className="heading_icon">
          <Image src={staticPath.images.suimei.peach_svg} className="image" fill alt="桃のアイコン"></Image>
        </div>
        <div>歳運</div>
      </h3>
      <table>
        <thead>
          <tr>
            <th></th>
            <th>
              天干<br className="header_br_sp"></br>通変星
            </th>
            <th>歳運</th>
            <th>蔵干</th>
            <th>
              蔵干<br className="header_br_sp"></br>通変星
            </th>
            <th>十二運</th>
          </tr>
        </thead>
        <tbody>
          {saiun.map((s: Saiun, key) => {
            return (
              <tr key={key} className={s.thisYear ? 'current' : ''}>
                <th>
                  <span>{s.age}歳</span>
                  {s.year}年
                </th>
                <td>{s.tenkanTsuhensei}</td>
                <td>{s.yearKanshi}</td>
                <td>{s.zoukan}</td>
                <td>{s.zoukanTsuhensei}</td>
                <td>{s.juuniun}</td>
              </tr>
            )
          })}
        </tbody>
      </table>
    </div>
  </section>
)
