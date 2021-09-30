import { Planet } from './Planet'
import type { PlanetName, EclipticPosition, Houses } from './types'

export type PlanetsMap = Record<PlanetName, Planet>
export type HoroscopeProps = { positions: [PlanetName, EclipticPosition][]; houses: Houses }

// 全惑星の座標
export class Horoscope {
  readonly planets: PlanetsMap
  readonly houses: Houses

  constructor({ positions, houses }: HoroscopeProps) {
    this.planets = Object.fromEntries(
      positions.map(([planetName, position]) => [planetName, new Planet(position.longitude, planetName, houses.house)])
    ) as PlanetsMap
    this.houses = houses
  }
}
