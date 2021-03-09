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

  constructor(starPosition: StarPosition) {
    this.starPosition = starPosition
  }

  fire(): Star[] {
    return ['sun']
  }

  soil() {
    return []
  }
}
