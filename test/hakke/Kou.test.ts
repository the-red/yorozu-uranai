import { describe, it, expect } from 'vitest'
import { change爻, from爻list, get爻list, invert爻, reverse爻 } from '../../src/hakke/models/Kou'
import type { 陰陽, 爻数 } from '../../src/hakke/models/Kou'

const 爻数list: 爻数[] = [3, 6]
const allBits = (n: 爻数) => Array.from({ length: 2 ** n }, (_, bits) => bits)

describe('Kou', () => {
  describe('get爻list：初爻 → 上爻の順に並べる', () => {
    it('3本：000（乾）は、すべて陽', () => {
      expect(get爻list(0b000, 3)).toEqual(['陽', '陽', '陽'])
    })
    it('3本：111（坤）は、すべて陰', () => {
      expect(get爻list(0b111, 3)).toEqual(['陰', '陰', '陰'])
    })
    it('3本：011（震）は、下から陽・陰・陰', () => {
      expect(get爻list(0b011, 3)).toEqual(['陽', '陰', '陰'])
    })
    it('6本：000111（地天泰）は、下の3本が陽、上の3本が陰', () => {
      expect(get爻list(0b000111, 6)).toEqual(['陽', '陽', '陽', '陰', '陰', '陰'])
    })
    it('6本：011101（水雷屯）は、下から陽・陰・陰・陰・陽・陰', () => {
      expect(get爻list(0b011101, 6)).toEqual(['陽', '陰', '陰', '陰', '陽', '陰'])
    })
    it('戻り値を書き換えても、次の結果は変わらない', () => {
      get爻list(0b011, 3)[0] = '陰'
      expect(get爻list(0b011, 3)).toEqual(['陽', '陰', '陰'])
    })
  })

  describe('from爻list', () => {
    it('3本：下から陽・陰・陰は、011（震）', () => {
      expect(from爻list(['陽', '陰', '陰'])).toBe(0b011)
    })
    it('6本：下から陽・陰・陰・陰・陽・陰は、011101（水雷屯）', () => {
      expect(from爻list(['陽', '陰', '陰', '陰', '陽', '陰'])).toBe(0b011101)
    })
    it.each(爻数list)('%i本：get爻listの結果を渡すと、元の値に戻る', (n) => {
      for (const bits of allBits(n)) {
        expect(from爻list(get爻list(bits, n))).toBe(bits)
      }
    })
  })

  describe('invert爻：陰陽をすべて反転する（錯）', () => {
    it('3本：011（震）→ 100（巽）', () => {
      expect(invert爻(0b011, 3)).toBe(0b100)
    })
    it('6本：000111（地天泰）→ 111000（天地否）', () => {
      expect(invert爻(0b000111, 6)).toBe(0b111000)
    })
    it.each(爻数list)('%i本：2回行うと、元の値に戻る', (n) => {
      for (const bits of allBits(n)) {
        expect(invert爻(invert爻(bits, n), n)).toBe(bits)
      }
    })
  })

  describe('reverse爻：上下を逆にする（綜）', () => {
    it('3本：011（震）→ 110（艮）', () => {
      expect(reverse爻(0b011, 3)).toBe(0b110)
    })
    it('3本：001（兌）→ 100（巽）', () => {
      expect(reverse爻(0b001, 3)).toBe(0b100)
    })
    it('3本：010（離）は、上下を逆にしても同じ', () => {
      expect(reverse爻(0b010, 3)).toBe(0b010)
    })
    it('6本：011101（水雷屯）→ 101110（山水蒙）', () => {
      expect(reverse爻(0b011101, 6)).toBe(0b101110)
    })
    it.each(爻数list)('%i本：2回行うと、元の値に戻る', (n) => {
      for (const bits of allBits(n)) {
        expect(reverse爻(reverse爻(bits, n), n)).toBe(bits)
      }
    })
  })

  describe('change爻：指定した爻を反転する（変爻）', () => {
    it('3本：011（震）の初爻 → 111（坤）', () => {
      expect(change爻(0b011, 3, 1)).toBe(0b111)
    })
    it('3本：011（震）の上爻 → 010（離）', () => {
      expect(change爻(0b011, 3, 3)).toBe(0b010)
    })
    it('6本：000111（地天泰）の初爻 → 100111（地風升）', () => {
      expect(change爻(0b000111, 6, 1)).toBe(0b100111)
    })
    it('6本：000111（地天泰）の上爻 → 000110（山天大畜）', () => {
      expect(change爻(0b000111, 6, 6)).toBe(0b000110)
    })
  })

  describe('範囲外の値はRangeError', () => {
    it.each([-1, 8, 1.5, NaN, Infinity])('3本：ビット列が %s', (bits) => {
      expect(() => get爻list(bits, 3)).toThrow(RangeError)
      expect(() => invert爻(bits, 3)).toThrow(RangeError)
      expect(() => reverse爻(bits, 3)).toThrow(RangeError)
      expect(() => change爻(bits, 3, 1)).toThrow(RangeError)
    })
    it('6本：ビット列が 64', () => {
      expect(() => get爻list(64, 6)).toThrow(RangeError)
    })
    it('6本なら、ビット列が 8 でも通る', () => {
      expect(get爻list(8, 6)).toEqual(['陽', '陽', '陰', '陽', '陽', '陽'])
    })
    it.each([0, 4, -1, 1.5, NaN])('3本：位置が %s', (位置) => {
      expect(() => change爻(0b011, 3, 位置)).toThrow(RangeError)
    })
    it.each([0, 7])('6本：位置が %s', (位置) => {
      expect(() => change爻(0b000111, 6, 位置)).toThrow(RangeError)
    })
    it.each([0, 1, 2, 4, 5, 7])('爻数が %s', (n) => {
      expect(() => get爻list(0, n as 爻数)).toThrow(RangeError)
      expect(() => from爻list(Array.from({ length: n }, (): 陰陽 => '陽'))).toThrow(RangeError)
    })
    it('爻の配列に、陰陽以外の要素がある', () => {
      expect(() => from爻list(['陽', '陰', '中'] as unknown as 陰陽[])).toThrow(RangeError)
    })
  })
})
