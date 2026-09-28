import { describe, it, expect } from 'vitest'
import { expectToBeCloseTo } from './test-util'

describe('expectToBeCloseTo', () => {
  const expected = { house: [207.908591, 235.781911], ascendant: 207.908591, rflag: 260, isRetrograde: false }

  it('誤差が許容範囲内なら一致とみなす', () => {
    const received = { house: [207.908592, 235.78191], ascendant: 207.908594, rflag: 260, isRetrograde: false }
    expectToBeCloseTo(received, expected)
  })
  it('誤差が許容範囲を超えたら、その項目名を示して失敗する', () => {
    const received = { house: [207.908591, 235.781921], ascendant: 207.908591, rflag: 260, isRetrograde: false }
    expect(() => expectToBeCloseTo(received, expected)).toThrow('received.house[1]')
  })
  it('数値以外の値が違えば失敗する', () => {
    const received = { house: [207.908591, 235.781911], ascendant: 207.908591, rflag: 260, isRetrograde: true }
    expect(() => expectToBeCloseTo(received, expected)).toThrow()
  })
  it('項目が足りなければ失敗する', () => {
    const received = { house: [207.908591, 235.781911], ascendant: 207.908591, rflag: 260 }
    expect(() => expectToBeCloseTo(received, expected)).toThrow()
  })
  it('配列の要素数が違えば失敗する', () => {
    const received = { house: [207.908591], ascendant: 207.908591, rflag: 260, isRetrograde: false }
    expect(() => expectToBeCloseTo(received, expected)).toThrow()
  })
  it('数値であるべき項目が数値でなければ失敗する', () => {
    const received = { house: [207.908591, 235.781911], ascendant: '207.908591', rflag: 260, isRetrograde: false }
    expect(() => expectToBeCloseTo(received, expected)).toThrow('received.ascendant')
  })
})
