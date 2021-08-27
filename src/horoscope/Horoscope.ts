import { julday, eclipticPosition, calcHouses, Houses } from './swisseph'
import { Planet, PlanetName } from './Planet'

export const ALL_PLANETS = [
  'sun',
  'moon',
  'mercury',
  'venus',
  'mars',
  'jupiter',
  'saturn',
  'uranus',
  'neptune',
  'pluto',
] as const

type HoroscopeProps = { positionsMap: Record<PlanetName, Planet>; houses: Houses | undefined }

// 全惑星の座標
export class Horoscope {
  readonly sun: Planet
  readonly moon: Planet
  readonly mercury: Planet
  readonly venus: Planet
  readonly mars: Planet
  readonly jupiter: Planet
  readonly saturn: Planet
  readonly uranus: Planet
  readonly neptune: Planet
  readonly pluto: Planet
  readonly houses: Houses | undefined

  static async getHoroscopeProps(
    date: Date,
    geolat?: number,
    geolon?: number,
    hsys: string = ''
  ): Promise<HoroscopeProps> {
    const julday_ut = await julday(date)

    const positions = await Promise.all(
      ALL_PLANETS.map(async (planetName) => {
        const position = await eclipticPosition(julday_ut, planetName)
        const planet = new Planet(position.longitude, planetName)
        return [planetName, planet] as [PlanetName, Planet]
      })
    )
    const positionsMap = Object.fromEntries(positions) as Record<PlanetName, Planet>

    const houses: Houses | undefined = geolat && geolon ? await calcHouses(julday_ut, geolat, geolon, hsys) : undefined
    return { positionsMap, houses }
  }

  // TODO: 省略されたときに良い感じにする
  static async getInstance(date: Date, geolat?: number, geolon?: number, hsys: string = '') {
    const props = await Horoscope.getHoroscopeProps(date, geolat, geolon, hsys)
    return new Horoscope(props)
  }

  constructor({ positionsMap, houses }: HoroscopeProps) {
    this.sun = positionsMap.sun
    this.moon = positionsMap.moon
    this.mercury = positionsMap.mercury
    this.venus = positionsMap.venus
    this.mars = positionsMap.mars
    this.jupiter = positionsMap.jupiter
    this.saturn = positionsMap.saturn
    this.uranus = positionsMap.uranus
    this.neptune = positionsMap.neptune
    this.pluto = positionsMap.pluto

    this.houses = houses
  }
}
