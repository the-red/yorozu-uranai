import { julday, eclipticPosition, calcHouses, isAsteroidRange } from '../../astronomy'
import { Horoscope, HoroscopeProps } from './Horoscope'
import { ALL_PLANETS } from './ALL_PLANETS'
import { ASTEROID_NAMES } from './Asteroid'
import { HOUSE_SYSTEM_CODES, getSolarSignCusps } from './HouseSystem'
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

  // NOTE: ソーラーサインは、Swiss Ephemeris に無い。Asc や Mc はホールサインで求めて（ハウスシステムに依らない）、
  // カスプだけを、太陽の位置から作る
  const isSolarSign = hsys === HOUSE_SYSTEM_CODES.solarSign
  const houses: Houses = await calcHouses(julday_ut, geolat, geolon, isSolarSign ? HOUSE_SYSTEM_CODES.wholeSign : hsys)
  if (isSolarSign) {
    const sun = positions.find(([name]) => name === 'sun')![1]
    houses.house = getSolarSignCusps(sun.longitude)
  }
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
