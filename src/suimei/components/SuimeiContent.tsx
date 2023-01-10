import { VFC } from 'react'
import Image from 'next/image'
import { staticPath } from '../../lib/$path'

export const SuimeiContent: VFC<any> = ({ onSubmit, defaultValues }) => {
  return (
    <div>
      <div className="title_area">
        <div className="lantern_outer yellow left">
          <div className="lantern_inner">
            <Image
              src={staticPath.images.suimei.lantern_yellow_svg}
              layout="fill"
              objectFit="contain"
              alt="黄色のランタン"
            ></Image>
          </div>
        </div>
        <div className="lantern_outer red left">
          <div className="lantern_inner">
            <Image
              src={staticPath.images.suimei.lantern_red_svg}
              layout="fill"
              objectFit="contain"
              alt="赤色のランタン"
            ></Image>
          </div>
        </div>
        <h2>
          <div className="title_logo">
            <Image
              src={staticPath.images.suimei.logo_suimei_svg}
              layout="fill"
              objectFit="contain"
              alt="四柱推命"
            ></Image>
          </div>
        </h2>
        <div className="lantern_outer red right">
          <div className="lantern_inner">
            <Image
              src={staticPath.images.suimei.lantern_red_svg}
              layout="fill"
              objectFit="contain"
              alt="赤色のランタン"
            ></Image>
          </div>
        </div>
        <div className="lantern_outer yellow right">
          <div className="lantern_inner">
            <Image
              src={staticPath.images.suimei.lantern_yellow_svg}
              layout="fill"
              objectFit="contain"
              alt="黄色のランタン"
            ></Image>
          </div>
        </div>
      </div>
      {/* .title_areaの終了タグ */}
      <section className="information_input">
        <div className="inner">
          <h3>情報入力</h3>
          {/* TODO:actionの値設定する */}
          <form action="" method="post" id="">
            <dl>
              <dt>生年月日</dt>
              <dd className="date_time">
                <input type="date" name="date" />
                <input type="time" name="time" />
              </dd>
              <dt>出生場所</dt>
              <dd className="longitude">
                <label>
                  <span>緯度</span>
                  <input type="text" name="longitude" value="35.604839" />
                </label>
              </dd>
              <dd className="latitude">
                <label>
                  <span>経度</span>
                  <input type="text" name="latitude" value="139.667717" />
                </label>
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
      {/* .information_inputの終了タグ */}
      <section className="result meisiki">
        <div className="inner">
          <h3>
            <div className="heading_icon">
              <Image
                src={staticPath.images.suimei.fun_svg}
                layout="fill"
                objectFit="contain"
                alt="扇のアイコン"
              ></Image>
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
                <td>庚</td>
                <td>庚</td>
                <td>庚</td>
                <td>庚</td>
              </tr>
              <tr>
                <th>地支</th>
                <td>申</td>
                <td>申</td>
                <td>申</td>
                <td>申</td>
              </tr>
              <tr>
                <th>天干通変星</th>
                <td>政官</td>
                <td>政官</td>
                <td>-</td>
                <td>政官</td>
              </tr>
              <tr>
                <th>十二運</th>
                <td>建禄</td>
                <td>建禄</td>
                <td>建禄</td>
                <td>建禄</td>
              </tr>
              <tr>
                <th>蔵干</th>
                <td>乙</td>
                <td>乙</td>
                <td>乙</td>
                <td>乙</td>
              </tr>
              <tr>
                <th>蔵干通変星</th>
                <td>比肩</td>
                <td>比肩</td>
                <td>比肩</td>
                <td>比肩</td>
              </tr>
              <tr>
                <th>特殊星</th>
                <td>
                  流霞殺
                  <br />
                  華蓋
                  <br />
                  白虎
                </td>
                <td>
                  流霞殺
                  <br />
                  華蓋
                  <br />
                  白虎
                </td>
                <td>
                  流霞殺
                  <br />
                  華蓋
                  <br />
                  白虎
                </td>
                <td>
                  流霞殺
                  <br />
                  華蓋
                  <br />
                  白虎
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </section>
      {/* .meisikiの終了タグ */}
      <section className="result gogyo_balance">
        <div className="inner">
          <h3>
            <div className="heading_icon">
              <Image
                src={staticPath.images.suimei.lotus_svg}
                layout="fill"
                objectFit="contain"
                alt="蓮のアイコン"
              ></Image>
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
      {/* .gogyo_balanceの終了タグ */}
      <section className="result daiun">
        <div className="inner">
          <h3>
            <div className="heading_icon">
              <Image
                src={staticPath.images.suimei.kintoun_svg}
                layout="fill"
                objectFit="contain"
                alt="筋斗雲のアイコン"
              ></Image>
            </div>
            <div>大運</div>
          </h3>
          <table>
            <thead>
              <tr>
                <th>（空白セル）</th>
                <th>天干</th>
                <th>地支</th>
                <th>天干通変星</th>
                <th>十二運</th>
                <th>蔵干</th>
                <th>蔵干通変星</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <th>0〜7歳</th>
                <td>庚</td>
                <td>辰</td>
                <td>比肩</td>
                <td>養</td>
                <td>戊</td>
                <td>偏印</td>
              </tr>
              <tr>
                <th>8〜17歳</th>
                <td>庚</td>
                <td>辰</td>
                <td>比肩</td>
                <td>養</td>
                <td>戊</td>
                <td>偏印</td>
              </tr>
              <tr>
                <th>18〜27歳</th>
                <td>庚</td>
                <td>辰</td>
                <td>比肩</td>
                <td>養</td>
                <td>戊</td>
                <td>偏印</td>
              </tr>
              <tr>
                <th>28〜37歳</th>
                <td>庚</td>
                <td>辰</td>
                <td>比肩</td>
                <td>養</td>
                <td>戊</td>
                <td>偏印</td>
              </tr>
              <tr>
                <th>38〜47歳</th>
                <td>庚</td>
                <td>辰</td>
                <td>比肩</td>
                <td>養</td>
                <td>戊</td>
                <td>偏印</td>
              </tr>
              <tr>
                <th>48〜57歳</th>
                <td>庚</td>
                <td>辰</td>
                <td>比肩</td>
                <td>養</td>
                <td>戊</td>
                <td>偏印</td>
              </tr>
              <tr>
                <th>58〜67歳</th>
                <td>庚</td>
                <td>辰</td>
                <td>比肩</td>
                <td>養</td>
                <td>戊</td>
                <td>偏印</td>
              </tr>
              <tr>
                <th>68〜77歳</th>
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
      {/* .daiunの終了タグ */}
      <section className="result saiun">
        <div className="inner">
          <h3>
            <div className="heading_icon">
              <Image
                src={staticPath.images.suimei.peach_svg}
                layout="fill"
                objectFit="contain"
                alt="桃のアイコン"
              ></Image>
            </div>
            <div>歳運</div>
          </h3>
          <table>
            <thead>
              <tr>
                <th></th>
                <th>天干</th>
                <th>地支</th>
                <th>天干通変星</th>
                <th>十二運</th>
                <th>蔵干</th>
                <th>蔵干通変星</th>
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
              <tr>
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
    </div>
  )
}
