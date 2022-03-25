import { sekkiIndex, sekki } from '../../src/suimei/Sekki'
import { getLongitude } from '../../src/horoscope/swisseph'

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
    expect(sekki(await getLongitude(new Date('2022-02-04T05:50:45+09:00')))).toEqual('小寒')
  })
  it('立春の開始日時分秒', async () => {
    expect(sekki(await getLongitude(new Date('2022-02-04T05:50:46+09:00')))).toEqual('立春')
  })

  it('立冬の最終日時分秒', async () => {
    expect(sekki(await getLongitude(new Date('2018-12-07T13:25:54+09:00')))).toEqual('立冬')
  })
  it('大雪の開始日時分秒', async () => {
    expect(sekki(await getLongitude(new Date('2018-12-07T13:25:55+09:00')))).toEqual('大雪')
  })
})
