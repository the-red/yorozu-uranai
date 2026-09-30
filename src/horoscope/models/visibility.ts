import type { AsteroidName } from '../../astronomy/types'
import type { PointName } from './Point'

// 惑星以外のものを、表示するかどうか。利用者が切り替える
//
// 切り替えの単位。並び順は、表示の順番
// - 出生時刻と場所で決まるもの（Asc・Mc、Vx、PoF）を先に、日時だけで決まるもの（小惑星、キロン、ヘッド・テイル、リリス）を後に置く
// - Asc と Mc は、まとめて切り替える。消しても、ハウスの線は残る
// - 4つの小惑星（セレス、パラス、ジュノ、ベスタ）は、まとめて切り替える。キロンは、別
// - ヘッドとテイルは、必ず正反対にあるので、まとめて切り替える
// NOTE: 惑星は、常に表示する。切り替えの対象ではない
// 切り替えの欄は、惑星を先頭にして、2つずつ、4段に並べる
export const VISIBILITY_KEYS = ['ascMc', 'vertex', 'partOfFortune', 'asteroids', 'chiron', 'node', 'lilith'] as const
export type VisibilityKey = (typeof VISIBILITY_KEYS)[number]
export type Visibility = Record<VisibilityKey, boolean>

export const VISIBILITY_LABELS = {
  ascMc: 'Asc・Mc',
  vertex: 'Vx',
  partOfFortune: 'PoF',
  asteroids: '小惑星',
  chiron: 'キロン',
  node: 'ヘッド・テイル',
  lilith: 'リリス',
} as const

// 最初の状態。Asc と Mc だけを表示する
// NOTE: 惑星以外は、読む人が選んで表示する。最初から表示すると、円が混み合う
export const DEFAULT_VISIBILITY: Visibility = {
  ascMc: true,
  vertex: false,
  partOfFortune: false,
  asteroids: false,
  chiron: false,
  node: false,
  lilith: false,
}

// URLに入れる値。表示するものを、カンマで区切って並べる（asteroids,ascMc）。何も表示しないときは none
// 最初の状態と同じなら、undefined（URLに入れない）
export const toShowParam = (visibility: Visibility): string | undefined => {
  if (VISIBILITY_KEYS.every((key) => visibility[key] === DEFAULT_VISIBILITY[key])) {
    return undefined
  }
  return VISIBILITY_KEYS.filter((key) => visibility[key]).join() || 'none'
}

// URLの値から読み取る。値が無ければ、最初の状態
// NOTE: URLは、利用者が書き換えられるので、どんな値でも受け取れるようにする。知らない項目は、無視する
export const parseShowParam = (value: string | undefined): Visibility => {
  if (value === undefined || value === '') {
    return { ...DEFAULT_VISIBILITY }
  }
  const shown = value.split(',')
  // 知っている項目が1つも無ければ、読み取れない値として、最初の状態にする
  if (value !== 'none' && !VISIBILITY_KEYS.some((key) => shown.includes(key))) {
    return { ...DEFAULT_VISIBILITY }
  }
  return Object.fromEntries(VISIBILITY_KEYS.map((key) => [key, shown.includes(key)])) as Visibility
}

const POINT_KEYS: Record<PointName, VisibilityKey> = {
  northNode: 'node',
  southNode: 'node',
  lilith: 'lilith',
  vertex: 'vertex',
  partOfFortune: 'partOfFortune',
}

// 小惑星とキロンを、表示するかどうか
export const isAsteroidVisible = (name: AsteroidName, visibility: Visibility): boolean =>
  name === 'chiron' ? visibility.chiron : visibility.asteroids

// 感受点を、表示するかどうか
export const isPointVisible = (name: PointName, visibility: Visibility): boolean => visibility[POINT_KEYS[name]]
