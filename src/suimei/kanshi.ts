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
  private static BASE = DateTime.fromISO('1909-01-04')

  constructor(private readonly date: DateTime) {}

  get 日柱(): typeof Kanshi.干支[number] {
    const diff = this.date.diff(Kanshi.BASE, 'days').days
    const index = diff % 60
    // @ts-expect-error
    return Kanshi.干支.at(index) // atだと配列にマイナスindexを使える！
  }
}
