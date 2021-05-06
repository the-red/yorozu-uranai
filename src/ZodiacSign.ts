const ALL_SIGNS = [
  '牡羊座',
  '牡牛座',
  '双子座',
  '蟹座',
  '獅子座',
  '乙女座',
  '天秤座',
  '蠍座',
  '射手座',
  '山羊座',
  '水瓶座',
  '魚座',
] as const
type Sign = typeof ALL_SIGNS[number]

const ALL_MAJOR_ASPECTS = ['conjunction', 'sextile', 'square', 'trine', 'opposition'] as const
type MajorAspect = typeof ALL_MAJOR_ASPECTS[number]

export class ZodiacSign {
  static ALL_SIGNS = ALL_SIGNS
  static ALL_MAJOR_ASPECTS = ALL_MAJOR_ASPECTS

  readonly sign: Sign
  readonly degrees: number

  constructor(readonly fullDegrees: number) {
    const INTERVAL = 30 as const
    this.degrees = fullDegrees % INTERVAL

    let index = Math.trunc(fullDegrees / INTERVAL)
    if (this.degrees === 0) {
      index = index > 0 ? index - 1 : ZodiacSign.ALL_SIGNS.length - 1
    }

    this.sign = ZodiacSign.ALL_SIGNS[index]
  }

  get element() {
    if (['牡羊座', '獅子座', '射手座'].includes(this.sign)) {
      return 'fire'
    }
    if (['牡牛座', '乙女座', '山羊座'].includes(this.sign)) {
      return 'earth'
    }
    if (['双子座', '天秤座', '水瓶座'].includes(this.sign)) {
      return 'air'
    }
    if (['蟹座', '蠍座', '魚座'].includes(this.sign)) {
      return 'water'
    }
  }

  majorAspect(target: ZodiacSign, orb: number): MajorAspect | null {
    const diff = target.fullDegrees - this.fullDegrees
    if (Math.abs(diff) <= orb) {
      return 'conjunction'
    }
    if (60 - orb <= diff && diff <= 60 + orb) {
      return 'sextile'
    }
    if (90 - orb <= diff && diff <= 90 + orb) {
      return 'square'
    }
    if (120 - orb <= diff && diff <= 120 + orb) {
      return 'trine'
    }
    if (180 - orb <= diff && diff <= 180 + orb) {
      return 'opposition'
    }
    return null
  }
}
