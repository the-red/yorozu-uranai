import { DateTime } from 'luxon'
import { Kanshi } from '../../src/suimei/Kanshi'

describe('年柱を計算', () => {
  it('2022-02-24（立春後）', () => {
    const kanshi = new Kanshi(DateTime.fromISO('2022-02-24'))
    expect(kanshi.年柱).toEqual('壬寅')
  })
})

describe('月柱を計算', () => {
  it('2022-02-24（節入り後）', () => {
    const kanshi = new Kanshi(DateTime.fromISO('2022-02-24'))
    expect(kanshi.月柱).toEqual('壬寅')
  })
})

describe('日柱を計算', () => {
  it('2022-02-24（基準日より後）', () => {
    const kanshi = new Kanshi(DateTime.fromISO('2022-02-24'))
    expect(kanshi.日柱).toEqual('戊申')
  })

  it('1909-01-03（基準日より前）', () => {
    const kanshi = new Kanshi(DateTime.fromISO('1909-01-03'))
    expect(kanshi.日柱).toEqual('癸亥')
  })
})

describe('時柱を計算', () => {
  it('1909-01-04T00:00:00+09:00', () => {
    const kanshi = new Kanshi(DateTime.fromISO('1909-01-04T00:00:00+09:00'))
    expect(kanshi.時柱).toEqual('甲子')
  })
  it('1909-01-04T00:00:00+09:00', () => {
    const kanshi = new Kanshi(DateTime.fromISO('1909-01-04T17:28:00+09:00'))
    expect(kanshi.時柱).toEqual('癸酉')
  })
})
