import { sekkiIndex, sekki } from '../../src/suimei/models/Sekki'
import { longitudeToDate, daysToNextSekki } from '../../src/suimei/models/SekkiUtil'
import { getEclipticLongitude } from '../../src/astronomy'

describe('二十四節気', () => {
  it('315', () => {
    expect(sekkiIndex(315)).toEqual(0)
    expect(sekki(315)).toEqual('立春')
  })
  it('315.5', () => {
    expect(sekkiIndex(315.5)).toEqual(0)
  })
  it('345', () => {
    expect(sekkiIndex(345)).toEqual(1)
    expect(sekki(345)).toEqual('啓蟄')
  })
  it('314.99', () => {
    expect(sekkiIndex(314.99)).toEqual(11)
    expect(sekki(314.99)).toEqual('小寒')
  })
})

describe('日時→節気 変換', () => {
  it('小寒の最終日時分秒', async () => {
    expect(sekki(await getEclipticLongitude(new Date('2022-02-04T05:50:45+09:00')))).toEqual('小寒')
  })
  it('立春の開始日時分秒', async () => {
    expect(sekki(await getEclipticLongitude(new Date('2022-02-04T05:50:46+09:00')))).toEqual('立春')
  })

  it('立冬の最終日時分秒', async () => {
    expect(sekki(await getEclipticLongitude(new Date('2018-12-07T13:25:54+09:00')))).toEqual('立冬')
  })
  it('大雪の開始日時分秒', async () => {
    expect(sekki(await getEclipticLongitude(new Date('2018-12-07T13:25:55+09:00')))).toEqual('大雪')
  })
})

describe('節入りまでの日数（日のみ）', () => {
  it('順行: 立春→30日→啓蟄', async () => {
    const days = await daysToNextSekki(new Date('2023-02-04T12:00:00+09:00'))
    expect(days).toBe(30)
  })
  it('順行: 小暑→32日→立秋', async () => {
    const days = await daysToNextSekki(new Date('2023-07-07T20:00:00+09:00'))
    expect(days).toBe(32)
  })
  it('順行: 小寒→1日→立春', async () => {
    const days = await daysToNextSekki(new Date('2023-02-03T12:00:00+09:00'))
    expect(days).toBe(1)
  })

  it('逆行: 啓蟄→30日→立春', async () => {
    const days = await daysToNextSekki(new Date('2023-03-05T12:00:00+09:00'), false)
    expect(days).toBe(30)
  })
  it('逆行: 立秋→32日→小暑', async () => {
    const days = await daysToNextSekki(new Date('2023-08-07T20:00:00+09:00'), false)
    expect(days).toBe(32)
  })
  it('逆行: 立春→1日→小寒', async () => {
    const days = await daysToNextSekki(new Date('2023-02-04T12:00:00+09:00'), false)
    expect(days).toBe(1)
  })
})

describe('黄経から日付を算出', () => {
  it('順行: 3日後に立春', async () => {
    const res = await longitudeToDate(315, new Date('2022-02-01T05:00:48+09:00'), true)
    expect(res).toMatchObject(new Date('2022-02-04T05:50:46+09:00'))
  }, 100_000)
  it('逆行: 1日前に立春', async () => {
    const res = await longitudeToDate(315, new Date('2022-02-05T05:50:46+09:00'), false)
    expect(res).toMatchObject(new Date('2022-02-04T05:50:46+09:00'))
  }, 100_000)
  it('順行: 4か月後に立春', async () => {
    const res = await longitudeToDate(315, new Date('2021-10-05T05:50:46+09:00'), true)
    expect(res).toMatchObject(new Date('2022-02-04T05:50:46+09:00'))
  }, 100_000)
  it('逆行: 4か月前に立春', async () => {
    const res = await longitudeToDate(315, new Date('2022-08-05T05:50:46+09:00'), false)
    expect(res).toMatchObject(new Date('2022-02-04T05:50:46+09:00'))
  }, 100_000)
  it('順行: 1年後に立春', async () => {
    const res = await longitudeToDate(315, new Date('2021-02-03T23:58:47+09:00'), true)
    expect(res).toMatchObject(new Date('2022-02-04T05:50:46+09:00'))
  }, 100_000)
})
