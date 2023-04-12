import type { 十干 as Jikkan, 十二支 as Junishi, Kanshi } from './Kanshi'
import { calcTsuhensei, 通変星 } from './Tsuhensei'

type 蔵干 = {
  honki: Jikkan
  chuki: Jikkan | '-'
  yoki: Jikkan
}
type 蔵干通変星 = {
  honki: 通変星
  chuki: 通変星 | '-'
  yoki: 通変星
}

export const calcZoukan = (chishi: Junishi): 蔵干 => {
  switch (chishi) {
    case '子':
      return {
        honki: '癸',
        chuki: '-',
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
        chuki: '-',
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
        chuki: '-',
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
        chuki: '-',
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
        chuki: '-',
        yoki: '甲',
      }
  }
}

export class Zoukan {
  readonly 年柱: 蔵干
  readonly 月柱: 蔵干
  readonly 日柱: 蔵干
  readonly 時柱: 蔵干

  constructor(readonly kanshi: Kanshi) {
    this.年柱 = calcZoukan(kanshi.年支)
    this.月柱 = calcZoukan(kanshi.月支)
    this.日柱 = calcZoukan(kanshi.日支)
    this.時柱 = calcZoukan(kanshi.時支)
  }
}

export const calcChukiTsuhensei = (nikkan: Jikkan, chukiZoukan: Jikkan | '-'): 通変星 | '-' => {
  if (chukiZoukan === '-') {
    return '-'
  }

  return calcTsuhensei(nikkan, chukiZoukan)
}

export class ZoukanTsuhensei {
  readonly 年柱: 蔵干通変星
  readonly 月柱: 蔵干通変星
  readonly 日柱: 蔵干通変星
  readonly 時柱: 蔵干通変星

  constructor(zoukan: Zoukan) {
    const nikkan = zoukan.kanshi.日干

    this.年柱 = {
      honki: calcTsuhensei(nikkan, zoukan.年柱.honki),
      chuki: calcChukiTsuhensei(nikkan, zoukan.年柱.chuki),
      yoki: calcTsuhensei(nikkan, zoukan.年柱.yoki),
    }
    this.月柱 = {
      honki: calcTsuhensei(nikkan, zoukan.月柱.honki),
      chuki: calcChukiTsuhensei(nikkan, zoukan.月柱.chuki),
      yoki: calcTsuhensei(nikkan, zoukan.月柱.yoki),
    }
    this.日柱 = {
      honki: calcTsuhensei(nikkan, zoukan.日柱.honki),
      chuki: calcChukiTsuhensei(nikkan, zoukan.日柱.chuki),
      yoki: calcTsuhensei(nikkan, zoukan.日柱.yoki),
    }
    this.時柱 = {
      honki: calcTsuhensei(nikkan, zoukan.時柱.honki),
      chuki: calcChukiTsuhensei(nikkan, zoukan.時柱.chuki),
      yoki: calcTsuhensei(nikkan, zoukan.時柱.yoki),
    }
  }
}
