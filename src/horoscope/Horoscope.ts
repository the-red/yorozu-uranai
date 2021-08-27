import { PlanetsMap, HoroscopeProps } from './Planet'
import type { Houses } from './types'

// 全惑星の座標
export class Horoscope {
  readonly planets: PlanetsMap
  readonly houses: Houses

  constructor({ positionsMap, houses }: HoroscopeProps) {
    this.planets = positionsMap
    this.houses = houses
  }
}
