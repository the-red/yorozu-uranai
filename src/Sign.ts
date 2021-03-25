import { ZoneOptions } from 'luxon'

type ZodiacSign =
  | '牡羊座'
  | '牡牛座'
  | '双子座'
  | '蟹座'
  | '獅子座'
  | '乙女座'
  | '天秤座'
  | '蠍座'
  | '射手座'
  | '山羊座'
  | '水瓶座'
  | '魚座'

type PlanetPosition = {
  sun: ZodiacSign
  moon: ZodiacSign
  mercury: ZodiacSign
  venus: ZodiacSign
  mars: ZodiacSign
  jupiter: ZodiacSign
  saturn: ZodiacSign
  uranus: ZodiacSign
  neptune: ZodiacSign
  pluto: ZodiacSign
}

type Planet = keyof PlanetPosition

export class Sign {
  private planetPosition: PlanetPosition
  private planets: Planet[]

  constructor(starPosition: PlanetPosition) {
    this.planetPosition = starPosition
    this.planets = Object.keys(this.planetPosition) as Planet[]
  }

  fire(): Planet[] {
    return this.planets.filter(
      (planet) =>
        this.planetPosition[planet] === '牡羊座' ||
        this.planetPosition[planet] === '獅子座' ||
        this.planetPosition[planet] === '射手座'
    )
  }

  earth(): Planet[] {
    return this.planets.filter(
      (planet) =>
        this.planetPosition[planet] === '牡牛座' ||
        this.planetPosition[planet] === '乙女座' ||
        this.planetPosition[planet] === '山羊座'
    )
  }

  air(): Planet[] {
    return this.planets.filter(
      (planet) =>
        this.planetPosition[planet] === '双子座' ||
        this.planetPosition[planet] === '天秤座' ||
        this.planetPosition[planet] === '水瓶座'
    )
  }

  water(): Planet[] {
    return this.planets.filter(
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
