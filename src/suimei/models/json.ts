import { DateTime } from 'luxon'
import type { Daiun } from './Daiun'
import { Juuniun, Juniun } from './Juuniun'
import { Kanshi, SekkiPair, 五行, 十二支, 十干, 干支 } from './Kanshi'
import type { Saiun } from './Saiun'
import type { 節 } from './Sekki'
import { SolarTime, toSolarTime } from './SolarTime'
import { tokushusei } from './tokushusei'
import { TenkanTsuhensei, 通変星 } from './Tsuhensei'
import { Zoukan, ZoukanTsuhensei } from './Zoukan'

type 四柱 = '年柱' | '月柱' | '日柱' | '時柱'

// 天文計算の結果。ここから命式を復元できる
export type SuimeiRaw = {
  sekkiPair: SekkiPair
  equationOfTime: number // 均時差（分）
}

type 柱 = {
  干支: 干支
  天干: 十干
  地支: 十二支
  通変星: 通変星 | null // 日柱は、日干が基準なので無い
  蔵干: { 本気: 十干; 中気: 十干 | null; 余気: 十干 }
  蔵干通変星: { 本気: 通変星; 中気: 通変星 | null; 余気: 通変星 }
  十二運: Juniun
  特殊星: string[]
}

type 運 = {
  current?: boolean // 現在の年が分からないときは付けない
  干支: 干支
  天干: 十干
  地支: 十二支
  通変星: 通変星
  蔵干: 十干 // 本気
  蔵干通変星: 通変星
  十二運: Juniun
}
export type 大運 = { fromAge: number; toAge: number } & 運
export type 歳運 = { year: number; age: number } & 運

export type SuimeiResult = {
  節: 節
  真太陽時: {
    dateTime: string // 出生地の暦として読む
    地方時差: number // 分
    均時差: number // 分
  }
  命式: Record<四柱, 柱>
  五行: Record<五行, number>
  大運: 大運[]
  歳運: 歳運[]
}

// 材料から、真太陽時と干支を復元する
export const restoreKanshi = (
  dateTime: DateTime, // 出生地のタイムゾーンで渡す
  lng: number,
  { sekkiPair, equationOfTime }: SuimeiRaw
): { solarTime: SolarTime; kanshi: Kanshi } => {
  const solarTime = toSolarTime(dateTime, lng, equationOfTime)
  return { solarTime, kanshi: new Kanshi(dateTime, sekkiPair, solarTime.dateTime) }
}

const SOLAR_TIME_FORMAT = "yyyy-MM-dd'T'HH:mm"

// モデルでは、中気が無いことを '-' で表している
const to中気 = <T extends string>(chuki: T | '-'): T | null => (chuki === '-' ? null : chuki)

const to蔵干 = <T extends string>({ honki, chuki, yoki }: { honki: T; chuki: T | '-'; yoki: T }) => ({
  本気: honki,
  中気: to中気(chuki),
  余気: yoki,
})

const to運 = (
  干支: 干支,
  { tenkan, tishi, tenkanTsuhensei, zoukan, zoukanTsuhensei, juuniun, thisYear }: Daiun | Saiun,
  hasThisYear: boolean
): 運 => ({
  ...(hasThisYear && { current: thisYear }),
  干支,
  天干: tenkan,
  地支: tishi,
  通変星: tenkanTsuhensei,
  蔵干: zoukan,
  蔵干通変星: zoukanTsuhensei,
  十二運: juuniun,
})

export const toSuimeiResult = ({
  sekkiPair,
  solarTime,
  kanshi,
  daiun,
  saiun,
  hasThisYear,
}: {
  sekkiPair: SekkiPair
  solarTime: SolarTime
  kanshi: Kanshi
  daiun: Daiun[]
  saiun: Saiun[]
  hasThisYear: boolean // 現在の年を受け取っていれば true
}): SuimeiResult => {
  const tenkanTsuhensei = new TenkanTsuhensei(kanshi)
  const zoukan = new Zoukan(kanshi)
  const zoukanTsuhensei = new ZoukanTsuhensei(zoukan)
  const { nenshi, gesshi, nisshi, jishi } = new Juuniun(kanshi)
  const juuniun = { 年柱: nenshi, 月柱: gesshi, 日柱: nisshi, 時柱: jishi }
  const tokushuseiMap = tokushusei(kanshi)

  const to柱 = (四柱: 四柱): 柱 => ({
    干支: kanshi[四柱],
    天干: kanshi[四柱][0] as 十干,
    地支: kanshi[四柱][1] as 十二支,
    通変星: 四柱 === '日柱' ? null : tenkanTsuhensei[四柱],
    蔵干: to蔵干(zoukan[四柱]),
    蔵干通変星: to蔵干(zoukanTsuhensei[四柱]),
    十二運: juuniun[四柱],
    特殊星: tokushuseiMap[四柱],
  })

  return {
    節: sekkiPair.today,
    真太陽時: {
      dateTime: solarTime.dateTime.toFormat(SOLAR_TIME_FORMAT),
      地方時差: solarTime.longitudeDiff,
      均時差: solarTime.equationOfTime,
    },
    命式: { 年柱: to柱('年柱'), 月柱: to柱('月柱'), 日柱: to柱('日柱'), 時柱: to柱('時柱') },
    五行: kanshi.五行,
    大運: daiun.map((_) => ({ fromAge: _.fromAge, toAge: _.toAge, ...to運(_.kanshi, _, hasThisYear) })),
    歳運: saiun.map((_) => ({ year: _.year, age: _.age, ...to運(_.yearKanshi, _, hasThisYear) })),
  }
}

// JSONの大運を、画面で使う形にする
export const toDaiun = (大運: 大運): Daiun => ({
  fromAge: 大運.fromAge,
  toAge: 大運.toAge,
  thisYear: 大運.current ?? false,
  kanshi: 大運.干支,
  tenkan: 大運.天干,
  tishi: 大運.地支,
  tenkanTsuhensei: 大運.通変星,
  zoukan: 大運.蔵干,
  zoukanTsuhensei: 大運.蔵干通変星,
  juuniun: 大運.十二運,
})
