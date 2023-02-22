import { 十干list as jikkanList, 十二支list as junishiList } from './Kanshi'

type Jikkan = typeof jikkanList[number]
type Junishi = typeof junishiList[number]
type Zoukan = {
  honki: Jikkan | ''
  chuki: Jikkan | ''
  yoki: Jikkan | ''
}

export const zoukan = (chishi: Junishi): Zoukan => {
  switch (chishi) {
    case '子':
      return {
        honki: '癸',
        chuki: '',
        yoki: '壬',
      }
    case '丑':
      return {
        honki: '己',
        chuki: '辛',
        yoki: '癸',
      }
    case '寅':
      return {
        honki: '甲',
        chuki: '丙',
        yoki: '戊',
      }
    case '卯':
      return {
        honki: '乙',
        chuki: '',
        yoki: '甲',
      }
    case '辰':
      return {
        honki: '戊',
        chuki: '癸',
        yoki: '乙',
      }
    case '巳':
      return {
        honki: '丙',
        chuki: '庚',
        yoki: '戊',
      }
    case '午':
      return {
        honki: '丁',
        chuki: '',
        yoki: '己',
      }
    case '未':
      return {
        honki: '己',
        chuki: '乙',
        yoki: '丁',
      }
    case '申':
      return {
        honki: '庚',
        chuki: '壬',
        yoki: '戊',
      }
    case '酉':
      return {
        honki: '辛',
        chuki: '',
        yoki: '庚',
      }
    case '戌':
      return {
        honki: '戊',
        chuki: '丁',
        yoki: '辛',
      }
    case '亥':
      return {
        honki: '壬',
        chuki: '',
        yoki: '甲',
      }
  }
}
