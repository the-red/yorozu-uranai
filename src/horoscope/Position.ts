export class Position {
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

  private INTERVAL = 30 as const

  constructor(readonly longitude: number) {}

  get degrees() {
    return this.longitude % this.INTERVAL
  }

  get formattedDegrees() {
    const degreesInt = Math.trunc(this.degrees)
    const degreesStr = `${String(degreesInt).padStart(2)}°`

    const MINUTE = 60
    const degreesMin = (this.degrees - degreesInt) * MINUTE
    const degreesMinInt = Math.round(degreesMin)
    const degreesMinStr = `${String(degreesMinInt).padStart(2, '0')}′`

    // const degreesSec = (degreesMin - degreesMinInt) * MINUTE
    // const degreesSecInt = Math.round(degreesSec)
    // const degreesSecStr = `${String(degreesSecInt).padStart(2, '0')}″`

    return degreesStr + degreesMinStr
  }

  get sign() {
    let index = Math.trunc(this.longitude / this.INTERVAL)
    if (this.degrees === 0) {
      index = index > 0 ? index - 1 : Position.ALL_SIGNS.length - 1
    }
    return Position.ALL_SIGNS[index]
  }

  get formattedLongitude() {
    return `${this.sign} ${this.formattedDegrees}`
  }
}
