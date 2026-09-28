import { assertIntegerInRange } from './assert'

// ビット列の決まり
// - 陽 = 0、陰 = 1
// - 上位ビットが初爻（一番下の線）。011 は、下から陽・陰・陰

export type 陰陽 = '陽' | '陰'
export type 爻数 = 3 | 6

const assert爻数 = (爻数: number): void => {
  if (爻数 !== 3 && 爻数 !== 6) {
    throw new RangeError(`爻数は 3 か 6 で指定してください: ${爻数}`)
  }
}

const assertBits = (bits: number, 爻数: 爻数): void => {
  assert爻数(爻数)
  assertIntegerInRange('ビット列', bits, 0, 2 ** 爻数 - 1)
}

// 下から数えた位置（1始まり）を、ビット位置（最下位が0）にする
const bitIndex = (爻数: 爻数, 位置: number): number => 爻数 - 位置

// 初爻 → 上爻の順
export const get爻list = (bits: number, 爻数: 爻数): 陰陽[] => {
  assertBits(bits, 爻数)
  return Array.from({ length: 爻数 }, (_, i) => ((bits >> bitIndex(爻数, i + 1)) & 1 ? '陰' : '陽'))
}

export const from爻list = (爻list: readonly 陰陽[]): number => {
  assert爻数(爻list.length)
  return 爻list.reduce((bits, 爻) => {
    if (爻 !== '陽' && 爻 !== '陰') {
      throw new RangeError(`爻は「陽」か「陰」で指定してください: ${爻}`)
    }
    return (bits << 1) | (爻 === '陰' ? 1 : 0)
  }, 0)
}

// 錯：陰陽をすべて反転する
export const invert爻 = (bits: number, 爻数: 爻数): number => {
  assertBits(bits, 爻数)
  return bits ^ (2 ** 爻数 - 1)
}

// 綜：上下を逆にする
export const reverse爻 = (bits: number, 爻数: 爻数): number => from爻list(get爻list(bits, 爻数).reverse())

// 変爻：下から数えた位置（1始まり）の爻を反転する
export const change爻 = (bits: number, 爻数: 爻数, 位置: number): number => {
  assertBits(bits, 爻数)
  assertIntegerInRange('位置', 位置, 1, 爻数)
  return bits ^ (1 << bitIndex(爻数, 位置))
}
