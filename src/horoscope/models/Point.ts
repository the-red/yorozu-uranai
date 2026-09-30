import type { Horoscope } from './Horoscope'
import { angleFrom } from './House'

// 感受点。天体ではなく、計算で求める点
// NOTE: AscとMcも感受点だが、ハウスの起点なので、House で扱う
//
// どれも、サインとハウスを読むので、惑星と同じ形（Planet）で扱う
// - ヘッドとテイル（ドラゴンヘッド、ドラゴンテイル）: 月の軌道と、太陽の通り道（黄道）が交わる2つの点
// - リリス: 月の軌道の上で、地球から一番遠い点（遠地点）
// - Vx（バーテックス）: 真東・天頂・真西を通る円と、黄道が、西側で交わる点
// - PoF（パート・オブ・フォーチュン）: Asc・太陽・月の位置から求める点
//
// 並び順は、表示の順番。日時だけで決まるものを先に、出生時刻と場所で決まるものを後に置く
export const POINT_NAMES = ['northNode', 'southNode', 'lilith', 'vertex', 'partOfFortune'] as const
export type PointName = (typeof POINT_NAMES)[number]

// NOTE: Vx には、記号が無い。PoF の記号（⊗ や ⨂）は、端末によって見た目が変わるので、使わない。
// どちらも、名前をそのまま使う
export const POINT_ICONS = {
  northNode: '☊',
  southNode: '☋',
  lilith: '⚸',
  vertex: 'Vx',
  partOfFortune: 'PoF',
} as const

export const POINT_NAMES_JA = {
  northNode: 'ヘッド',
  southNode: 'テイル',
  lilith: 'リリス',
  vertex: 'Vx',
  partOfFortune: 'PoF',
} as const

// 種類
export const POINT_TYPES = {
  northNode: 'node',
  southNode: 'node',
  lilith: 'apogee',
  vertex: 'angle',
  partOfFortune: 'lot',
} as const

// 出生時刻と場所が無いと、求められないもの
// NOTE: Vx と PoF は、Asc や Mc と同じく、地面から見た向きで決まる。地球の自転で、約4分に1度動く。
// ほかは、惑星と同じく、星空の中の位置で、日時だけで決まる
export const POINT_NEEDS_BIRTH_TIME = {
  northNode: false,
  southNode: false,
  lilith: false,
  vertex: true,
  partOfFortune: true,
} as const

// 昼生まれ（太陽が、地平線より上にある）かどうか
// NOTE: Asc から、黄経が増える向きに 180度までが、地平線の下（1〜6ハウス）。
// 境界は、ハウスの決め方（House.where）に合わせる。Asc と同じ黄経は 1ハウス（夜）、Dsc と同じ黄経は 7ハウス（昼）
export const isDayBirth = (ascendant: number, sun: number): boolean => {
  const angle = angleFrom(ascendant, sun)
  return angle >= 180
}

// パート・オブ・フォーチュンの黄経
// 昼生まれは「Asc + 月 − 太陽」、夜生まれは、太陽と月を入れ替えて「Asc + 太陽 − 月」
export const getPartOfFortune = ({ ascendant, sun, moon }: { ascendant: number; sun: number; moon: number }): number =>
  angleFrom(0, isDayBirth(ascendant, sun) ? ascendant + moon - sun : ascendant + sun - moon)

// 求め方が複数あるものについて、どれで求めたか。求め方が1つのものは null
// - ヘッドとテイルは、真位置（true）
// - リリスは、平均の位置（mean）
// - PoF は、昼生まれの式（day）か、夜生まれの式（night）
export type PointVariant = 'true' | 'mean' | 'day' | 'night'
export const getPointVariant = (name: PointName, { planets, house }: Horoscope): PointVariant | null => {
  switch (name) {
    case 'northNode':
    case 'southNode':
      return 'true'
    case 'lilith':
      return 'mean'
    case 'vertex':
      return null
    case 'partOfFortune':
      return isDayBirth(house.ascendant.longitude, planets.sun.longitude) ? 'day' : 'night'
  }
}
