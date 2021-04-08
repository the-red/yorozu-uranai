import { ALL_PLANETS, Planet, PlanetPosition } from './Planet'

export class Sign {
  private planetPosition: PlanetPosition

  constructor(starPosition: PlanetPosition) {
    this.planetPosition = starPosition
  }

  fire(): Planet[] {
    return ALL_PLANETS.filter((planet) => ['牡羊座', '獅子座', '射手座'].includes(this.planetPosition[planet]))
  }

  earth(): Planet[] {
    return ALL_PLANETS.filter((planet) => ['牡牛座', '乙女座', '山羊座'].includes(this.planetPosition[planet]))
  }

  air(): Planet[] {
    return ALL_PLANETS.filter((planet) => ['双子座', '天秤座', '水瓶座'].includes(this.planetPosition[planet]))
  }

  water(): Planet[] {
    return ALL_PLANETS.filter((planet) => ['蟹座', '蠍座', '魚座'].includes(this.planetPosition[planet]))
  }

  masculine(): Planet[] {
    return [...this.fire(), ...this.air()]
  }

  feminine(): Planet[] {
    return [...this.earth(), ...this.water()]
  }
}
