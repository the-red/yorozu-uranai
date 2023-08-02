import Image from 'next/image'
import { pagesPath, staticPath } from '../../lib/$path'
import { Saiun } from '../models/Saiun'
import OpenIcon from '../../../public/images/index/open_in_new.svg'
import Link from 'next/link'
import { Query } from '../../lib/params'

type Props = { saiun: Saiun[]; query?: Query }

export const SaiunContent = ({ saiun, query }: Props) => (
  <section className="result saiun">
    <div className="inner">
      <h3>
        <div className="heading_icon">
          <Image src={staticPath.images.suimei.peach_svg} className="image" fill alt="桃のアイコン"></Image>
        </div>
        <div>歳運</div>
      </h3>
      {query && (
        <div style={{ textAlign: 'right', textDecoration: 'underline', marginBottom: '5px' }}>
          <Link href={pagesPath.suimei.saiun.$url({ query })} target="_blank">
            0〜120歳の歳運表を表示する
            <OpenIcon style={{ verticalAlign: 'text-bottom' }} height={20} width={20} />
          </Link>
        </div>
      )}
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
