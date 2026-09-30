import { julday, eclipticPosition, calcHouses, isAsteroidRange } from '../../astronomy'
import { Horoscope, HoroscopeProps } from './Horoscope'
import { ALL_PLANETS } from './ALL_PLANETS'
import { ASTEROID_NAMES } from './Asteroid'
import type { AsteroidName, PlanetName, EclipticPosition, Houses } from '../../astronomy/types'

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
  const node = await eclipticPosition(julday_ut, 'trueNode')
  const lilith = await eclipticPosition(julday_ut, 'meanApogee')

  // NOTE: 範囲の中で計算に失敗したら、エラーにする。天体暦のファイルが、配置されていない場合など
  const asteroids = isAsteroidRange(julday_ut)
    ? await Promise.all(
        ASTEROID_NAMES.map(async (name) => {
          const position = await eclipticPosition(julday_ut, name)
          return [name, position] as [AsteroidName, EclipticPosition]
        })
      )
    : null
  return { positions, houses, node, lilith, asteroids }
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
