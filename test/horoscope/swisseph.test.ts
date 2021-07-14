import { julday, eclipticPosition, houses, houseSystemName } from '../../src/horoscope/swisseph'

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
        latitude: -0.0000631356,
        latitudeSpeed: 0.0000406973,
        longitude: 164.8173372478,
        longitudeSpeed: 0.9701875737,
        distance: 1.0076045962,
        distanceSpeed: -0.0002542953,
        rflag: 260,
        isRetrograde: false,
      })
    })
    it('月', async () => {
      expect(await eclipticPosition(await julday(funadyBirthday), 'moon')).toEqual({
        latitude: -1.3031616339,
        latitudeSpeed: 1.3079900219,
        longitude: 348.0623527931,
        longitudeSpeed: 14.6771125236,
        distance: 0.002432078,
        distanceSpeed: 0.0000203226,
        rflag: 260,
        isRetrograde: false,
      })
    })
    it('海王星', async () => {
      expect(await eclipticPosition(await julday(funadyBirthday), 'neptune')).toEqual({
        latitude: 1.0185764917,
        latitudeSpeed: -0.000705626,
        longitude: 275.2538857353,
        longitudeSpeed: -0.0050755,
        distance: 29.8661333334,
        distanceSpeed: 0.0159323977,
        rflag: 260,
        isRetrograde: true,
      })
    })
  })

  describe('ハウス', () => {
    it('プラシーダス（デフォルト）', async () => {
      expect(await houses(await julday(funadyBirthday), funadyBirthLat, funadyBirthLon)).toEqual({
        house: [
          207.9085910207,
          235.7819113991,
          268.3072585405,
          303.8037098326,
          337.2058910313,
          5.2513113691,
          27.9085910207,
          55.7819113991,
          88.3072585405,
          123.8037098326,
          157.2058910313,
          185.2513113691,
        ],
        ascendant: 207.9085910207,
        mc: 123.8037098326,
        armc: 126.1211012093,
        vertex: 61.8478942741,
        equatorialAscendant: 218.500087985,
        kochCoAscendant: 237.939031356,
        munkaseyCoAscendant: 206.8052002395,
        munkaseyPolarAscendant: 57.939031356,
      })
    })

    it('コッホ', async () => {
      expect(await houses(await julday(funadyBirthday), funadyBirthLat, funadyBirthLon, 'K')).toEqual({
        house: [
          207.9085910207,
          235.8098864305,
          265.4528673757,
          303.8037098326,
          331.7084611536,
          359.8065566362,
          27.9085910207,
          55.8098864305,
          85.4528673757,
          123.8037098326,
          151.7084611536,
          179.8065566362,
        ],
        ascendant: 207.9085910207,
        mc: 123.8037098326,
        armc: 126.1211012093,
        vertex: 61.8478942741,
        equatorialAscendant: 218.500087985,
        kochCoAscendant: 237.939031356,
        munkaseyCoAscendant: 206.8052002395,
        munkaseyPolarAscendant: 57.939031356,
      })
    })

    it('ハウスシステム名', async () => {
      expect(houseSystemName('A')).toEqual('equal')
      expect(houseSystemName()).toEqual('Placidus')
    })
  })
})
