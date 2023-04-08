import Image from 'next/image'
import { staticPath } from '../../lib/$path'

export const Daiun = () => (
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
            <th>天干</th>
            <th>地支</th>
            <th>
              天干<br className="header_br_sp"></br>通変星
            </th>
            <th>十二運</th>
            <th>蔵干</th>
            <th>
              蔵干<br className="header_br_sp"></br>通変星
            </th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <th>
              0〜<br className="header_br_sp"></br>7歳
            </th>
            <td>庚</td>
            <td>辰</td>
            <td>比肩</td>
            <td>養</td>
            <td>戊</td>
            <td>偏印</td>
          </tr>
          <tr>
            <th>
              8〜<br className="header_br_sp"></br>17歳
            </th>
            <td>庚</td>
            <td>辰</td>
            <td>比肩</td>
            <td>養</td>
            <td>戊</td>
            <td>偏印</td>
          </tr>
          <tr>
            <th>
              18〜<br className="header_br_sp"></br>27歳
            </th>
            <td>庚</td>
            <td>辰</td>
            <td>比肩</td>
            <td>養</td>
            <td>戊</td>
            <td>偏印</td>
          </tr>
          <tr>
            <th>
              28〜<br className="header_br_sp"></br>37歳
            </th>
            <td>庚</td>
            <td>辰</td>
            <td>比肩</td>
            <td>養</td>
            <td>戊</td>
            <td>偏印</td>
          </tr>
          <tr>
            <th>
              38〜<br className="header_br_sp"></br>47歳
            </th>
            <td>庚</td>
            <td>辰</td>
            <td>比肩</td>
            <td>養</td>
            <td>戊</td>
            <td>偏印</td>
          </tr>
          <tr>
            <th>
              48〜<br className="header_br_sp"></br>57歳
            </th>
            <td>庚</td>
            <td>辰</td>
            <td>比肩</td>
            <td>養</td>
            <td>戊</td>
            <td>偏印</td>
          </tr>
          <tr>
            <th>
              58〜<br className="header_br_sp"></br>67歳
            </th>
            <td>庚</td>
            <td>辰</td>
            <td>比肩</td>
            <td>養</td>
            <td>戊</td>
            <td>偏印</td>
          </tr>
          <tr>
            <th>
              68〜<br className="header_br_sp"></br>77歳
            </th>
            <td>庚</td>
            <td>辰</td>
            <td>比肩</td>
            <td>養</td>
            <td>戊</td>
            <td>偏印</td>
          </tr>
        </tbody>
      </table>
    </div>
  </section>
)
