import type { PlanetName, Houses } from './types'

export const PLANET_ICONS = {
  sun: '☉',
  moon: '☽',
  mercury: '☿',
  venus: '♀',
  mars: '♂',
  jupiter: '♃',
  saturn: '♄',
  uranus: '♅',
  neptune: '♆',
  pluto: '♇',
} as const
export type PlanetIcon = typeof PLANET_ICONS[PlanetName]

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

const ALL_MAJOR_ASPECTS = [
  { degrees: 0, name: 'conjunction' },
  { degrees: 60, name: 'sextile' },
  { degrees: 90, name: 'square' },
  { degrees: 120, name: 'trine' },
  { degrees: 180, name: 'opposition' },
] as const
type MajorAspect = typeof ALL_MAJOR_ASPECTS[number]['name']

const ALL_MINOR_ASPECTS = [
  { degrees: 30, name: 'semi-sextile' },
  { degrees: 45, name: 'semi-square' },
  { degrees: 72, name: 'quintile' },
  { degrees: 135, name: 'sesquiquadrate' },
  { degrees: 144, name: 'biquintile' },
  { degrees: 150, name: 'quincunx' },
] as const
type MinorAspect = typeof ALL_MINOR_ASPECTS[number]['name']

export class Planet {
  static ALL_SIGNS = ALL_SIGNS
  static ALL_MAJOR_ASPECTS = ALL_MAJOR_ASPECTS
  static ALL_MINOR_ASPECTS = ALL_MINOR_ASPECTS

  private INTERVAL = 30 as const

  constructor(readonly longitude: number, readonly name: PlanetName, private houseCusps: Houses['house']) {}

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

  get coordinate() {
    // ホロスコープに描画する際の座標（左端中央が原点）
    const radian = (this.longitude - 90) * (Math.PI / 180)
    const x = Math.sin(radian)
    const y = Math.cos(radian)
    return { x, y }
  }

  get house() {
    for (let i = 0; i < this.houseCusps.length; i++) {
      let start = this.houseCusps[i]
      let end = this.houseCusps[i + 1] || this.houseCusps[0]
      if (start > end) {
        end += 360
      }
      if (start < this.longitude && this.longitude <= end) {
        return i + 1
      }
    }
  }

  get icon() {
    return PLANET_ICONS[this.name]
  }

  diffLongitude(targetLongitude: number): number {
    return Math.abs(targetLongitude - this.longitude)
  }

  majorAspect(target: Planet, orb: number): MajorAspect | undefined {
    const diff = this.diffLongitude(target.longitude)
    return ALL_MAJOR_ASPECTS.find((aspect) => Math.abs(diff - aspect.degrees) <= orb)?.name
  }

  minorAspect(target: Planet, orb: number): MinorAspect | undefined {
    const diff = this.diffLongitude(target.longitude)
    return ALL_MINOR_ASPECTS.find((aspect) => Math.abs(diff - aspect.degrees) <= orb)?.name
  }
}
