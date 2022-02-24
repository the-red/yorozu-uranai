import { getIndex } from '../../src/suimei/sekki'

describe('二十四節気', () => {
  it('315', () => {
    expect(getIndex(315)).toEqual(0)
  })
  it('315.5', () => {
    expect(getIndex(315.5)).toEqual(0)
  })
  it('345', () => {
    expect(getIndex(345)).toEqual(1)
  })
  it('314.99', () => {
    expect(getIndex(314.99)).toEqual(11)
  })
})
