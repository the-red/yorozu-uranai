import { 十干list as jikkanList, 十二支list as junishiList } from './Kanshi'

const juuniunEven = ['胎', '養', '長生', '沐浴', '冠帯', '建禄', '帝旺', '衰', '病', '死', '墓', '絶']
const juuniunOdd = juuniunEven.reverse()

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
