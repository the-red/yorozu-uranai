import { ZoneOptions } from 'luxon'
import { ALL_PLANETS, Planet, PlanetPosition } from './Planet'

export class Sign {
  private planetPosition: PlanetPosition

  constructor(starPosition: PlanetPosition) {
    this.planetPosition = starPosition
  }

  fire(): Planet[] {
    return ALL_PLANETS.filter(
      (planet) =>
        this.planetPosition[planet] === '牡羊座' ||
        this.planetPosition[planet] === '獅子座' ||
        this.planetPosition[planet] === '射手座'
    )
  }

  earth(): Planet[] {
    return ALL_PLANETS.filter(
      (planet) =>
        this.planetPosition[planet] === '牡牛座' ||
        this.planetPosition[planet] === '乙女座' ||
        this.planetPosition[planet] === '山羊座'
    )
  }

  air(): Planet[] {
    return ALL_PLANETS.filter(
      (planet) =>
        this.planetPosition[planet] === '双子座' ||
        this.planetPosition[planet] === '天秤座' ||
        this.planetPosition[planet] === '水瓶座'
    )
  }

  water(): Planet[] {
    return ALL_PLANETS.filter(
      (planet) =>
        this.planetPosition[planet] === '蟹座' ||
        this.planetPosition[planet] === '蠍座' ||
        this.planetPosition[planet] === '魚座'
    )
  }

  masculine(): Planet[] {
    return [...this.fire(), ...this.air()]
  }

  feminine(): Planet[] {
    return [...this.earth(), ...this.water()]
  }
}
