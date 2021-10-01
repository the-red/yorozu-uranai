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

  private static INTERVAL = 30 as const

  private static getDegrees(longitude: number) {
    return longitude % Position.INTERVAL
  }

  static getSign(longitude: number) {
    let index = Math.trunc(longitude / Position.INTERVAL)
    if (Position.getDegrees(longitude) === 0) {
      index = index > 0 ? index - 1 : Position.ALL_SIGNS.length - 1
    }
    return Position.ALL_SIGNS[index]
  }

  static formatDegrees(degrees: number) {
    const degreesInt = Math.trunc(degrees)
    const degreesStr = `${String(degreesInt).padStart(2)}°`

    const MINUTE = 60
    const degreesMin = (degrees - degreesInt) * MINUTE
    const degreesMinInt = Math.trunc(degreesMin)
    const degreesMinStr = `${String(degreesMinInt).padStart(2, '0')}′`

    const degreesSec = (degreesMin - degreesMinInt) * MINUTE
    const degreesSecInt = Math.round(degreesSec)
    const degreesSecStr = `${String(degreesSecInt).padStart(2, '0')}″`

    return degreesStr + degreesMinStr + degreesSecStr
  }

  static formatLongitude(longitude: number) {
    const sign = Position.getSign(longitude)
    const degrees = Position.getDegrees(longitude)
    const formattedDegrees = Position.formatDegrees(degrees)
    return `${sign} ${formattedDegrees}`
  }

  constructor(readonly longitude: number) {}

  get degrees() {
    return Position.getDegrees(this.longitude)
  }

  get formattedDegrees() {
    return Position.formatDegrees(this.degrees)
  }

  get sign() {
    return Position.getSign(this.longitude)
  }
}
