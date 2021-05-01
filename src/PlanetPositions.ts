import { julday, eclipticPosition, ALL_PLANETS, PlanetName } from './swisseph'

const ALL_SIGNS = [
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
type Sign = typeof ALL_SIGNS[number]

// 惑星1つ分の座標
export class PlanetPosition {
  private INTERVAL = 30 as const

  static async getInstance(julday_ut: number, planet: PlanetName) {
    const position = await eclipticPosition(julday_ut, planet)
    return new PlanetPosition(position.longitude)
  }

  constructor(readonly longitude: number) {}

  get degrees() {
    return this.longitude % this.INTERVAL
  }

  get formattedDegrees() {
    const degreesInt = Math.trunc(this.degrees)
    const degreesStr = `${String(degreesInt).padStart(2)}°`

    const MINUTE = 60
    const degreesMin = (this.degrees - degreesInt) * MINUTE
    const degreesMinInt = Math.trunc(degreesMin)
    const degreesMinStr = `${String(degreesMinInt).padStart(2, '0')}′`

    const degreesSec = (degreesMin - degreesMinInt) * MINUTE
    const degreesSecInt = Math.round(degreesSec)
    const degreesSecStr = `${String(degreesSecInt).padStart(2, '0')}″`

    return degreesStr + degreesMinStr + degreesSecStr
  }

  get sign() {
    let index = Math.trunc(this.longitude / this.INTERVAL)
    if (this.degrees === 0) {
      index = index > 0 ? index - 1 : ALL_SIGNS.length - 1
    }
    return ALL_SIGNS[index]
  }
}

// 全惑星の座標
export class PlanetPositions {
  readonly sun: PlanetPosition
  readonly moon: PlanetPosition
  readonly mercury: PlanetPosition
  readonly venus: PlanetPosition
  readonly mars: PlanetPosition
  readonly jupiter: PlanetPosition
  readonly saturn: PlanetPosition
  readonly uranus: PlanetPosition
  readonly neptune: PlanetPosition
  readonly pluto: PlanetPosition

  static async getInstance(date: Date) {
    const julday_ut = await julday(date)

    const positions = await Promise.all(
      ALL_PLANETS.map(async (planet) => {
        const planetPosition = await PlanetPosition.getInstance(julday_ut, planet)
        return [planet, planetPosition] as [PlanetName, PlanetPosition]
      })
    )
    const positionsMap = Object.fromEntries(positions) as Record<PlanetName, PlanetPosition>
    return new PlanetPositions(positionsMap)
  }

  constructor(readonly all: Record<PlanetName, PlanetPosition>) {
    this.sun = all.sun
    this.moon = all.moon
    this.mercury = all.mercury
    this.venus = all.venus
    this.mars = all.mars
    this.jupiter = all.jupiter
    this.saturn = all.saturn
    this.uranus = all.uranus
    this.neptune = all.neptune
    this.pluto = all.pluto
  }
}
