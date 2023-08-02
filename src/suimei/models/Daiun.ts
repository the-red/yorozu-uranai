import { getSekkiPair, getSetsuIri } from './SekkiUtil'
import { Kanshi, SekkiPair } from './Kanshi'
import { DateTime } from 'luxon'
import { 十干, 干支, 十二支, get六十干支 } from './Kanshi'
import { calcZoukan } from './Zoukan'
import { 通変星, calcTsuhensei } from './Tsuhensei'
import { Juniun, juuniun } from './Juuniun'

export type Gender = 'man' | 'woman'

export type Daiun = {
  fromAge: number
  toAge: number
  kanshi: 干支
  tenkan: 十干
  tishi: 十二支
  tenkanTsuhensei: 通変星
  zoukan: 十干
  zoukanTsuhensei: 通変星
  juuniun: Juniun
}

const junkou = get六十干支()
const gyakkou = [...junkou].reverse()

// 節入りまでの日数
const numberOfDaysToSetsuIri = async (date: Date, datetime: DateTime, forward: boolean) => {
  // 一番近い節入りの日付を取得
  const setsuIri = await getSetsuIri(date, forward)
  // 生まれた日から節入りまでの日数
  const days = Math.abs(Math.round(datetime.diff(DateTime.fromJSDate(setsuIri.date), ['days']).days))

  return days <= 3 ? 1 : days
}

// 順行か逆行か
const isForward = (nenkan: 十干, gender: Gender) => {
  if (['甲', '丙', '戊', '庚', '壬'].includes(nenkan)) {
    return gender === 'man' ? true : false
  } else {
    return gender === 'man' ? false : true
  }
}

// 初運
const calcShoun = (numberOfDays: number) => {
  const quotient = Math.floor(numberOfDays / 3)

  return numberOfDays % 3 === 2 ? Math.ceil(quotient) : Math.trunc(quotient)
}

export const generateDaiun = async (date: Date, datetime: DateTime, gender: Gender, sekkiPair: SekkiPair) => {
  const baseDate = DateTime.fromJSDate(date)
  const sekki = sekkiPair
  // 干支
  const kanshi = new Kanshi(baseDate, sekki)
  // 順行か逆行か
  const forward = isForward(kanshi.年干, gender)
  // 初運
  const daysOfSetsuIri = await numberOfDaysToSetsuIri(date, datetime, forward)
  const shoun = calcShoun(daysOfSetsuIri)
  // 月柱の干支の順行 / 逆行早見表でのindex
  const gecchuIndex = forward ? junkou.indexOf(kanshi.月柱) : gyakkou.indexOf(kanshi.月柱)

  const daiun: Daiun[] = []

  for (let i = 0; ; i++) {
    const kanshiIndex = gecchuIndex + i < 60 ? gecchuIndex + i : gecchuIndex + i - 60
    const daiunKanshi = forward ? junkou[kanshiIndex] : gyakkou[kanshiIndex]
    const tenkan = daiunKanshi.charAt(0) as 十干
    const tishi = daiunKanshi.charAt(1) as 十二支
    const zoukanHonki = calcZoukan(tishi).honki

    const fromAge = i === 0 ? 0 : shoun + 1 + 10 * (i - 1)
    const toAge = i === 0 ? shoun : fromAge + 9

    const daiunDetail: Daiun = {
      fromAge,
      toAge,
      kanshi: daiunKanshi,
      tenkan,
      tishi,
      tenkanTsuhensei: calcTsuhensei(kanshi.日干, tenkan),
      zoukan: zoukanHonki,
      zoukanTsuhensei: calcTsuhensei(kanshi.日干, zoukanHonki),
      juuniun: juuniun(kanshi.日干, tishi),
    }
    daiun.push(daiunDetail)

    // 120歳（大還暦）を超えたら終了
    if (toAge >= 120) {
      break
    }
  }

  return daiun
}
