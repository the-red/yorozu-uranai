import { describe, it, expect } from 'vitest'
import { DateTime } from 'luxon'
import { SuimeiRaw, restoreKanshi, toDaiun, toSuimeiResult } from '../../src/suimei/models'
import type { Daiun } from '../../src/suimei/models/Daiun'
import { generateSaiun } from '../../src/suimei/models/Saiun'
import { NUM_DIGITS } from '../test-util'

// 1987-09-08 08:53 札幌生まれ。白露の前なので、月柱は戊申
const dateTime = DateTime.fromISO('1987-09-08T08:53:00', { zone: 'Asia/Tokyo' })
const lng = 141.35
const raw: SuimeiRaw = { sekkiPair: { today: '立秋', endOfMonth: '白露' }, equationOfTime: 2.05 }

const daiun: Daiun[] = [
  {
    fromAge: 0,
    toAge: 10,
    thisYear: false,
    kanshi: '戊申',
    tenkan: '戊',
    tishi: '申',
    tenkanTsuhensei: '偏印',
    zoukan: '庚',
    zoukanTsuhensei: '比肩',
    juuniun: '建禄',
  },
  {
    fromAge: 11,
    toAge: 20,
    thisYear: true,
    kanshi: '己酉',
    tenkan: '己',
    tishi: '酉',
    tenkanTsuhensei: '印綬',
    zoukan: '辛',
    zoukanTsuhensei: '劫財',
    juuniun: '帝旺',
  },
]

const convert = (hasThisYear: boolean) => {
  const { solarTime, kanshi } = restoreKanshi(dateTime, lng, raw)
  const thisYear = hasThisYear ? 2026 : NaN
  const saiun = generateSaiun(kanshi, dateTime, raw.sekkiPair, thisYear, 2025, 2027)
  return toSuimeiResult({ sekkiPair: raw.sekkiPair, solarTime, kanshi, daiun, saiun, hasThisYear })
}

describe('材料 → 干支', () => {
  it('日柱と時柱は、真太陽時で決まる', () => {
    // 札幌で 23:50 生まれ。真太陽時では翌日の 00:17 なので、日柱は庚申ではなく辛酉
    const late = DateTime.fromISO('1987-09-08T23:50:00', { zone: 'Asia/Tokyo' })
    const { solarTime, kanshi } = restoreKanshi(late, lng, raw)
    expect(solarTime.dateTime.toFormat('yyyy-MM-dd HH:mm')).toEqual('1987-09-09 00:17')
    expect(kanshi.日柱).toEqual('辛酉')
    expect(kanshi.月柱).toEqual('戊申')
  })
})

describe('四柱推命 → JSON', () => {
  const result = convert(true)

  it('節', () => {
    expect(result.節).toEqual('立秋')
  })

  it('真太陽時', () => {
    expect(result.真太陽時.dateTime).toEqual('1987-09-08T09:20')
    expect(result.真太陽時.地方時差).toBeCloseTo(25.4, NUM_DIGITS)
    expect(result.真太陽時.均時差).toBeCloseTo(2.05, NUM_DIGITS)
  })

  it('命式', () => {
    expect(result.命式).toEqual({
      年柱: {
        干支: '丁卯',
        天干: '丁',
        地支: '卯',
        通変星: '正官',
        蔵干: { 本気: '乙', 中気: null, 余気: '甲' },
        蔵干通変星: { 本気: '正財', 中気: null, 余気: '偏財' },
        十二運: '胎',
        特殊星: ['飛刃', '月徳合'],
      },
      月柱: {
        干支: '戊申',
        天干: '戊',
        地支: '申',
        通変星: '偏印',
        蔵干: { 本気: '庚', 中気: '壬', 余気: '戊' },
        蔵干通変星: { 本気: '比肩', 中気: '食神', 余気: '偏印' },
        十二運: '建禄',
        特殊星: ['十干禄', '天徳合', '劫殺'],
      },
      日柱: {
        干支: '庚申',
        天干: '庚',
        地支: '申',
        通変星: null,
        蔵干: { 本気: '庚', 中気: '壬', 余気: '戊' },
        蔵干通変星: { 本気: '比肩', 中気: '食神', 余気: '偏印' },
        十二運: '建禄',
        特殊星: ['十干禄', '劫殺'],
      },
      時柱: {
        干支: '辛巳',
        天干: '辛',
        地支: '巳',
        通変星: '劫財',
        蔵干: { 本気: '丙', 中気: '庚', 余気: '戊' },
        蔵干通変星: { 本気: '偏官', 中気: '比肩', 余気: '偏印' },
        十二運: '長生',
        特殊星: ['暗禄', '駅馬', '劫殺', '孤辰'],
      },
    })
  })

  it('五行', () => {
    expect(result.五行).toEqual({ 木: 1, 火: 2, 土: 1, 金: 4, 水: 0 })
  })

  it('大運', () => {
    expect(result.大運).toEqual([
      {
        fromAge: 0,
        toAge: 10,
        current: false,
        干支: '戊申',
        天干: '戊',
        地支: '申',
        通変星: '偏印',
        蔵干: '庚',
        蔵干通変星: '比肩',
        十二運: '建禄',
      },
      {
        fromAge: 11,
        toAge: 20,
        current: true,
        干支: '己酉',
        天干: '己',
        地支: '酉',
        通変星: '印綬',
        蔵干: '辛',
        蔵干通変星: '劫財',
        十二運: '帝旺',
      },
    ])
  })

  it('歳運', () => {
    expect(result.歳運).toEqual([
      {
        year: 2025,
        age: 38,
        current: false,
        干支: '乙巳',
        天干: '乙',
        地支: '巳',
        通変星: '正財',
        蔵干: '丙',
        蔵干通変星: '偏官',
        十二運: '長生',
      },
      {
        year: 2026,
        age: 39,
        current: true,
        干支: '丙午',
        天干: '丙',
        地支: '午',
        通変星: '偏官',
        蔵干: '丁',
        蔵干通変星: '正官',
        十二運: '沐浴',
      },
      {
        year: 2027,
        age: 40,
        current: false,
        干支: '丁未',
        天干: '丁',
        地支: '未',
        通変星: '正官',
        蔵干: '己',
        蔵干通変星: '印綬',
        十二運: '冠帯',
      },
    ])
  })

  it('JSONにしても値が変わらない', () => {
    expect(JSON.parse(JSON.stringify(result))).toEqual(result)
  })

  describe('現在の年が分からないとき', () => {
    const result = convert(false)

    it('current を付けない', () => {
      expect(result.大運.map((_) => 'current' in _)).toEqual([false, false])
      expect(result.歳運.map((_) => 'current' in _)).toEqual([false, false, false])
    })
    it('ほかの項目は変わらない', () => {
      expect(result.大運[1]).toEqual({
        fromAge: 11,
        toAge: 20,
        干支: '己酉',
        天干: '己',
        地支: '酉',
        通変星: '印綬',
        蔵干: '辛',
        蔵干通変星: '劫財',
        十二運: '帝旺',
      })
      expect(result.命式).toEqual(convert(true).命式)
    })
  })
})

describe('JSONの大運 → 画面の大運', () => {
  it('元の大運に戻る', () => {
    expect(convert(true).大運.map(toDaiun)).toEqual(daiun)
  })
  it('current が無ければ、現在の行ではない', () => {
    expect(
      convert(false)
        .大運.map(toDaiun)
        .map((_) => _.thisYear)
    ).toEqual([false, false])
  })
  it('JSONを経由しても同じ', () => {
    const json = JSON.parse(JSON.stringify(convert(true)))
    expect(json.大運.map(toDaiun)).toEqual(daiun)
  })
})
