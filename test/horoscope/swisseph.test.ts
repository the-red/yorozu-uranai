import { julday, eclipticPosition, houses, houseSystemName } from '../../src/horoscope/swisseph'

describe('swisseph', () => {
  const funadyBirthday = new Date('1987-09-08T08:53:00+09:00')
  const funadyBirthLat = 43.0666666666666666 // 43°04′
  const funadyBirthLon = 141.35 // 141°21′

  describe('黄道座標', () => {
    it('太陽', async () => {
      expect(await eclipticPosition(await julday(funadyBirthday), 'sun')).toEqual({
        distance: 1.007604596270388,
        distanceSpeed: -0.00025429537328022545,
        latitude: -0.00006313562977911692,
        latitudeSpeed: 0.00004069736167083942,
        longitude: 164.81733724787827,
        longitudeSpeed: 0.9701875737153962,
        rflag: 260,
      })
    })
    it('月', async () => {
      expect(await eclipticPosition(await julday(funadyBirthday), 'moon')).toEqual({
        latitude: -1.3031616339282852,
        longitude: 348.062352793152,
        distance: 0.002432078097773855,
        latitudeSpeed: 1.3079900219071734,
        longitudeSpeed: 14.677112523678339,
        distanceSpeed: 0.00002032263041767712,
        rflag: 260,
      })
    })
    it('天王星', async () => {
      expect(await eclipticPosition(await julday(funadyBirthday), 'uranus')).toEqual({
        latitude: -0.15848633834193857,
        longitude: 262.7351126192776,
        distance: 19.06390534663185,
        latitudeSpeed: -0.000024813878868292088,
        longitudeSpeed: 0.005383490011894379,
        distanceSpeed: 0.01690557805114359,
        rflag: 260,
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
