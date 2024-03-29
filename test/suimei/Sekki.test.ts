import { sekkiIndex, sekki } from '../../src/suimei/models/Sekki'
import { getSetsuIri } from '../../src/suimei/models/SekkiUtil'
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

describe('節入り日', () => {
  it('順行: 立春→啓蟄', async () => {
    const days = await getSetsuIri(new Date('2023-02-04T12:00:00+09:00'), true)
    expect(days).toMatchObject({ sekki: '啓蟄', date: new Date('2023-03-06T05:36:12+09:00') })
  })
  it('順行: 小暑→立秋', async () => {
    const days = await getSetsuIri(new Date('2023-07-07T20:00:00+09:00'), true)
    expect(days).toMatchObject({ sekki: '立秋', date: new Date('2023-08-08T03:22:51+09:00') })
  })
  it('順行: 小寒→立春', async () => {
    const days = await getSetsuIri(new Date('2023-02-03T12:00:00+09:00'), true)
    expect(days).toMatchObject({ sekki: '立春', date: new Date('2023-02-04T11:42:31+09:00') })
  })

  it('逆行: 立春', async () => {
    const days = await getSetsuIri(new Date('2023-03-05T12:00:00+09:00'), false)
    expect(days).toMatchObject({ sekki: '立春', date: new Date('2023-02-04T11:42:32+09:00') })
  })
  it('逆行: 小暑', async () => {
    const days = await getSetsuIri(new Date('2023-08-07T20:00:00+09:00'), false)
    expect(days).toMatchObject({ sekki: '小暑', date: new Date('2023-07-07T17:30:41+09:00') })
  })
  it('逆行: 啓蟄', async () => {
    const days = await getSetsuIri(new Date('2023-03-10T17:36:00+09:00'), false)
    expect(days).toMatchObject({ sekki: '啓蟄', date: new Date('2023-03-06T05:36:13+09:00') })
  })
})
