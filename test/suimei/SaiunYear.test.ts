import { describe, it, expect } from 'vitest'
import { DateTime } from 'luxon'
import { Kanshi, SekkiPair } from '../../src/suimei/models/Kanshi'
import { generateSaiun } from '../../src/suimei/models/Saiun'

// 1月1日は、小寒の前
const sekkiPair: SekkiPair = { today: '大雪', endOfMonth: '小寒' }

// 生まれ年から4年分の、歳運の年と干支
const saiun = (birthYear: number) => {
  const dateTime = DateTime.fromObject({ year: birthYear, month: 1, day: 1, hour: 12 }, { zone: 'Asia/Tokyo' })
  const kanshi = new Kanshi(dateTime, sekkiPair)
  return generateSaiun(kanshi, dateTime, sekkiPair, NaN, birthYear, birthYear + 3).map((_) => [_.year, _.yearKanshi])
}

describe('歳運の年', () => {
  it('4桁の年', () => {
    // 1984年は甲子
    expect(saiun(1983)).toEqual([
      [1983, '癸亥'],
      [1984, '甲子'],
      [1985, '乙丑'],
      [1986, '丙寅'],
    ])
  })
  it('3桁から4桁に変わる年', () => {
    // 1000年（長保2年）は庚子
    expect(saiun(998)).toEqual([
      [998, '戊戌'],
      [999, '己亥'],
      [1000, '庚子'],
      [1001, '辛丑'],
    ])
  })
  it('3桁の年', () => {
    expect(saiun(500)).toEqual([
      [500, '庚辰'],
      [501, '辛巳'],
      [502, '壬午'],
      [503, '癸未'],
    ])
  })
  it('2桁の年', () => {
    // NOTE: JavaScriptのDateは、0〜99年を1900年代として扱うことがある
    expect(saiun(50)).toEqual([
      [50, '庚戌'],
      [51, '辛亥'],
      [52, '壬子'],
      [53, '癸丑'],
    ])
  })
  it('4桁から5桁に変わる年', () => {
    expect(saiun(9998)).toEqual([
      [9998, '戊戌'],
      [9999, '己亥'],
      [10000, '庚子'],
      [10001, '辛丑'],
    ])
  })

  it('通変星と十二運も、その年の干支から求める', () => {
    // 日干は、1月1日の日柱から決まる。年ごとに値が変わることだけを確かめる
    const dateTime = DateTime.fromObject({ year: 500, month: 1, day: 1, hour: 12 }, { zone: 'Asia/Tokyo' })
    const kanshi = new Kanshi(dateTime, sekkiPair)
    const rows = generateSaiun(kanshi, dateTime, sekkiPair, NaN, 500, 509)
    expect(new Set(rows.map((_) => _.tenkan)).size).toEqual(10)
    expect(rows.map((_) => _.age)).toEqual([0, 1, 2, 3, 4, 5, 6, 7, 8, 9])
  })
})
