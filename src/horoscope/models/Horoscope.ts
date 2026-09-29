import { Position } from './Position'
import { Planet } from './Planet'
import type { AsteroidName, PlanetName, EclipticPosition, Houses } from '../../astronomy/types'
import { House } from './House'
import { PointName, getPartOfFortune } from './Point'

export type PlanetsMap = Record<PlanetName, Planet>
export type PointsMap = { [Name in PointName]: Planet<Name> }
export type AsteroidsMap = { [Name in AsteroidName]: Planet<Name> }
export type HoroscopeProps = {
  positions: [PlanetName, EclipticPosition][]
  houses: Houses // バーテックスの位置も、ここに入っている
  node: EclipticPosition // ヘッド（ドラゴンヘッド）
  lilith: EclipticPosition // リリス
  asteroids: [AsteroidName, EclipticPosition][] | null // 小惑星とキロン。計算できない日付では null
}

export class Horoscope {
  readonly planets: PlanetsMap
  readonly points: PointsMap
  readonly asteroids?: AsteroidsMap // 計算できない日付では、無い
  readonly house: House

  constructor({ positions, houses, node, lilith, asteroids }: HoroscopeProps) {
    this.house = new House(houses)
    this.planets = Object.fromEntries(
      positions.map(([planetName, position]) => [
        planetName,
        new Planet(new Position(position.longitude), planetName, position.isRetrograde, this.house),
      ])
    ) as PlanetsMap

    if (asteroids) {
      this.asteroids = Object.fromEntries(
        asteroids.map(([name, position]) => [
          name,
          new Planet(new Position(position.longitude), name, position.isRetrograde, this.house),
        ])
      ) as AsteroidsMap
    }

    const point = <Name extends PointName>(name: Name, longitude: number, isRetrograde: boolean) =>
      new Planet(new Position(longitude), name, isRetrograde, this.house)
    const { sun, moon } = this.planets
    const fortune = getPartOfFortune({ ascendant: houses.ascendant, sun: sun.longitude, moon: moon.longitude })

    this.points = {
      northNode: point('northNode', node.longitude, node.isRetrograde),
      // テイルは、ヘッドのちょうど反対側
      southNode: point('southNode', node.longitude + 180, node.isRetrograde),
      lilith: point('lilith', lilith.longitude, lilith.isRetrograde),
      // NOTE: バーテックスと PoF は、その瞬間の位置だけが決まる点で、進む向きが無い。逆行はしないものとして扱う
      vertex: point('vertex', houses.vertex, false),
      partOfFortune: point('partOfFortune', fortune, false),
    }
  }
}
