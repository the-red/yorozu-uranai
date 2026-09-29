import type { PointName } from './Point'

// 惑星以外のものを、表示するかどうか。利用者が切り替える
//
// 切り替えの単位。並び順は、表示の順番
// - ヘッドとテイルは、必ず正反対にあるので、まとめて切り替える
// - Asc と Mc も、まとめて切り替える。消しても、ハウスの線は残る
export const VISIBILITY_KEYS = ['node', 'lilith', 'ascMc', 'vertex', 'partOfFortune'] as const
export type VisibilityKey = (typeof VISIBILITY_KEYS)[number]
export type Visibility = Record<VisibilityKey, boolean>

export const VISIBILITY_LABELS = {
  node: 'ヘッド・テイル',
  lilith: 'リリス',
  ascMc: 'Asc・Mc',
  vertex: 'Vx',
  partOfFortune: 'PoF',
} as const

// 最初の状態
export const DEFAULT_VISIBILITY: Visibility = {
  node: true,
  lilith: true,
  ascMc: true,
  vertex: true,
  partOfFortune: true,
}

// 保存した文字列から読み取る
// NOTE: 保存した内容は、利用者の手元にあるので、どんな値でも受け取れるようにする。
// 読み取れない内容、知らない項目、真偽値でない値は、無視して、最初の状態で補う
export const parseVisibility = (saved: string | null): Visibility => {
  let values: unknown
  try {
    values = JSON.parse(saved ?? '')
  } catch {
    return { ...DEFAULT_VISIBILITY }
  }
  if (typeof values !== 'object' || values === null) {
    return { ...DEFAULT_VISIBILITY }
  }

  const visibility = { ...DEFAULT_VISIBILITY }
  VISIBILITY_KEYS.forEach((key) => {
    const value = (values as Record<string, unknown>)[key]
    if (typeof value === 'boolean') {
      visibility[key] = value
    }
  })
  return visibility
}

// 1つを切り替えて、保存する文字列を返す
export const toggleVisibility = (visibility: Visibility, key: VisibilityKey, visible: boolean): string =>
  JSON.stringify({ ...visibility, [key]: visible })

const POINT_KEYS: Record<PointName, VisibilityKey> = {
  northNode: 'node',
  southNode: 'node',
  lilith: 'lilith',
  vertex: 'vertex',
  partOfFortune: 'partOfFortune',
}

// 感受点を、表示するかどうか
export const isPointVisible = (name: PointName, visibility: Visibility): boolean => visibility[POINT_KEYS[name]]
