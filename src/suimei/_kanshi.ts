import { DateTime } from 'luxon'
import { getLongitude } from '../horoscope/swisseph'
import { sekki } from './_sekki'

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

type Sekki = {
  today: string
  endOfMonth: string
}
export const getKanshiInstance = async (date: Date) => {
  const dateTime = DateTime.fromJSDate(date)

  return new Kanshi(dateTime, {
    today: sekki(await getLongitude(date)),
    endOfMonth: sekki(await getLongitude(dateTime.endOf('month').toJSDate())),
  })
}

export class Kanshi {
  static readonly 六十干支 = get六十干支()

  constructor(private readonly date: DateTime, private readonly sekki: Sekki) {}

  get 年柱(): T干支 {
    let { year } = this.date
    const { month } = this.date

    // 年明け〜立春前までは前年と見なす
    if (month === 1 || (month === 2 && this.sekki.today !== '立春')) {
      year--
    }
    const index = (year - 4) % 60

    return Kanshi.六十干支.at(index)!
  }

  get 月柱(): T干支 {
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
