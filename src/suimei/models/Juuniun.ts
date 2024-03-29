import { 十干list as jikkanList, 十二支list as junishiList } from './Kanshi'
import type { Kanshi } from './Kanshi'

const juuniunEven = ['胎', '養', '長生', '沐浴', '冠帯', '建禄', '帝旺', '衰', '病', '死', '墓', '絶']
const juuniunOdd = ['絶', '墓', '死', '病', '衰', '帝旺', '建禄', '冠帯', '沐浴', '長生', '養', '胎']

export type Juniun = typeof juuniunEven[number] | typeof juuniunOdd[number]

const startIndex = (jikkan: typeof jikkanList[number]) => {
  if (jikkan === '甲' || jikkan === '乙') {
    return 9
  } else if (jikkan === '丙' || jikkan === '丁' || jikkan === '戊' || jikkan === '己') {
    return 0
  } else if (jikkan === '庚' || jikkan === '辛') {
    return 3
  } else if (jikkan === '壬' || jikkan === '癸') {
    return 6
  }
}

export const juuniun = (nikkan: typeof jikkanList[number], junishi: typeof junishiList[number]): Juniun => {
  const nikkanIndex = startIndex(nikkan)
  const junishiIndex = junishiList.indexOf(junishi)
  const juuniunIndex = junishiIndex - Number(nikkanIndex)

  if (jikkanList.indexOf(nikkan) % 2 === 0) {
    return juuniunEven.at(juuniunIndex) as Juniun
  } else {
    return juuniunOdd.at(juuniunIndex) as Juniun
  }
}

export class Juuniun {
  readonly nenshi: Juniun
  readonly gesshi: Juniun
  readonly nisshi: Juniun
  readonly jishi: Juniun

  constructor(kanshi: Kanshi) {
    this.nenshi = juuniun(kanshi.日干, kanshi.年支)
    this.gesshi = juuniun(kanshi.日干, kanshi.月支)
    this.nisshi = juuniun(kanshi.日干, kanshi.日支)
    this.jishi = juuniun(kanshi.日干, kanshi.時支)
  }
}
