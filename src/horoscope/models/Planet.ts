import type { AsteroidName, PlanetName } from '../../astronomy/types'
import { ASTEROID_ICONS } from './Asteroid'
import { MAJOR_ASPECTS, MINOR_ASPECTS, MajorAspect, MinorAspect, MinorDegrees, findAspect } from './Aspect'
import { Position } from './Position'
import { House } from './House'
import { POINT_ICONS, PointName } from './Point'

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
export type PlanetIcon = (typeof PLANET_ICONS)[PlanetName]

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

const ICONS = { ...PLANET_ICONS, ...ASTEROID_ICONS, ...POINT_ICONS }

// 惑星。小惑星と感受点も、同じ形で扱う
export class Planet<Name extends PlanetName | AsteroidName | PointName = PlanetName> {
  static ALL_SIGNS = Position.ALL_SIGNS
  static ALL_MAJOR_ASPECTS = MAJOR_ASPECTS
  static ALL_MINOR_ASPECTS = MINOR_ASPECTS

  constructor(
    readonly position: Position,
    readonly name: Name,
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
    return ICONS[this.name]
  }

  // 黄経の差。円周の短いほうで測る（0〜180度）
  diffLongitude(targetLongitude: number): number {
    const diff = Math.abs(targetLongitude - this.longitude) % 360
    return diff > 180 ? 360 - diff : diff
  }

  majorAspect(target: Planet, orb: number): MajorAspect | undefined {
    return findAspect(this.diffLongitude(target.longitude), MAJOR_ASPECTS, orb)?.aspect
  }

  // degrees を渡すと、その角度のマイナーアスペクトだけを求める
  minorAspect(target: Planet, orb: number, degrees?: readonly MinorDegrees[]): MinorAspect | undefined {
    const aspects = degrees ? MINOR_ASPECTS.filter((_) => degrees.includes(_.degrees)) : MINOR_ASPECTS
    return findAspect(this.diffLongitude(target.longitude), aspects, orb)?.aspect
  }
}
