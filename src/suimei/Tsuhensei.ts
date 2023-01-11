const tsuhenseiEven = ['比肩', '印綬', '偏印', '正官', '偏官', '正財', '偏財', '傷官', '食神', '劫財'] as const
const tsuhenseiOdd = ['比肩', '劫財', '偏印', '印綬', '偏官', '正官', '偏財', '正財', '食神', '傷官'] as const
const jikkanList = ['甲', '乙', '丙', '丁', '戊', '己', '庚', '辛', '壬', '癸'] as const

type Jikkan = typeof jikkanList[number]

export const tsuhensei = (nikkan: Jikkan, jikkan: Jikkan) => {
  // 日干の判定：奇数か偶数か
  const nikkanIndex = jikkanList.indexOf(nikkan)
  const jikkanIndex = jikkanList.indexOf(jikkan)
  const tsuhenseiIndex = nikkanIndex - jikkanIndex

  if (isEven(nikkanIndex)) {
    // 日干が偶数
    // 日干-十干 < 0
    return tsuhenseiIndex < 0 ? tsuhenseiEven[10 + tsuhenseiIndex] : tsuhenseiEven[tsuhenseiIndex]
  } else {
    // 日干が奇数
    return tsuhenseiIndex < 0 ? tsuhenseiOdd[10 + tsuhenseiIndex] : tsuhenseiOdd[tsuhenseiIndex]
  }
}

const isEven = (targetNumber: number) => {
  return targetNumber % 2 === 0 ? true : false
}
