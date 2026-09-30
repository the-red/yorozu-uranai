// アスペクトの種類
// - hard と soft は、メジャーアスペクト
// - minor は、マイナーアスペクト
export const MAJOR_ASPECTS = [
  { degrees: 0, name: 'conjunction', type: 'hard' },
  { degrees: 60, name: 'sextile', type: 'soft' },
  { degrees: 90, name: 'square', type: 'hard' },
  { degrees: 120, name: 'trine', type: 'soft' },
  { degrees: 180, name: 'opposition', type: 'hard' },
] as const
export type MajorAspect = (typeof MAJOR_ASPECTS)[number]

export const MINOR_ASPECTS = [
  { degrees: 30, name: 'semi-sextile', type: 'minor' },
  { degrees: 45, name: 'semi-square', type: 'minor' },
  { degrees: 72, name: 'quintile', type: 'minor' },
  { degrees: 135, name: 'sesquiquadrate', type: 'minor' },
  { degrees: 144, name: 'biquintile', type: 'minor' },
  { degrees: 150, name: 'quincunx', type: 'minor' },
] as const
export type MinorAspect = (typeof MINOR_ASPECTS)[number]
export type MinorDegrees = MinorAspect['degrees']
export const MINOR_DEGREES: readonly MinorDegrees[] = MINOR_ASPECTS.map((_) => _.degrees)

export type Aspect = MajorAspect | MinorAspect

export const [CONJUNCTION] = MAJOR_ASPECTS

// オーブに収まるアスペクトと、ずれ（アスペクトの角度との差）
export type Found<T> = { aspect: T; gap: number }

// 黄経の差（0〜180度）に、一番近いアスペクト。オーブに収まるものが無ければ undefined
// NOTE: オーブが広いと、隣り合うアスペクト（135度と 144度など）の両方に収まる。ずれの小さいほうを選ぶ
export const findAspect = <T extends { degrees: number }>(
  diff: number,
  aspects: readonly T[],
  orb: number
): Found<T> | undefined =>
  closest(aspects.map((aspect) => ({ aspect, gap: Math.abs(diff - aspect.degrees) })).filter((_) => _.gap <= orb))

// ずれが一番小さいもの。同じなら、先のものを選ぶ
export const closest = <T>(found: (Found<T> | undefined)[]): Found<T> | undefined =>
  found.reduce((best, _) => (_ && (!best || _.gap < best.gap) ? _ : best), undefined)
