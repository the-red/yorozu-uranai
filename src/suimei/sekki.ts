const 節 = ['立春', '啓蟄', '清明', '立夏', '芒種', '小暑', '立秋', '白露', '寒露', '立冬', '大雪', '小寒'] as const
type T節 = typeof 節[number]

export const sekkiIndex = (longitude: number): number => Math.trunc(((longitude + 45) % 360) / 30)
export const sekki = (longitude: number): T節 => 節[sekkiIndex(longitude)]