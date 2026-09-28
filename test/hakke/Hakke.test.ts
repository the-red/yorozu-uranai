import { describe, it, expect } from 'vitest'
import {
  change爻,
  from九星数,
  fromBits,
  get九星数,
  get五行,
  get先天数,
  get方位,
  get爻,
  get綜卦,
  get記号,
  get読み,
  get象,
  get錯卦,
  toBits,
  八卦list,
  方位list,
} from '../../src/hakke/models/Hakke'
import type { 九星数, 八卦, 方位, 象 } from '../../src/hakke/models/Hakke'
import type { 陰陽 } from '../../src/hakke/models/Kou'
import type { 五行 } from '../../src/suimei/models/Kanshi'

type Row = {
  卦: 八卦
  読み: string
  象: 象
  記号: string
  bits: number
  先天数: number
  爻: 陰陽[]
  錯卦: 八卦
  綜卦: 八卦
  方位: 方位
  九星数: 九星数
  五行: 五行
}

// prettier-ignore
const table: Row[] = [
  { 卦: '乾', 読み: 'けん', 象: '天', 記号: '☰', bits: 0b000, 先天数: 1, 爻: ['陽', '陽', '陽'], 錯卦: '坤', 綜卦: '乾', 方位: '北西', 九星数: 6, 五行: '金' },
  { 卦: '兌', 読み: 'だ', 象: '沢', 記号: '☱', bits: 0b001, 先天数: 2, 爻: ['陽', '陽', '陰'], 錯卦: '艮', 綜卦: '巽', 方位: '西', 九星数: 7, 五行: '金' },
  { 卦: '離', 読み: 'り', 象: '火', 記号: '☲', bits: 0b010, 先天数: 3, 爻: ['陽', '陰', '陽'], 錯卦: '坎', 綜卦: '離', 方位: '南', 九星数: 9, 五行: '火' },
  { 卦: '震', 読み: 'しん', 象: '雷', 記号: '☳', bits: 0b011, 先天数: 4, 爻: ['陽', '陰', '陰'], 錯卦: '巽', 綜卦: '艮', 方位: '東', 九星数: 3, 五行: '木' },
  { 卦: '巽', 読み: 'そん', 象: '風', 記号: '☴', bits: 0b100, 先天数: 5, 爻: ['陰', '陽', '陽'], 錯卦: '震', 綜卦: '兌', 方位: '南東', 九星数: 4, 五行: '木' },
  { 卦: '坎', 読み: 'かん', 象: '水', 記号: '☵', bits: 0b101, 先天数: 6, 爻: ['陰', '陽', '陰'], 錯卦: '離', 綜卦: '坎', 方位: '北', 九星数: 1, 五行: '水' },
  { 卦: '艮', 読み: 'ごん', 象: '山', 記号: '☶', bits: 0b110, 先天数: 7, 爻: ['陰', '陰', '陽'], 錯卦: '兌', 綜卦: '震', 方位: '北東', 九星数: 8, 五行: '土' },
  { 卦: '坤', 読み: 'こん', 象: '地', 記号: '☷', bits: 0b111, 先天数: 8, 爻: ['陰', '陰', '陰'], 錯卦: '乾', 綜卦: '坤', 方位: '南西', 九星数: 2, 五行: '土' },
]

describe('Hakke', () => {
  it('八卦listは、先天八卦の順に並ぶ', () => {
    expect(八卦list).toEqual(['乾', '兌', '離', '震', '巽', '坎', '艮', '坤'])
    expect(table.map(({ 卦 }) => 卦)).toEqual(八卦list)
  })
  it('記号は、UnicodeのU+2630から先天八卦の順に並ぶ', () => {
    expect(八卦list.map((卦) => get記号(卦).codePointAt(0))).toEqual(八卦list.map((卦) => 0x2630 + toBits(卦)))
  })

  describe.each(table)('$卦（$象）', (row) => {
    const { 卦 } = row

    it(`読み：${row.読み}`, () => {
      expect(get読み(卦)).toBe(row.読み)
    })
    it(`象：${row.象}`, () => {
      expect(get象(卦)).toBe(row.象)
    })
    it(`記号：${row.記号}`, () => {
      expect(get記号(卦)).toBe(row.記号)
    })
    it(`3ビット：${row.bits.toString(2).padStart(3, '0')}`, () => {
      expect(toBits(卦)).toBe(row.bits)
      expect(fromBits(row.bits)).toBe(卦)
    })
    it(`爻：下から${row.爻.join('・')}`, () => {
      expect(get爻(卦)).toEqual(row.爻)
    })
    it(`先天数：${row.先天数}`, () => {
      expect(get先天数(卦)).toBe(row.先天数)
    })
    it(`錯卦：${row.錯卦}`, () => {
      expect(get錯卦(卦)).toBe(row.錯卦)
    })
    it(`綜卦：${row.綜卦}`, () => {
      expect(get綜卦(卦)).toBe(row.綜卦)
    })
    it(`方位：${row.方位}`, () => {
      expect(get方位(卦)).toBe(row.方位)
    })
    it(`九星の数：${row.九星数}`, () => {
      expect(get九星数(卦)).toBe(row.九星数)
      expect(from九星数(row.九星数)).toBe(卦)
    })
    it(`五行：${row.五行}`, () => {
      expect(get五行(卦)).toBe(row.五行)
    })
  })

  describe('get爻', () => {
    it('戻り値を書き換えても、次の結果は変わらない', () => {
      get爻('震')[0] = '陰'
      expect(get爻('震')).toEqual(['陽', '陰', '陰'])
    })
  })

  describe('change爻：指定した爻を反転する', () => {
    it('震の初爻 → 坤', () => {
      expect(change爻('震', 1)).toBe('坤')
    })
    it('震の二爻 → 兌', () => {
      expect(change爻('震', 2)).toBe('兌')
    })
    it('震の上爻 → 離', () => {
      expect(change爻('震', 3)).toBe('離')
    })
    it('乾の初爻 → 巽', () => {
      expect(change爻('乾', 1)).toBe('巽')
    })
    it.each(八卦list)('%s：同じ爻を2回反転すると、元の卦に戻る', (卦) => {
      for (const 位置 of [1, 2, 3]) {
        expect(change爻(change爻(卦, 位置), 位置)).toBe(卦)
      }
    })
  })

  describe('後天八卦', () => {
    it('方位は、8つの卦で重複しない', () => {
      expect(八卦list.map(get方位).sort()).toEqual([...方位list].sort())
    })
    it('九星の数は、5を除く1〜9が1つずつ', () => {
      expect(八卦list.map(get九星数).sort()).toEqual([1, 2, 3, 4, 6, 7, 8, 9])
    })
    it('5（中宮）には卦が無い', () => {
      expect(from九星数(5)).toBeUndefined()
    })
    it.each(八卦list)('%s：向かい合う方位の卦とは、九星の数の和が10になる', (卦) => {
      const 向かいの方位 = 方位list[(方位list.indexOf(get方位(卦)) + 4) % 方位list.length]
      const 向かいの卦 = 八卦list.find((other) => get方位(other) === 向かいの方位)

      expect(向かいの卦).toBeDefined()
      expect(get九星数(卦) + get九星数(向かいの卦 as 八卦)).toBe(10)
    })
  })

  describe('範囲外の値はRangeError', () => {
    it.each([-1, 8, 1.5, NaN, Infinity])('fromBits：%s', (bits) => {
      expect(() => fromBits(bits)).toThrow(RangeError)
    })
    it.each([0, 10, -1, 1.5, NaN, Infinity])('from九星数：%s', (n) => {
      expect(() => from九星数(n)).toThrow(RangeError)
    })
    it.each([0, 4, 1.5, NaN])('change爻：位置が %s', (位置) => {
      expect(() => change爻('震', 位置)).toThrow(RangeError)
    })
    it.each(['天', '乾 ', '', '000'])('八卦でない文字列：「%s」', (value) => {
      const 卦 = value as 八卦

      expect(() => toBits(卦)).toThrow(RangeError)
      expect(() => get読み(卦)).toThrow(RangeError)
      expect(() => get象(卦)).toThrow(RangeError)
      expect(() => get記号(卦)).toThrow(RangeError)
      expect(() => get爻(卦)).toThrow(RangeError)
      expect(() => get先天数(卦)).toThrow(RangeError)
      expect(() => get錯卦(卦)).toThrow(RangeError)
      expect(() => get綜卦(卦)).toThrow(RangeError)
      expect(() => change爻(卦, 1)).toThrow(RangeError)
      expect(() => get方位(卦)).toThrow(RangeError)
      expect(() => get九星数(卦)).toThrow(RangeError)
      expect(() => get五行(卦)).toThrow(RangeError)
    })
  })
})
