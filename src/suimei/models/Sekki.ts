export const 節list = [
  '立春',
  '啓蟄',
  '清明',
  '立夏',
  '芒種',
  '小暑',
  '立秋',
  '白露',
  '寒露',
  '立冬',
  '大雪',
  '小寒',
] as const
export type 節 = typeof 節list[number]

// 立春が黄経315度(-45度)なので、四柱推命の計算時にはこの値を足しておく
export const adjustment = 45 as const
export const interval = 30 as const // 360度÷12節

export const sekkiIndex = (longitude: number): number => Math.trunc(((longitude + adjustment) % 360) / interval)
export const sekki = (longitude: number): 節 => 節list[sekkiIndex(longitude)]
