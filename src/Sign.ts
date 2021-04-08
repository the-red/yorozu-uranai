import { ALL_PLANETS, Planet, PlanetPosition } from './Planet'

export class Sign {
  constructor(private planetPosition: PlanetPosition) {}

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

  get masculine(): Planet[] {
    return [...this.fire, ...this.air]
  }

  get feminine(): Planet[] {
    return [...this.earth, ...this.water]
  }
}
