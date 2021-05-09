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

const ALL_MINOR_ASPECTS = [
  'semi-sextile',
  'semi-square',
  'quintile',
  'sesquiquadrate',
  'biquintile',
  'quincunx',
] as const
type MinorAspect = typeof ALL_MINOR_ASPECTS[number]

export class ZodiacSign {
  static ALL_SIGNS = ALL_SIGNS
  static ALL_MAJOR_ASPECTS = ALL_MAJOR_ASPECTS
  static ALL_MINOR_ASPECTS = ALL_MINOR_ASPECTS

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

  get quality() {
    if (['牡羊座', '蟹座', '天秤座', '山羊座'].includes(this.sign)) {
      return 'cardinal'
    }
    if (['牡牛座', '獅子座', '蠍座', '水瓶座'].includes(this.sign)) {
      return 'fixed'
    }
    if (['双子座', '乙女座', '射手座', '魚座'].includes(this.sign)) {
      return 'mutable'
    }
  }

  get polarity() {
    if (['牡羊座', '双子座', '獅子座', '天秤座', '射手座', '水瓶座'].includes(this.sign)) {
      return 'masculine'
    }
    if (['牡牛座', '蟹座', '乙女座', '蠍座', '山羊座', '魚座'].includes(this.sign)) {
      return 'feminine'
    }
  }

  diffDegrees(targetFullDegrees: number): number {
    return targetFullDegrees - this.fullDegrees
  }

  majorAspect(target: ZodiacSign, orb: number): MajorAspect | null {
    const diff = this.diffDegrees(target.fullDegrees)
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

  minorAspect(target: ZodiacSign, orb: number): MinorAspect | null {
    const diff = this.diffDegrees(target.fullDegrees)
    if (30 - orb <= diff && diff <= 30 + orb) {
      return 'semi-sextile'
    }
    if (45 - orb <= diff && diff <= 45 + orb) {
      return 'semi-square'
    }
    if (72 - orb <= diff && diff <= 72 + orb) {
      return 'quintile'
    }
    if (135 - orb <= diff && diff <= 135 + orb) {
      return 'sesquiquadrate'
    }
    if (144 - orb <= diff && diff <= 144 + orb) {
      return 'biquintile'
    }
    if (150 - orb <= diff && diff <= 150 + orb) {
      return 'quincunx'
    }
    return null
  }
}
