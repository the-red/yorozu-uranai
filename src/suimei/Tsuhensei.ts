import { 十干list as jikkanList } from './Kanshi'

const tsuhenseiEven = ['比肩', '印綬', '偏印', '正官', '偏官', '正財', '偏財', '傷官', '食神', '劫財'] as const
const tsuhenseiOdd = ['比肩', '劫財', '偏印', '印綬', '偏官', '正官', '偏財', '正財', '食神', '傷官'] as const

type Jikkan = typeof jikkanList[number]

export const tsuhensei = (nikkan: Jikkan, jikkan: Jikkan) => {
  // 日干の判定：奇数か偶数か
  const nikkanIndex = jikkanList.indexOf(nikkan)
  const jikkanIndex = jikkanList.indexOf(jikkan)
  const tsuhenseiIndex = nikkanIndex - jikkanIndex

  if (isEven(nikkanIndex)) {
    // 日干が偶数
    return tsuhenseiEven.at(tsuhenseiIndex)
  } else {
    // 日干が奇数
    return tsuhenseiOdd.at(tsuhenseiIndex)
  }
}

const isEven = (targetNumber: number) => {
  return targetNumber % 2 === 0
}
