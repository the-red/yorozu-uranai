import { Planet } from './Planet'
import { Horoscope, HoroscopeProps } from './Horoscope'
import type { PlanetName, Houses } from './types'

const ALL_PLANETS = [
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

export const getHoroscopeProps = async (
  date: Date,
  geolat: number,
  geolon: number,
  hsys: string = ''
): Promise<HoroscopeProps> => {
  const { julday, eclipticPosition, calcHouses } = await import('./swisseph')

  const julday_ut = await julday(date)

  const positions = await Promise.all(
    ALL_PLANETS.map(async (planetName) => {
      const position = await eclipticPosition(julday_ut, planetName)
      const planet = new Planet(position.longitude, planetName)
      return [planetName, planet] as [PlanetName, Planet]
    })
  )
  const positionsMap = Object.fromEntries(positions) as Record<PlanetName, Planet>

  const houses: Houses = await calcHouses(julday_ut, geolat, geolon, hsys)
  return { positionsMap, houses }
}

export const getHoroscopeInstance = async (date: Date, geolat: number, geolon: number, hsys: string = '') => {
  const props = await getHoroscopeProps(date, geolat, geolon, hsys)
  return new Horoscope(props)
}
