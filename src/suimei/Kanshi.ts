import { DateTime } from 'luxon'
import type { 節 } from './Sekki'

const 十干pronunciation = {
  甲: ['こう', 'きのえ'],
  乙: ['おつ', 'きのと'],
  丙: ['へい', 'ひのえ'],
  丁: ['てい', 'ひのと'],
  戊: ['ぼ', 'つちのえ'],
  己: ['き', 'つちのと'],
  庚: ['こう', 'かのえ'],
  辛: ['しん', 'かのと'],
  壬: ['じん', 'みずのえ'],
  癸: ['き', 'みずのと'],
} as const
export const 十干list = ['甲', '乙', '丙', '丁', '戊', '己', '庚', '辛', '壬', '癸'] as const
export const 十二支list = ['子', '丑', '寅', '卯', '辰', '巳', '午', '未', '申', '酉', '戌', '亥'] as const
const 五行list = ['木', '火', '土', '金', '水'] as const // 読み方: もく, か, ど, こん, すい

export type 十干 = typeof 十干list[number]
export type 十二支 = typeof 十二支list[number]
type 干支 = `${十干}${十二支}`
type 五行 = typeof 五行list[number]

const get六十干支 = (): 干支[] => {
  const 干支list: 干支[] = []

  for (let i = 0; i < 60; i++) {
    const 干 = 十干list[i % 10]
    const 支 = 十二支list[i % 12]
    干支list.push(`${干}${支}`)
  }
  return 干支list
}

export const get十干五行 = (干: 十干): 五行 => {
  let index = 十干list.indexOf(干)

  // 2つずつペアで同じ五行とする
  index = (index - (index % 2)) / 2
  return 五行list[index]
}

export const get十二支五行 = (支: 十二支): 五行 => {
  // 寅, 卯, ..., 子, 丑 になるように並べ直す
  let index = 十二支list.indexOf(支) - 2
  if (index < 0) index += 12

  // 土だけは特殊なので先に判定
  if (index % 3 === 2) {
    return '土'
  }

  // 2つずつペアで同じ五行とする
  index = (index - (index % 3)) / 3
  return (['木', '火', '金', '水'] as const)[index]
}

export type SekkiPair = {
  today: 節
  endOfMonth: 節
}

export class Kanshi {
  static readonly 六十干支 = get六十干支()

  constructor(private readonly date: DateTime, private readonly sekki: SekkiPair) {}

  get 年柱(): 干支 {
    let { year } = this.date
    const { month } = this.date

    // 年明け〜立春前までは前年と見なす
    if (month === 1 || (month === 2 && this.sekki.today !== '立春')) {
      year--
    }
    const index = (year - 4) % 60

    return Kanshi.六十干支.at(index)!
  }

  get 月柱(): 干支 {
    const BASE = DateTime.fromISO('2019-01-01T00:00:00+09:00') // 月柱が甲子の元旦
    let monthsDiff = Math.trunc(this.date.diff(BASE, 'months').months)

    // 節入日の前後によって調整
    if (this.date > BASE && this.sekki.today === this.sekki.endOfMonth) {
      monthsDiff++
    } else if (this.date < BASE && this.sekki.today !== this.sekki.endOfMonth) {
      monthsDiff--
    }
    const index = monthsDiff % 60

    return Kanshi.六十干支.at(index)!
  }

  // 日柱が甲子(index:0)となる基準日
  private static BASE = DateTime.fromISO('1909-01-04')

  get 日柱(): 干支 {
    const diff = this.date.diff(Kanshi.BASE, 'days').days
    const index = diff % 60

    return Kanshi.六十干支.at(index)!
  }

  get 時柱(): 干支 {
    // TODO: 位置情報を考慮して時刻を微調整する
    // 四柱推命の本P22を参照
    // ホロスコープも同じ調整を入れるべきか？
    const hour = this.date.plus({ hour: 1 }).hour

    const index = (Math.trunc(hour / 2) + this.日干index * 12) % 60

    return Kanshi.六十干支.at(index)!
  }

  // 天干を個別取得
  get 年干(): 十干 {
    return this.年柱[0] as 十干
  }
  get 月干(): 十干 {
    return this.月柱[0] as 十干
  }
  get 日干(): 十干 {
    return this.日柱[0] as 十干
  }
  get 時干(): 十干 {
    return this.時柱[0] as 十干
  }
  get 天干(): [十干, 十干, 十干, 十干] {
    return [this.年干, this.月干, this.日干, this.時干]
  }

  // 地支を個別取得
  get 年支(): 十二支 {
    return this.年柱[1] as 十二支
  }
  get 月支(): 十二支 {
    return this.月柱[1] as 十二支
  }
  get 日支(): 十二支 {
    return this.日柱[1] as 十二支
  }
  get 時支(): 十二支 {
    return this.時柱[1] as 十二支
  }
  get 地支(): [十二支, 十二支, 十二支, 十二支] {
    return [this.年支, this.月支, this.日支, this.時支]
  }

  private get 日干index(): number {
    const diff = this.date.diff(Kanshi.BASE, 'days').days
    const index = Math.trunc(diff % 10)
    return index
  }
}
