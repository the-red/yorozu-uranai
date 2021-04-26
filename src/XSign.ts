import { ALL_PLANETS, Planet, PlanetPosition } from './Planet'

export class XSign {
  constructor(private planetPosition: PlanetPosition) {}

  // Element
  get fire(): Planet[] {
    return ALL_PLANETS.filter((planet) => ['牡羊座', '獅子座', '射手座'].includes(this.planetPosition[planet]))
  }
  get earth(): Planet[] {
    return ALL_PLANETS.filter((planet) => ['牡牛座', '乙女座', '山羊座'].includes(this.planetPosition[planet]))
  }
  get air(): Planet[] {
    return ALL_PLANETS.filter((planet) => ['双子座', '天秤座', '水瓶座'].includes(this.planetPosition[planet]))
  }
  get water(): Planet[] {
    return ALL_PLANETS.filter((planet) => ['蟹座', '蠍座', '魚座'].includes(this.planetPosition[planet]))
  }

  // Quality
  get cardinal(): Planet[] {
    return ALL_PLANETS.filter((planet) => ['牡羊座', '蟹座', '天秤座', '山羊座'].includes(this.planetPosition[planet]))
  }
  get fixed(): Planet[] {
    return ALL_PLANETS.filter((planet) => ['牡牛座', '獅子座', '蠍座', '水瓶座'].includes(this.planetPosition[planet]))
  }
  get mutable(): Planet[] {
    return ALL_PLANETS.filter((planet) => ['双子座', '乙女座', '射手座', '魚座'].includes(this.planetPosition[planet]))
  }

  // Polarity
  get masculine(): Planet[] {
    return [...this.fire, ...this.air]
  }
  get feminine(): Planet[] {
    return [...this.earth, ...this.water]
  }
}
