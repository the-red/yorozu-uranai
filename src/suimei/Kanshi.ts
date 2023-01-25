import { DateTime } from 'luxon'
import type { 節 } from './Sekki'

export const 十干list = ['甲', '乙', '丙', '丁', '戊', '己', '庚', '辛', '壬', '癸'] as const
const 十二支list = ['子', '丑', '寅', '卯', '辰', '巳', '午', '未', '申', '酉', '戌', '亥'] as const
type 干支 = `${typeof 十干list[number]}${typeof 十二支list[number]}`

const get六十干支 = (): 干支[] => {
  const 干支list: 干支[] = []

  for (let i = 0; i < 60; i++) {
    const 干 = 十干list[i % 10]
    const 支 = 十二支list[i % 12]
    干支list.push(`${干}${支}`)
  }
  return 干支list
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

    const index = Math.trunc(hour / 2) + this.日干index * 12

    return Kanshi.六十干支.at(index)!
  }

  private get 日干index(): number {
    const diff = this.date.diff(Kanshi.BASE, 'days').days
    const index = Math.trunc(diff % 10)
    return index
  }
}
