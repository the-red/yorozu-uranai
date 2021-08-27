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

type PlanetsMap = Record<PlanetName, Planet>

export type HoroscopeProps = { positionsMap: PlanetsMap; houses: Houses | undefined }

// 全惑星の座標
export class Horoscope {
  readonly planets: PlanetsMap
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
    this.planets = positionsMap
    this.houses = houses
  }
}
