import { DateTime } from 'luxon'

const 十干 = ['甲', '乙', '丙', '丁', '戊', '己', '庚', '辛', '壬', '癸'] as const
const 十二支 = ['子', '丑', '寅', '卯', '辰', '巳', '午', '未', '申', '酉', '戌', '亥'] as const
type T干支 = `${typeof 十干[number]}${typeof 十二支[number]}`

const get六十干支 = (): T干支[] => {
  const 六十干支: T干支[] = []

  for (let i = 0; i < 60; i++) {
    const 干 = 十干[i % 10]
    const 支 = 十二支[i % 12]
    六十干支.push(`${干}${支}`)
  }
  return 六十干支
}

export class Kanshi {
  static readonly 六十干支 = get六十干支()

  // 月柱・日柱が甲子(index:0)となる基準日
  // TODO: 年柱もセットで3つが甲子になる日を見つけたい
  private static BASE = DateTime.fromISO('1909-01-04')

  constructor(private readonly date: DateTime) {}

  get 年柱(): T干支 {
    const year = this.date.year

    // TODO: 立春を考慮して調整する
    // 今は立春後のindexで固定しているので、立春前（1月と2月頭）は結果が違う可能性あり
    const index = (year % 60) - 4

    return Kanshi.六十干支.at(index)!
  }

  get 月柱(): T干支 {
    const diff = this.date.diff(Kanshi.BASE, 'months').months

    // TODO: 節入日を考慮して調整する
    // 今は節入後のindexで固定しているので、節入前（月の前半）は結果が違う可能性あり
    const index = (diff % 60) + 1

    return Kanshi.六十干支.at(index)!
  }

  get 日柱(): T干支 {
    const diff = this.date.diff(Kanshi.BASE, 'days').days
    const index = diff % 60

    return Kanshi.六十干支.at(index)!
  }

  get 時柱(): T干支 {
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
