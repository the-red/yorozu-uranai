import type { PlanetName } from '../astronomy/types'
import { Position } from './Position'
import { House } from './House'

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

export const PLANET_NAMES_JA = {
  sun: '太陽',
  moon: '月',
  mercury: '水星',
  venus: '金星',
  mars: '火星',
  jupiter: '木星',
  saturn: '土星',
  uranus: '天王星',
  neptune: '海王星',
  pluto: '冥王星',
} as const

const ALL_MAJOR_ASPECTS = [
  { degrees: 0, name: 'conjunction', type: 'hard' },
  { degrees: 60, name: 'sextile', type: 'soft' },
  { degrees: 90, name: 'square', type: 'hard' },
  { degrees: 120, name: 'trine', type: 'soft' },
  { degrees: 180, name: 'opposition', type: 'hard' },
] as const
export type MajorAspect = typeof ALL_MAJOR_ASPECTS[number]

const ALL_MINOR_ASPECTS = [
  { degrees: 30, name: 'semi-sextile' },
  { degrees: 45, name: 'semi-square' },
  { degrees: 72, name: 'quintile' },
  { degrees: 135, name: 'sesquiquadrate' },
  { degrees: 144, name: 'biquintile' },
  { degrees: 150, name: 'quincunx' },
] as const
type MinorAspect = typeof ALL_MINOR_ASPECTS[number]

export class Planet {
  static ALL_SIGNS = Position.ALL_SIGNS
  static ALL_MAJOR_ASPECTS = ALL_MAJOR_ASPECTS
  static ALL_MINOR_ASPECTS = ALL_MINOR_ASPECTS

  constructor(
    readonly position: Position,
    readonly name: PlanetName,
    readonly isRetrograde: boolean,
    private _house: House
  ) {}

  get longitude(): number {
    return this.position.longitude
  }

  get formattedDegrees() {
    return this.position.formattedDegrees + (this.isRetrograde ? 'R' : '')
  }

  get sign() {
    return this.position.sign
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

  get house() {
    return this._house.where(this.longitude)
  }

  get icon() {
    return PLANET_ICONS[this.name]
  }

  diffLongitude(targetLongitude: number): number {
    return Math.abs(targetLongitude - this.longitude)
  }

  majorAspect(target: Planet, orb: number): MajorAspect | undefined {
    const diff = this.diffLongitude(target.longitude)
    return ALL_MAJOR_ASPECTS.find((aspect) => Math.abs(diff - aspect.degrees) <= orb)
  }

  minorAspect(target: Planet, orb: number): MinorAspect | undefined {
    const diff = this.diffLongitude(target.longitude)
    return ALL_MINOR_ASPECTS.find((aspect) => Math.abs(diff - aspect.degrees) <= orb)
  }
}
