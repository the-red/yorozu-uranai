import { Position } from './Position'
import { Planet } from './Planet'
import type { PlanetName, EclipticPosition, Houses } from './types'
import { House } from './House'

export type PlanetsMap = Record<PlanetName, Planet>
export type HoroscopeProps = { positions: [PlanetName, EclipticPosition][]; houses: Houses }

export class Horoscope {
  readonly planets: PlanetsMap
  readonly house: House

  constructor({ positions, houses }: HoroscopeProps) {
    this.house = new House(houses)
    this.planets = Object.fromEntries(
      positions.map(([planetName, position]) => [
        planetName,
        new Planet(new Position(position.longitude), planetName, position.isRetrograde, this.house),
      ])
    ) as PlanetsMap
  }
}
