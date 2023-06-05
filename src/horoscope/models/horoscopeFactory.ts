import { julday, eclipticPosition, calcHouses } from '../../astronomy'
import { Horoscope, HoroscopeProps } from './Horoscope'
import { ALL_PLANETS } from './ALL_PLANETS'
import type { PlanetName, EclipticPosition, Houses } from '../../astronomy/types'

export const getHoroscopeProps = async (
  date: Date,
  geolat: number,
  geolon: number,
  hsys: string = ''
): Promise<HoroscopeProps> => {
  const julday_ut = await julday(date)

  const positions = await Promise.all(
    ALL_PLANETS.map(async (planetName) => {
      const position = await eclipticPosition(julday_ut, planetName)
      return [planetName, position] as [PlanetName, EclipticPosition]
    })
  )

  const houses: Houses = await calcHouses(julday_ut, geolat, geolon, hsys)
  return { positions, houses }
}

export const getHoroscopeInstance = async (
  date: Date,
  geolat: number,
  geolon: number,
  hsys: string = ''
): Promise<Horoscope> => {
  const props = await getHoroscopeProps(date, geolat, geolon, hsys)
  return new Horoscope(props)
}
