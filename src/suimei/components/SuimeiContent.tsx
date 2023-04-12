import type { FC } from 'react'
import Image from 'next/image'
import { staticPath } from '../../lib/$path'
import { Suimei } from '../'

export const SuimeiContent: FC<{ suimei: Suimei }> = ({ suimei }) => {
  const { kanshi, tenkanTsuhensei, zoukan, zoukanTsuhensei } = suimei

  const TitleArea = () => (
    <div className="title_area">
      <div className="lantern_outer yellow left">
        <div className="lantern_inner">
          <Image src={staticPath.images.suimei.lantern_yellow_svg} className="image" fill alt="黄色のランタン"></Image>
        </div>
      </div>
      <div className="lantern_outer red left">
        <div className="lantern_inner">
          <Image src={staticPath.images.suimei.lantern_red_svg} className="image" fill alt="赤色のランタン"></Image>
        </div>
      </div>
      <h2>
        <div className="title_logo">
          <Image src={staticPath.images.suimei.logo_suimei_svg} className="image" fill alt="四柱推命"></Image>
        </div>
      </h2>
      <div className="lantern_outer red right">
        <div className="lantern_inner">
          <Image src={staticPath.images.suimei.lantern_red_svg} className="image" fill alt="赤色のランタン"></Image>
        </div>
      </div>
      <div className="lantern_outer yellow right">
        <div className="lantern_inner">
          <Image src={staticPath.images.suimei.lantern_yellow_svg} className="image" fill alt="黄色のランタン"></Image>
        </div>
      </div>
    </div>
  )

  const InformationInput = () => (
    <section className="information_input">
      <div className="inner">
        <h3>情報入力</h3>
        <form action="" method="post" id="">
          <dl>
            <dt>生年月日</dt>
            <dd className="date_time">
              <input type="date" name="date" />
              <input type="time" name="time" />
            </dd>
            <dt>出生場所</dt>
            <dd className="longitude_latitude">
              <div className="longitude">
                <label>
                  <span>緯度</span>
                  <input type="text" name="longitude" value="35.604839" />
                </label>
              </div>
              <div className="latitude">
                <label>
                  <span>経度</span>
                  <input type="text" name="latitude" value="139.667717" />
                </label>
              </div>
            </dd>
            <dt>性別</dt>
            <dd className="gender">
              <ul>
                <li>
                  <label>
                    <input type="radio" name="gender" value="未選択" checked />
                    <div>未選択</div>
                  </label>
                </li>
                <li>
                  <label>
                    <input type="radio" name="gender" value="男性" />
                    <div>男性</div>
                  </label>
                </li>
                <li>
                  <label>
                    <input type="radio" name="gender" value="女性" />
                    <div>女性</div>
                  </label>
                </li>
              </ul>
            </dd>
          </dl>
          <div className="create_meisiki_button">
            <button type="submit">命式を作成する</button>
          </div>
        </form>
      </div>
    </section>
  )

  const Meisiki = () => (
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
              <td></td>
              <td></td>
              <td></td>
              <td></td>
            </tr>
          </tbody>
        </table>
      </div>
    </section>
  )

  const GogyoBalance = () => (
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

  const Daiun = () => (
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

  const Saiun = () => (
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
                <span>30歳</span>2017年
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
                <span>31歳</span>2018年
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
                <span>32歳</span>2019年
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
                <span>33歳</span>2020年
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
                <span>34歳</span>2021年
              </th>
              <td>庚</td>
              <td>辰</td>
              <td>比肩</td>
              <td>養</td>
              <td>戊</td>
              <td>偏印</td>
            </tr>
            <tr className="current">
              <th>
                <span>35歳</span>2022年
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
                <span>36歳</span>2023年
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
                <span>37歳</span>2024年
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
                <span>38歳</span>2025年
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
                <span>39歳</span>2026年
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
                <span>40歳</span>2027年
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

  return (
    <div>
      <TitleArea />
      <InformationInput />
      <Meisiki />
      <GogyoBalance />
      <Daiun />
      <Saiun />
    </div>
  )
}
