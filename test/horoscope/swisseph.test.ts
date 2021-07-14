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
          207.90859102075328,
          232.89132860893773,
          265.0234015616215,
          303.8037098326129,
          338.3750938357241,
          4.881007314670569,
          27.908591020753306,
          52.89132860893773,
          85.02340156162148,
          123.80370983261292,
          158.3750938357241,
          184.88100731467057,
        ],
        ascendant: 207.90859102075328,
        mc: 123.80370983261292,
        armc: 126.12110120936859,
        vertex: 61.84789427412842,
        equatorialAscendant: 218.50008798504103,
        kochCoAscendant: 237.93903135607738,
        munkaseyCoAscendant: 206.8052002395509,
        munkaseyPolarAscendant: 57.93903135607738,
      })
    })

    it('コッホ', async () => {
      expect(await houses(await julday(funadyBirthday), funadyBirthLat, funadyBirthLon, 'K')).toEqual({
        house: [
          207.90859102075328,
          235.80988643050398,
          265.45286737576083,
          303.8037098326129,
          331.70846115364276,
          359.8065566362668,
          27.908591020753306,
          55.80988643050398,
          85.45286737576083,
          123.80370983261292,
          151.70846115364276,
          179.80655663626678,
        ],
        ascendant: 207.90859102075328,
        mc: 123.80370983261292,
        armc: 126.12110120936859,
        vertex: 61.84789427412842,
        equatorialAscendant: 218.50008798504103,
        kochCoAscendant: 237.93903135607738,
        munkaseyCoAscendant: 206.8052002395509,
        munkaseyPolarAscendant: 57.93903135607738,
      })
    })

    it('ハウスシステム名', async () => {
      expect(houseSystemName('A')).toEqual('equal')
      expect(houseSystemName()).toEqual('Placidus')
    })
  })
})
