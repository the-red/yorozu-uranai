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
        latitude: -0.0000631356298,
        longitude: 164.8173372478783,
        distance: 1.0076045962704,
        latitudeSpeed: 0.0000406973617,
        longitudeSpeed: 0.9701875737154,
        distanceSpeed: -0.0002542953733,
        rflag: 260,
        isRetrograde: false,
      })
    })
    it('月', async () => {
      expect(await eclipticPosition(await julday(funadyBirthday), 'moon')).toEqual({
        latitude: -1.3031616339283,
        longitude: 348.062352793152,
        distance: 0.0024320780978,
        latitudeSpeed: 1.3079900219479,
        longitudeSpeed: 14.677112523805,
        distanceSpeed: 0.0000203226304,
        rflag: 260,
        isRetrograde: false,
      })
    })
    it('海王星', async () => {
      expect(await eclipticPosition(await julday(funadyBirthday), 'neptune')).toEqual({
        latitude: 1.0185764917632,
        longitude: 275.253885735327,
        distance: 29.8661333334448,
        latitudeSpeed: -0.000705637518,
        longitudeSpeed: -0.0050754974618,
        distanceSpeed: 0.0159323926597,
        rflag: 260,
        isRetrograde: true,
      })
    })
  })

  describe('ハウス', () => {
    it('プラシーダス（デフォルト）', async () => {
      expect(await houses(await julday(funadyBirthday), funadyBirthLat, funadyBirthLon)).toEqual({
        house: [
          207.9085910207533,
          235.7819113991815,
          268.3072585405578,
          303.8037098326129,
          337.2058910313948,
          5.2513113691624,
          27.9085910207533,
          55.7819113991815,
          88.3072585405578,
          123.8037098326129,
          157.2058910313948,
          185.2513113691624,
        ],
        ascendant: 207.9085910207533,
        mc: 123.8037098326129,
        armc: 126.1211012093686,
        vertex: 61.8478942741284,
        equatorialAscendant: 218.500087985041,
        kochCoAscendant: 237.9390313560774,
        munkaseyCoAscendant: 206.8052002395509,
        munkaseyPolarAscendant: 57.9390313560774,
      })
    })

    it('コッホ', async () => {
      expect(await houses(await julday(funadyBirthday), funadyBirthLat, funadyBirthLon, 'K')).toEqual({
        house: [
          207.9085910207533,
          235.809886430504,
          265.4528673757609,
          303.8037098326129,
          331.7084611536428,
          359.8065566362668,
          27.9085910207533,
          55.809886430504,
          85.4528673757608,
          123.8037098326129,
          151.7084611536428,
          179.8065566362668,
        ],
        ascendant: 207.9085910207533,
        mc: 123.8037098326129,
        armc: 126.1211012093686,
        vertex: 61.8478942741284,
        equatorialAscendant: 218.500087985041,
        kochCoAscendant: 237.9390313560774,
        munkaseyCoAscendant: 206.8052002395509,
        munkaseyPolarAscendant: 57.9390313560774,
      })
    })

    it('ハウスシステム名', async () => {
      expect(houseSystemName('A')).toEqual('equal')
      expect(houseSystemName()).toEqual('Placidus')
    })
  })
})
