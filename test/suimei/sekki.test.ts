import { sekkiIndex, sekki } from '../../src/suimei/sekki'

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
