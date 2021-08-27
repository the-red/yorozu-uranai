import type { Planet } from './Planet'
import type { PlanetName, Houses } from './types'

export type PlanetsMap = Record<PlanetName, Planet>
export type HoroscopeProps = { positionsMap: PlanetsMap; houses: Houses }

// 全惑星の座標
export class Horoscope {
  readonly planets: PlanetsMap
  readonly houses: Houses

  constructor({ positionsMap, houses }: HoroscopeProps) {
    this.planets = positionsMap
    this.houses = houses
  }
}
