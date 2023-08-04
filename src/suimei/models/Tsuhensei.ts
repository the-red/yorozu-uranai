import { 十干list as jikkanList } from './Kanshi'
import type { 十干 as Jikkan, Kanshi } from './Kanshi'

const tsuhenseiEven = ['比肩', '印綬', '偏印', '正官', '偏官', '正財', '偏財', '傷官', '食神', '劫財'] as const
const tsuhenseiOdd = ['比肩', '劫財', '偏印', '印綬', '偏官', '正官', '偏財', '正財', '食神', '傷官'] as const

export type 通変星 = typeof tsuhenseiEven[number] | typeof tsuhenseiOdd[number]

export const calcTsuhensei = (nikkan: Jikkan, anotherJikkan: Jikkan): 通変星 => {
  // 日干の判定：奇数か偶数か
  const nikkanIndex = jikkanList.indexOf(nikkan)
  const anotherJikkanIndex = jikkanList.indexOf(anotherJikkan)
  const tsuhenseiIndex = nikkanIndex - anotherJikkanIndex

  if (isEven(nikkanIndex)) {
    // 日干が偶数
    return tsuhenseiEven.at(tsuhenseiIndex) as 通変星
  } else {
    // 日干が奇数
    return tsuhenseiOdd.at(tsuhenseiIndex) as 通変星
  }
}

const isEven = (targetNumber: number) => {
  return targetNumber % 2 === 0
}

export class TenkanTsuhensei {
  readonly 年柱: 通変星
  readonly 月柱: 通変星
  readonly 時柱: 通変星
  constructor(kanshi: Kanshi) {
    this.年柱 = calcTsuhensei(kanshi.日干, kanshi.年干)
    this.月柱 = calcTsuhensei(kanshi.日干, kanshi.月干)
    this.時柱 = calcTsuhensei(kanshi.日干, kanshi.時干)
  }
}
