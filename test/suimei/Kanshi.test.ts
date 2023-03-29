import { Kanshi } from '../../src/suimei/Kanshi'
import { getKanshiInstance } from './test-util'

describe('六十干支', () => {
  it('六十干支', () => {
    expect(Kanshi.六十干支).toEqual([
      '甲子', // 0
      '乙丑', // 1
      '丙寅', // 2
      '丁卯', // 3
      '戊辰', // 4
      '己巳', // 5
      '庚午', // 6
      '辛未', // 7
      '壬申', // 8
      '癸酉', // 9
      '甲戌', // 10
      '乙亥', // 11
      '丙子', // 12
      '丁丑', // 13
      '戊寅', // 14
      '己卯', // 15
      '庚辰', // 16
      '辛巳', // 17
      '壬午', // 18
      '癸未', // 19
      '甲申', // 20
      '乙酉', // 21
      '丙戌', // 22
      '丁亥', // 23
      '戊子', // 24
      '己丑', // 25
      '庚寅', // 26
      '辛卯', // 27
      '壬辰', // 28
      '癸巳', // 29
      '甲午', // 30
      '乙未', // 31
      '丙申', // 32
      '丁酉', // 33
      '戊戌', // 34
      '己亥', // 35
      '庚子', // 36
      '辛丑', // 37
      '壬寅', // 38
      '癸卯', // 39
      '甲辰', // 40
      '乙巳', // 41
      '丙午', // 42
      '丁未', // 43
      '戊申', // 44
      '己酉', // 45
      '庚戌', // 46
      '辛亥', // 47
      '壬子', // 48
      '癸丑', // 49
      '甲寅', // 50
      '乙卯', // 51
      '丙辰', // 52
      '丁巳', // 53
      '戊午', // 54
      '己未', // 55
      '庚申', // 56
      '辛酉', // 57
      '壬戌', // 58
      '癸亥', // 59
    ])
  })
})

describe('年柱を計算', () => {
  it('2022-02-24（立春後）', async () => {
    const kanshi = await getKanshiInstance(new Date('2022-02-24T00:00:00+09:00'))
    expect(kanshi.年柱).toEqual('壬寅')
  })
  it('2022-01-01（立春前）', async () => {
    const kanshi = await getKanshiInstance(new Date('2022-01-01T00:00:00+09:00'))
    expect(kanshi.年柱).toEqual('辛丑')
  })
})

describe('月柱を計算', () => {
  it('2018-12-07 13:25:54（節入り前・基準日前）', async () => {
    const kanshi = await getKanshiInstance(new Date('2018-12-07T13:25:54+09:00'))
    expect(kanshi.月柱).toEqual('癸亥')
  })
  it('2018-12-07 13:25:55（節入り後・基準日前）', async () => {
    const kanshi = await getKanshiInstance(new Date('2018-12-07T13:25:55+09:00'))
    expect(kanshi.月柱).toEqual('甲子')
  })

  it('2019-01-01 00:00（基準日ちょうど）', async () => {
    const kanshi = await getKanshiInstance(new Date('2019-01-01T00:00:00+09:00'))
    expect(kanshi.月柱).toEqual('甲子')
  })

  it('2022-02-04 05:50（節入り前・基準日後）', async () => {
    const kanshi = await getKanshiInstance(new Date('2022-02-04T05:50:00+09:00'))
    expect(kanshi.月柱).toEqual('辛丑')
  })
  it('2022-02-04 05:51（節入り後・基準日後）', async () => {
    const kanshi = await getKanshiInstance(new Date('2022-02-04T05:51:00+09:00'))
    expect(kanshi.月柱).toEqual('壬寅')
  })
})

describe('日柱を計算', () => {
  it('2022-02-24（基準日より後）', async () => {
    const kanshi = await getKanshiInstance(new Date('2022-02-24T00:00:00+09:00'))
    expect(kanshi.日柱).toEqual('戊申')
  })

  it('1909-01-03（基準日より前）', async () => {
    const kanshi = await getKanshiInstance(new Date('1909-01-03T00:00:00+09:00'))
    expect(kanshi.日柱).toEqual('癸亥')
  })
})

describe('時柱を計算', () => {
  it('1909-01-04T00:00:00+09:00', async () => {
    const kanshi = await getKanshiInstance(new Date('1909-01-04T00:00:00+09:00'))
    expect(kanshi.時柱).toEqual('甲子') // 0
  })
  it('1909-01-04T01:00:00+09:00', async () => {
    const kanshi = await getKanshiInstance(new Date('1909-01-04T01:00:00+09:00'))
    expect(kanshi.時柱).toEqual('乙丑') // 1
  })
  it('1909-01-04T02:00:00+09:00', async () => {
    const kanshi = await getKanshiInstance(new Date('1909-01-04T02:00:00+09:00'))
    expect(kanshi.時柱).toEqual('乙丑') // 1
  })
  it('1909-01-04T22:00:00+09:00', async () => {
    const kanshi = await getKanshiInstance(new Date('1909-01-04T22:00:00+09:00'))
    expect(kanshi.時柱).toEqual('乙亥') // 11
  })
  it('1909-01-04T22:59:59+09:00', async () => {
    const kanshi = await getKanshiInstance(new Date('1909-01-04T22:59:59+09:00'))
    expect(kanshi.時柱).toEqual('乙亥') // 11
  })
  it('1909-01-04T23:00:00+09:00', async () => {
    const kanshi = await getKanshiInstance(new Date('1909-01-04T23:00:00+09:00'))
    expect(kanshi.時柱).toEqual('甲子') // 0
  })
  it('1909-01-05T00:00:00+09:00', async () => {
    const kanshi = await getKanshiInstance(new Date('1909-01-05T00:00:00+09:00'))
    expect(kanshi.時柱).toEqual('丙子') // 12
  })
  it('2022-02-24T17:28:00+09:00', async () => {
    const kanshi = await getKanshiInstance(new Date('2022-02-24T17:28:00+09:00'))
    expect(kanshi.時柱).toEqual('辛酉') // 57
  })
  it('2023-03-15T11:41:20+09:00（60を超えるパターン）', async () => {
    const kanshi = await getKanshiInstance(new Date('2023-03-15T11:41:20+09:00'))
    expect(kanshi.時柱).toEqual('丙午') // 42 (102 % 60)
  })
})

describe('天干の個別取得', () => {
  const date = new Date('2023-03-15T11:41:20+09:00')
  it('年干', async () => {
    const kanshi = await getKanshiInstance(date)
    expect(kanshi.年干).toEqual('癸')
  })
  it('月干', async () => {
    const kanshi = await getKanshiInstance(date)
    expect(kanshi.月干).toEqual('乙')
  })
  it('日干', async () => {
    const kanshi = await getKanshiInstance(date)
    expect(kanshi.日干).toEqual('壬')
  })
  it('時干', async () => {
    const kanshi = await getKanshiInstance(date)
    expect(kanshi.時干).toEqual('丙')
  })
  it('天干', async () => {
    const kanshi = await getKanshiInstance(date)
    expect(kanshi.天干).toMatchObject(['癸', '乙', '壬', '丙'])
  })
})

describe('地支の個別取得', () => {
  const date = new Date('2023-03-15T11:41:20+09:00')
  it('年支', async () => {
    const kanshi = await getKanshiInstance(date)
    expect(kanshi.年支).toEqual('卯')
  })
  it('月支', async () => {
    const kanshi = await getKanshiInstance(date)
    expect(kanshi.月支).toEqual('卯')
  })
  it('日支', async () => {
    const kanshi = await getKanshiInstance(date)
    expect(kanshi.日支).toEqual('申')
  })
  it('時支', async () => {
    const kanshi = await getKanshiInstance(date)
    expect(kanshi.時支).toEqual('午')
  })
  it('地支', async () => {
    const kanshi = await getKanshiInstance(date)
    expect(kanshi.地支).toMatchObject(['卯', '卯', '申', '午'])
  })
})
