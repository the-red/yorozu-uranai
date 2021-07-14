import { julday, eclipticPosition, houses, houseName } from '../../src/horoscope/swisseph'

describe('swisseph', () => {
  const funadyBirthday = new Date('1987-09-08T08:53:00+09:00')

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
        distance: 0.002432078097773855,
        distanceSpeed: 0.00002032263041767712,
        latitude: -1.3031616339282852,
        latitudeSpeed: 1.3079900219071734,
        longitude: 348.062352793152,
        longitudeSpeed: 14.677112523678339,
        rflag: 260,
      })
    })
  })

  describe('ハウス', () => {
    it('プラシーダス（デフォルト）', async () => {
      expect(await houses(await julday(funadyBirthday))).toEqual({
        armc: 344.77110120936857,
        ascendant: 75.97652436522719,
        equatorialAscendant: 75.97652436522719,
        house: [
          75.97652436522719,
          105.4932191207119,
          134.26397918272784,
          163.4727945776035,
          193.92081041421886,
          225.1964179401407,
          255.9765243652272,
          285.4932191207119,
          314.26397918272784,
          343.4727945776035,
          13.920810414218863,
          45.19641794014069,
        ],
        kochCoAscendant: 75.97652436522719,
        mc: 343.47279457760345,
        munkaseyCoAscendant: 180,
        munkaseyPolarAscendant: 255.9765243652272,
        vertex: 180,
      })
    })

    it('コッホ', async () => {
      expect(await houses(await julday(funadyBirthday), 0, 0, 'K')).toEqual({
        armc: 344.77110120936857,
        ascendant: 75.97652436522719,
        equatorialAscendant: 75.97652436522719,
        house: [
          75.97652436522719,
          103.59896686851516,
          132.30692418822358,
          163.4727945776035,
          196.03442532325167,
          227.23697195087027,
          255.9765243652272,
          283.59896686851516,
          312.30692418822355,
          343.47279457760345,
          16.03442532325167,
          47.23697195087028,
        ],
        kochCoAscendant: 75.97652436522719,
        mc: 343.47279457760345,
        munkaseyCoAscendant: 180,
        munkaseyPolarAscendant: 255.9765243652272,
        vertex: 180,
      })
    })

    it('ハウスシステム名', async () => {
      expect(houseName('A')).toEqual('equal')
      expect(houseName()).toEqual('Placidus')
    })
  })
})
