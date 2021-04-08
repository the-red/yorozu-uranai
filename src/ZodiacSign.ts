export const ALL_ZODIAC_SIGNS = [
  '牡羊座',
  '牡牛座',
  '双子座',
  '蟹座',
  '獅子座',
  '乙女座',
  '天秤座',
  '蠍座',
  '射手座',
  '山羊座',
  '水瓶座',
  '魚座',
] as const

export type ZodiacSign = typeof ALL_ZODIAC_SIGNS[number]

export class CZodiacSign {
  readonly sign: string
  readonly degrees: number

  constructor(fullDegrees: number) {
    const INTERVAL = 30 as const
    this.degrees = fullDegrees % INTERVAL

    let index = Math.trunc(fullDegrees / INTERVAL)
    if (this.degrees === 0) {
      index -= 1
    }

    this.sign = ALL_ZODIAC_SIGNS[index]
  }
}
