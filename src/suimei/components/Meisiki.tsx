import Image from 'next/image'
import { staticPath } from '../../lib/$path'
import type { FC } from 'react'
import type { Suimei } from '../types'
import StringArrayWithBreaks from '../../components/A'

export const Meisiki: FC<{ suimei: Suimei }> = ({ suimei }) => {
  const { kanshi, tenkanTsuhensei, zoukan, zoukanTsuhensei, tokushusei } = suimei

  return (
    <section className="result meisiki">
      <div className="inner">
        <h3>
          <div className="heading_icon">
            <Image src={staticPath.images.suimei.fun_svg} className="image" fill alt="扇のアイコン"></Image>
          </div>
          <div>命式</div>
        </h3>
        <table>
          <thead>
            <tr>
              <th></th>
              <th>年柱</th>
              <th>月柱</th>
              <th>日柱</th>
              <th>時柱</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <th>天干</th>
              <td>{kanshi.年干}</td>
              <td>{kanshi.月干}</td>
              <td>{kanshi.日干}</td>
              <td>{kanshi.時干}</td>
            </tr>
            <tr>
              <th>地支</th>
              <td>{kanshi.年支}</td>
              <td>{kanshi.月支}</td>
              <td>{kanshi.日支}</td>
              <td>{kanshi.時支}</td>
            </tr>
            <tr>
              <th>
                天干<br className="header_br_sp"></br>通変星
              </th>
              <td>{tenkanTsuhensei.年柱}</td>
              <td>{tenkanTsuhensei.月柱}</td>
              <td>-</td>
              <td>{tenkanTsuhensei.時柱}</td>
            </tr>
            <tr>
              <th>十二運</th>
              <td></td>
              <td></td>
              <td></td>
              <td></td>
            </tr>
            <tr>
              <th>
                蔵干
                <br />
                （余気/中気/本気）
              </th>
              <td>
                {zoukan.年柱.yoki}/{zoukan.年柱.chuki}/{zoukan.年柱.honki}
              </td>
              <td>
                {zoukan.月柱.yoki}/{zoukan.月柱.chuki}/{zoukan.月柱.honki}
              </td>
              <td>
                {zoukan.日柱.yoki}/{zoukan.日柱.chuki}/{zoukan.日柱.honki}
              </td>
              <td>
                {zoukan.時柱.yoki}/{zoukan.時柱.chuki}/{zoukan.時柱.honki}
              </td>
            </tr>
            <tr>
              <th>
                蔵干<br className="header_br_sp"></br>通変星
                <br />
                （余気/中気/本気）
              </th>
              <td>
                {zoukanTsuhensei.年柱.yoki}/{zoukanTsuhensei.年柱.chuki}/{zoukanTsuhensei.年柱.honki}
              </td>
              <td>
                {zoukanTsuhensei.月柱.yoki}/{zoukanTsuhensei.月柱.chuki}/{zoukanTsuhensei.月柱.honki}
              </td>
              <td>
                {zoukanTsuhensei.日柱.yoki}/{zoukanTsuhensei.日柱.chuki}/{zoukanTsuhensei.日柱.honki}
              </td>
              <td>
                {zoukanTsuhensei.時柱.yoki}/{zoukanTsuhensei.時柱.chuki}/{zoukanTsuhensei.時柱.honki}
              </td>
            </tr>
            <tr>
              <th>特殊星</th>
              <td>
                <StringArrayWithBreaks strings={tokushusei.年柱} />
              </td>
              <td>
                <StringArrayWithBreaks strings={tokushusei.月柱} />
              </td>
              <td>
                <StringArrayWithBreaks strings={tokushusei.日柱} />
              </td>
              <td>
                <StringArrayWithBreaks strings={tokushusei.時柱} />
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </section>
  )
}
