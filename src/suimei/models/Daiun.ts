import { getSetsuIri } from './SekkiUtil'
import { Kanshi } from './Kanshi'
import { SekkiPair } from './Kanshi'
import { DateTime } from 'luxon'
import { 十干 } from './Kanshi'

type Gender = 'man' | 'woman' | ''

// 節入りまでの日数
const numberOfDaysToSetsuIri = async (date: Date, gender: Gender, sekki: SekkiPair) => {
  const baseDate = DateTime.fromJSDate(date)
  const kanshi = new Kanshi(baseDate, sekki)
  const forward = isForward(kanshi.年干, gender)
  // 一番近い節入りの日付を取得
  const setsuIri = await getSetsuIri(date, forward)
  // 生まれた日から節入りまでの日数
  const days = Math.round(baseDate.diff(DateTime.fromJSDate(setsuIri.date), ['days']).days)

  return Math.abs(days)
}

// 順行か逆行か
const isForward = (nenkan: 十干, gender: Gender) => {
  // gender未選択のときは女性の結果が返る
  if (['甲', '丙', '戊', '庚', '壬'].includes(nenkan)) {
    return gender === 'man' ? true : false
  } else {
    return gender === 'man' ? false : true
  }
}

// 初運
const shoun = (numberOfDays: number) => {
  const quotient = Math.floor(numberOfDays / 3)

  return numberOfDays % 3 === 2 ? Math.ceil(quotient) : Math.trunc(quotient)
}
