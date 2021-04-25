export class ZodiacSign {
  static ALL_SIGNS = [
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

  readonly sign: typeof ZodiacSign.ALL_SIGNS[number]
  readonly degrees: number

  constructor(readonly fullDegrees: number) {
    const INTERVAL = 30 as const
    this.degrees = fullDegrees % INTERVAL

    let index = Math.trunc(fullDegrees / INTERVAL)
    if (this.degrees === 0) {
      index = index > 0 ? index - 1 : ZodiacSign.ALL_SIGNS.length - 1
    }

    this.sign = ZodiacSign.ALL_SIGNS[index]
  }

  aspect(target: ZodiacSign, orb: number) {
    // TODO: ここをもっと気の利いたロジックに
    const diff = target.fullDegrees - this.fullDegrees

    if (180 - orb <= diff && diff <= 180 + orb) {
      return 'opposition'
    } else {
      return null
    }
  }
}
