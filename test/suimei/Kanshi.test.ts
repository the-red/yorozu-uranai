import { DateTime } from 'luxon'
import { Kanshi } from '../../src/suimei/Kanshi'
import { getSekkiPair } from '../../src/suimei/kanshiFactory'

const getKanshiInstance = async (date: Date) => {
  const sekkiPair = await getSekkiPair(date)
  return new Kanshi(DateTime.fromJSDate(date), sekkiPair)
}

describe('六十干支', () => {
  it('六十干支', () => {
    expect(Kanshi.六十干支).toEqual([
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
})
