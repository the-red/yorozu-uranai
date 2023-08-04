import Image from 'next/image'
import { staticPath } from '../../lib/$path'
import type { FC } from 'react'
import type { Suimei } from '../models/types'
import StringArrayWithBreaks from '../../components/StringArrayWithBreaks'
import { Tooltip } from 'react-tooltip'

export const Meisiki: FC<{ suimei: Suimei }> = ({ suimei }) => {
  const { kanshi, tenkanTsuhensei, zoukan, zoukanTsuhensei, tokushusei, juuniun } = suimei

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
              <td>{juuniun.nenshi}</td>
              <td>{juuniun.gesshi}</td>
              <td>{juuniun.nisshi}</td>
              <td>{juuniun.jishi}</td>
            </tr>
            <tr>
              <th rowSpan={3}>
                <div className="exist-help">
                  <div>蔵干</div>
                  <Image
                    src={staticPath.images.suimei.help_svg}
                    width={16}
                    height={16}
                    alt="ヘルプアイコン"
                    data-tooltip-id="tooltip-help"
                    data-tooltip-html="上から余気・中気・本気の順で<br/>表記しています。"
                  ></Image>
                  <Tooltip id="tooltip-help" />
                </div>
              </th>
              <td>{zoukan.年柱.yoki}</td>
              <td>{zoukan.月柱.yoki}</td>
              <td>{zoukan.日柱.yoki}</td>
              <td>{zoukan.時柱.yoki}</td>
            </tr>
            <tr>
              <td>{zoukan.年柱.chuki}</td>
              <td>{zoukan.月柱.chuki}</td>
              <td>{zoukan.日柱.chuki}</td>
              <td>{zoukan.時柱.chuki}</td>
            </tr>
            <tr>
              <td>{zoukan.年柱.honki}</td>
              <td>{zoukan.月柱.honki}</td>
              <td>{zoukan.日柱.honki}</td>
              <td>{zoukan.時柱.honki}</td>
            </tr>
            <tr>
              <th rowSpan={3}>
                <div className="exist-help">
                  <div>
                    蔵干<br className="header_br_sp"></br>通変星
                  </div>
                  <Image
                    src={staticPath.images.suimei.help_svg}
                    width={16}
                    height={16}
                    alt="ヘルプアイコン"
                    data-tooltip-id="tooltip-help"
                    data-tooltip-html="上から余気・中気・本気の順で<br/>表記しています。"
                  ></Image>
                  <Tooltip id="tooltip-help" />
                </div>
              </th>
              <td>{zoukanTsuhensei.年柱.yoki}</td>
              <td>{zoukanTsuhensei.月柱.yoki}</td>
              <td>{zoukanTsuhensei.日柱.yoki}</td>
              <td>{zoukanTsuhensei.時柱.yoki}</td>
            </tr>
            <tr>
              <td>{zoukanTsuhensei.年柱.chuki}</td>
              <td>{zoukanTsuhensei.月柱.chuki}</td>
              <td>{zoukanTsuhensei.日柱.chuki}</td>
              <td>{zoukanTsuhensei.時柱.chuki}</td>
            </tr>
            <tr>
              <td>{zoukanTsuhensei.年柱.honki}</td>
              <td>{zoukanTsuhensei.月柱.honki}</td>
              <td>{zoukanTsuhensei.日柱.honki}</td>
              <td>{zoukanTsuhensei.時柱.honki}</td>
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
