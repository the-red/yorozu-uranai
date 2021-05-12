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

export class Planet {
  static ALL_SIGNS = ALL_SIGNS
  static ALL_MAJOR_ASPECTS = ALL_MAJOR_ASPECTS
  static ALL_MINOR_ASPECTS = ALL_MINOR_ASPECTS

  private INTERVAL = 30 as const

  constructor(readonly longitude: number) {}

  get degrees() {
    return this.longitude % this.INTERVAL
  }

  get formattedDegrees() {
    const degreesInt = Math.trunc(this.degrees)
    const degreesStr = `${String(degreesInt).padStart(2)}°`

    const MINUTE = 60
    const degreesMin = (this.degrees - degreesInt) * MINUTE
    const degreesMinInt = Math.trunc(degreesMin)
    const degreesMinStr = `${String(degreesMinInt).padStart(2, '0')}′`

    const degreesSec = (degreesMin - degreesMinInt) * MINUTE
    const degreesSecInt = Math.round(degreesSec)
    const degreesSecStr = `${String(degreesSecInt).padStart(2, '0')}″`

    return degreesStr + degreesMinStr + degreesSecStr
  }

  get sign() {
    let index = Math.trunc(this.longitude / this.INTERVAL)
    if (this.degrees === 0) {
      index = index > 0 ? index - 1 : ALL_SIGNS.length - 1
    }
    return ALL_SIGNS[index]
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
    return targetFullDegrees - this.longitude
  }

  majorAspect(target: Planet, orb: number): MajorAspect | null {
    const diff = this.diffDegrees(target.longitude)
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

  minorAspect(target: Planet, orb: number): MinorAspect | null {
    const diff = this.diffDegrees(target.longitude)
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
