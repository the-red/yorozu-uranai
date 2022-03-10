import { julday, eclipticPosition, calcHouses, houseSystemName, localSiderealTime } from '../../src/horoscope/swisseph'

describe('swisseph', () => {
  const funadyBirthday = new Date('1987-09-08T08:53:00+09:00')
  const funadyBirthLat = 43.0666666666666666 // 43°04′
  const funadyBirthLon = 141.35 // 141°21′

  describe('ユリウス日', () => {
    it('ユリウス日', async () => {
      expect(await julday(funadyBirthday)).toEqual(2447046.4951388887)
    })
  })

  describe('黄道座標', () => {
    it('太陽', async () => {
      expect(await eclipticPosition(await julday(funadyBirthday), 'sun')).toEqual({
        latitude: -0.000063,
        latitudeSpeed: 0.00004,
        longitude: 164.817337,
        longitudeSpeed: 0.970187,
        distance: 1.007604,
        distanceSpeed: -0.000254,
        rflag: 260,
        isRetrograde: false,
      })
    })
    it('月', async () => {
      expect(await eclipticPosition(await julday(funadyBirthday), 'moon')).toEqual({
        latitude: -1.303161,
        latitudeSpeed: 1.30799,
        longitude: 348.062352,
        longitudeSpeed: 14.677112,
        distance: 0.002432,
        distanceSpeed: 0.00002,
        rflag: 260,
        isRetrograde: false,
      })
    })
    it('海王星', async () => {
      expect(await eclipticPosition(await julday(funadyBirthday), 'neptune')).toEqual({
        latitude: 1.018576,
        latitudeSpeed: -0.000705,
        longitude: 275.253885,
        longitudeSpeed: -0.005075,
        distance: 29.866133,
        distanceSpeed: 0.015932,
        rflag: 260,
        isRetrograde: true,
      })
    })
  })

  describe('ハウス', () => {
    it('プラシーダス（デフォルト）', async () => {
      expect(await calcHouses(await julday(funadyBirthday), funadyBirthLat, funadyBirthLon)).toEqual({
        house: [
          207.908591, 235.781911, 268.307258, 303.803709, 337.205891, 5.251311, 27.908591, 55.781911, 88.307258,
          123.803709, 157.205891, 185.251311,
        ],
        ascendant: 207.908591,
        mc: 123.803709,
        armc: 126.121101,
        vertex: 61.847894,
        equatorialAscendant: 218.500087,
        kochCoAscendant: 237.939031,
        munkaseyCoAscendant: 206.8052,
        munkaseyPolarAscendant: 57.939031,
      })
    })

    it('コッホ', async () => {
      expect(await calcHouses(await julday(funadyBirthday), funadyBirthLat, funadyBirthLon, 'K')).toEqual({
        house: [
          207.908591, 235.809886, 265.452867, 303.803709, 331.708461, 359.806556, 27.908591, 55.809886, 85.452867,
          123.803709, 151.708461, 179.806556,
        ],
        ascendant: 207.908591,
        mc: 123.803709,
        armc: 126.121101,
        vertex: 61.847894,
        equatorialAscendant: 218.500087,
        kochCoAscendant: 237.939031,
        munkaseyCoAscendant: 206.8052,
        munkaseyPolarAscendant: 57.939031,
      })
    })

    it('ハウスシステム名', async () => {
      expect(houseSystemName('A')).toEqual('equal')
      expect(houseSystemName()).toEqual('Placidus')
    })
  })

  describe('地方恒星時', () => {
    it('地方恒星時', async () => {
      const okinaMegumiBirthday = new Date('1979-08-06T14:55:00+09:00')
      // const okinaMegumiBirthLat = 34.38333333333333 // 34°23′
      const okinaMegumiBirthLon = 132.45 // 132°27′

      const julday_ut = await julday(okinaMegumiBirthday)
      const result = await localSiderealTime(julday_ut, okinaMegumiBirthLon)
      expect(result).toBe(11.691984808056366)
    })
  })
})
