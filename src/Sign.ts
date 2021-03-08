import { ZoneOptions } from 'luxon'

type ZodiacSign = '牡羊座' | '牡牛座'

type StarPosition = {
  sun: ZodiacSign
  moon: ZodiacSign
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
