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

// ToDo：変数名はPlanetPosition（惑星）の方が良さそう
type StarPosition = {
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

type Star = keyof StarPosition

export class Sign {
  private starPosition: StarPosition
  private stars: Star[]

  constructor(starPosition: StarPosition) {
    this.starPosition = starPosition
    this.stars = Object.keys(this.starPosition) as Star[]
  }

  fire(): Star[] {
    return this.stars.filter(
      (star) =>
        this.starPosition[star] === '牡羊座' ||
        this.starPosition[star] === '獅子座' ||
        this.starPosition[star] === '射手座'
    )
  }

  earth(): Star[] {
    return this.stars.filter(
      (star) =>
        this.starPosition[star] === '牡牛座' ||
        this.starPosition[star] === '乙女座' ||
        this.starPosition[star] === '山羊座'
    )
  }

  air(): Star[] {
    return this.stars.filter(
      (star) =>
        this.starPosition[star] === '双子座' ||
        this.starPosition[star] === '天秤座' ||
        this.starPosition[star] === '水瓶座'
    )
  }

  water(): Star[] {
    return this.stars.filter(
      (star) =>
        this.starPosition[star] === '蟹座' || this.starPosition[star] === '蠍座' || this.starPosition[star] === '魚座'
    )
  }

  masculine(): Star[] {
    return [...this.fire(), ...this.air()]
  }

  feminine(): Star[] {
    return [...this.earth(), ...this.water()]
  }
}
