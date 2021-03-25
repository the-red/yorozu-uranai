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
  private keys: Star[]

  constructor(starPosition: StarPosition) {
    this.starPosition = starPosition
    this.keys = Object.keys(this.starPosition) as Star[]
  }

  fire(): Star[] {
    return this.keys.filter(
      (key) =>
        this.starPosition[key] === '牡羊座' ||
        this.starPosition[key] === '獅子座' ||
        this.starPosition[key] === '射手座'
    )
  }

  earth(): Star[] {
    return ['sun']
  }

  masculine(): Star[] {
    return ['sun']
  }

  feminine(): Star[] {
    return ['sun']
  }
}
