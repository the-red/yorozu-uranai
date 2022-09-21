const 節list = ['立春', '啓蟄', '清明', '立夏', '芒種', '小暑', '立秋', '白露', '寒露', '立冬', '大雪', '小寒'] as const
export type 節 = typeof 節list[number]

export const sekkiIndex = (longitude: number): number => Math.trunc(((longitude + 45) % 360) / 30)
export const sekki = (longitude: number): 節 => 節list[sekkiIndex(longitude)]
