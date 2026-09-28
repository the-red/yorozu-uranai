import type { 五行 } from '../../suimei/models/Kanshi'
import { assertIntegerInRange } from './assert'
import { change爻 as changeBits, get爻list, invert爻, reverse爻 } from './Kou'
import type { 陰陽 } from './Kou'

// 並び順は先天八卦（伏羲）の順。indexがそのまま3ビットの値になる（ビット列の決まりは Kou.ts を参照）
export const 八卦list = ['乾', '兌', '離', '震', '巽', '坎', '艮', '坤'] as const
export const 象list = ['天', '沢', '火', '雷', '風', '水', '山', '地'] as const // 八卦listと同じ順
export const 記号list = ['☰', '☱', '☲', '☳', '☴', '☵', '☶', '☷'] as const // 八卦listと同じ順。Unicodeでも U+2630 からこの順に並ぶ
export const 方位list = ['北', '北東', '東', '南東', '南', '南西', '西', '北西'] as const // 北から時計回り

export type 八卦 = (typeof 八卦list)[number]
export type 象 = (typeof 象list)[number]
export type 記号 = (typeof 記号list)[number]
export type 方位 = (typeof 方位list)[number]
export type 九星数 = 1 | 2 | 3 | 4 | 6 | 7 | 8 | 9 // 5（中宮）には卦が無い

const 爻数 = 3

const 読みtable: Record<八卦, string> = {
  乾: 'けん',
  兌: 'だ',
  離: 'り',
  震: 'しん',
  巽: 'そん',
  坎: 'かん',
  艮: 'ごん',
  坤: 'こん',
}

// 後天八卦の配置。ビット列からは計算できないので、表で持つ
const 後天table: Record<八卦, { 方位: 方位; 九星数: 九星数; 五行: 五行 }> = {
  乾: { 方位: '北西', 九星数: 6, 五行: '金' },
  兌: { 方位: '西', 九星数: 7, 五行: '金' },
  離: { 方位: '南', 九星数: 9, 五行: '火' },
  震: { 方位: '東', 九星数: 3, 五行: '木' },
  巽: { 方位: '南東', 九星数: 4, 五行: '木' },
  坎: { 方位: '北', 九星数: 1, 五行: '水' },
  艮: { 方位: '北東', 九星数: 8, 五行: '土' },
  坤: { 方位: '南西', 九星数: 2, 五行: '土' },
}

export const toBits = (卦: 八卦): number => {
  const bits = 八卦list.indexOf(卦)
  if (bits < 0) {
    throw new RangeError(`八卦ではありません: ${卦}`)
  }
  return bits
}

export const fromBits = (bits: number): 八卦 => {
  assertIntegerInRange('ビット列', bits, 0, 八卦list.length - 1)
  return 八卦list[bits]
}

// 型の外の値（JSONやURLクエリから来たもの）を、表を引く前に弾く
const validate = (卦: 八卦): 八卦 => fromBits(toBits(卦))

export const get読み = (卦: 八卦): string => 読みtable[validate(卦)]
export const get象 = (卦: 八卦): 象 => 象list[toBits(卦)]
export const get記号 = (卦: 八卦): 記号 => 記号list[toBits(卦)]

// 初爻 → 上爻の順
export const get爻 = (卦: 八卦): 陰陽[] => get爻list(toBits(卦), 爻数)
export const get先天数 = (卦: 八卦): number => toBits(卦) + 1

// 錯卦：陰陽をすべて反転した卦
export const get錯卦 = (卦: 八卦): 八卦 => fromBits(invert爻(toBits(卦), 爻数))
// 綜卦：上下を逆にした卦
export const get綜卦 = (卦: 八卦): 八卦 => fromBits(reverse爻(toBits(卦), 爻数))
// 下から数えた位置（1始まり）の爻を反転した卦
export const change爻 = (卦: 八卦, 位置: number): 八卦 => fromBits(changeBits(toBits(卦), 爻数, 位置))

const get後天 = (卦: 八卦) => 後天table[validate(卦)]

export const get方位 = (卦: 八卦): 方位 => get後天(卦).方位
export const get九星数 = (卦: 八卦): 九星数 => get後天(卦).九星数
export const get五行 = (卦: 八卦): 五行 => get後天(卦).五行

export const from九星数 = (n: number): 八卦 | undefined => {
  assertIntegerInRange('九星の数', n, 1, 9)
  return 八卦list.find((卦) => 後天table[卦].九星数 === n)
}
