import { DateTime } from 'luxon'

export class Kanshi {
  static readonly 干支 = [
    '甲子',
    '乙丑',
    '丙寅',
    '丁卯',
    '戊辰',
    '己巳',
    '庚午',
    '辛未',
    '壬申',
    '癸酉',
    '甲戌',
    '乙亥',
    '丙子',
    '丁丑',
    '戊寅',
    '己卯',
    '庚辰',
    '辛巳',
    '壬午',
    '癸未',
    '甲申',
    '乙酉',
    '丙戌',
    '丁亥',
    '戊子',
    '己丑',
    '庚寅',
    '辛卯',
    '壬辰',
    '癸巳',
    '甲午',
    '乙未',
    '丙申',
    '丁酉',
    '戊戌',
    '己亥',
    '庚子',
    '辛丑',
    '壬寅',
    '癸卯',
    '甲辰',
    '乙巳',
    '丙午',
    '丁未',
    '戊申',
    '己酉',
    '庚戌',
    '辛亥',
    '壬子',
    '癸丑',
    '甲寅',
    '乙卯',
    '丙辰',
    '丁巳',
    '戊午',
    '己未',
    '庚申',
    '辛酉',
    '壬戌',
    '癸亥',
  ] as const

  // 月柱・日柱が甲子(index:0)となる基準日
  // TODO: 年柱もセットで3つが甲子になる日を見つけたい
  private static BASE = DateTime.fromISO('1909-01-04')

  constructor(private readonly date: DateTime) {}

  get 年柱(): typeof Kanshi.干支[number] {
    const year = this.date.year

    // TODO: 立春を考慮して調整する
    // 今は立春後のindexで固定しているので、立春前（1月と2月頭）は結果が違う可能性あり
    const index = (year % 60) - 4

    // @ts-expect-error
    return Kanshi.干支.at(index)
  }

  get 月柱(): typeof Kanshi.干支[number] {
    const diff = this.date.diff(Kanshi.BASE, 'months').months

    // TODO: 節入日を考慮して調整する
    // 今は節入後のindexで固定しているので、節入前（月の前半）は結果が違う可能性あり
    const index = (diff % 60) + 1

    // @ts-expect-error
    return Kanshi.干支.at(index)
  }

  get 日柱(): typeof Kanshi.干支[number] {
    const diff = this.date.diff(Kanshi.BASE, 'days').days
    const index = diff % 60
    // @ts-expect-error
    return Kanshi.干支.at(index)
  }

  get 時柱(): typeof Kanshi.干支[number] {
    // TODO: 位置情報を考慮して時刻を微調整する
    // 四柱推命の本P22を参照
    // ホロスコープも同じ調整を入れるべきか？
    const hour = this.date.plus({ hour: 1 }).hour

    const index = Math.trunc(hour / 2) + this.日干index * 12

    // @ts-expect-error
    return Kanshi.干支.at(index)
  }

  private get 日干index(): number {
    const diff = this.date.diff(Kanshi.BASE, 'days').days
    const index = Math.trunc(diff % 10)
    return index
  }
}
