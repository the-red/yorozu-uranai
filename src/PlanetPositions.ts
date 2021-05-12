import { julday, eclipticPosition, ALL_PLANETS, PlanetName } from './swisseph'
import { Planet } from './Planet'

// 全惑星の座標
export class PlanetPositions {
  readonly sun: Planet
  readonly moon: Planet
  readonly mercury: Planet
  readonly venus: Planet
  readonly mars: Planet
  readonly jupiter: Planet
  readonly saturn: Planet
  readonly uranus: Planet
  readonly neptune: Planet
  readonly pluto: Planet

  static async getInstance(date: Date) {
    const julday_ut = await julday(date)

    const positions = await Promise.all(
      ALL_PLANETS.map(async (planetName) => {
        const position = await eclipticPosition(julday_ut, planetName)
        const planet = new Planet(position.longitude)
        return [planetName, planet] as [PlanetName, Planet]
      })
    )
    const positionsMap = Object.fromEntries(positions) as Record<PlanetName, Planet>
    return new PlanetPositions(positionsMap)
  }

  constructor(readonly all: Record<PlanetName, Planet>) {
    this.sun = all.sun
    this.moon = all.moon
    this.mercury = all.mercury
    this.venus = all.venus
    this.mars = all.mars
    this.jupiter = all.jupiter
    this.saturn = all.saturn
    this.uranus = all.uranus
    this.neptune = all.neptune
    this.pluto = all.pluto
  }
}
