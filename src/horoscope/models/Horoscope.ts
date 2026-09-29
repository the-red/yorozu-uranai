import { Position } from './Position'
import { Planet } from './Planet'
import type { PlanetName, EclipticPosition, Houses } from '../../astronomy/types'
import { House } from './House'
import type { PointName } from './Point'

export type PlanetsMap = Record<PlanetName, Planet>
export type PointsMap = { [Name in PointName]: Planet<Name> }
export type HoroscopeProps = {
  positions: [PlanetName, EclipticPosition][]
  houses: Houses
  node: EclipticPosition // ヘッド（ドラゴンヘッド）
}

export class Horoscope {
  readonly planets: PlanetsMap
  readonly points: PointsMap
  readonly house: House

  constructor({ positions, houses, node }: HoroscopeProps) {
    this.house = new House(houses)
    this.planets = Object.fromEntries(
      positions.map(([planetName, position]) => [
        planetName,
        new Planet(new Position(position.longitude), planetName, position.isRetrograde, this.house),
      ])
    ) as PlanetsMap

    // テイルは、ヘッドのちょうど反対側
    this.points = {
      northNode: new Planet(new Position(node.longitude), 'northNode', node.isRetrograde, this.house),
      southNode: new Planet(new Position(node.longitude + 180), 'southNode', node.isRetrograde, this.house),
    }
  }
}
