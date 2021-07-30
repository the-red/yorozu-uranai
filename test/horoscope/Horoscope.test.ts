import { Horoscope } from '../../src/horoscope/Horoscope'

describe('Horoscope', () => {
  const funadyBirthday = new Date('1987-09-08T08:53:00+09:00')

  describe('planets', () => {
    it('longitude', async () => {
      const horoscope = await Horoscope.getInstance(funadyBirthday)
      expect(horoscope.sun.longitude).toEqual(164.817337)
      expect(horoscope.moon.longitude).toEqual(348.062352)
      expect(horoscope.mercury.longitude).toEqual(180.67738)
      expect(horoscope.venus.longitude).toEqual(169.112858)
      expect(horoscope.mars.longitude).toEqual(160.29299)
      expect(horoscope.jupiter.longitude).toEqual(29.125698)
      expect(horoscope.saturn.longitude).toEqual(254.845661)
      expect(horoscope.uranus.longitude).toEqual(262.735112)
      expect(horoscope.neptune.longitude).toEqual(275.253885)
      expect(horoscope.pluto.longitude).toEqual(217.890372)
    })

    it('sign', async () => {
      const horoscope = await Horoscope.getInstance(funadyBirthday)
      expect(horoscope.sun.sign).toEqual('乙女座')
      expect(horoscope.moon.sign).toEqual('魚座')
      expect(horoscope.mercury.sign).toEqual('天秤座')
      expect(horoscope.venus.sign).toEqual('乙女座')
      expect(horoscope.mars.sign).toEqual('乙女座')
      expect(horoscope.jupiter.sign).toEqual('牡羊座')
      expect(horoscope.saturn.sign).toEqual('射手座')
      expect(horoscope.uranus.sign).toEqual('射手座')
      expect(horoscope.neptune.sign).toEqual('山羊座')
      expect(horoscope.pluto.sign).toEqual('蠍座')
    })

    it('formattedDegrees', async () => {
      const horoscope = await Horoscope.getInstance(funadyBirthday)
      expect(horoscope.sun.formattedDegrees).toEqual('14°49′02″')
      expect(horoscope.moon.formattedDegrees).toEqual('18°03′44″')
      expect(horoscope.mercury.formattedDegrees).toEqual(' 0°40′39″')
      expect(horoscope.venus.formattedDegrees).toEqual('19°06′46″')
      expect(horoscope.mars.formattedDegrees).toEqual('10°17′35″')
      expect(horoscope.jupiter.formattedDegrees).toEqual('29°07′33″')
      expect(horoscope.saturn.formattedDegrees).toEqual('14°50′44″')
      expect(horoscope.uranus.formattedDegrees).toEqual('22°44′06″')
      expect(horoscope.neptune.formattedDegrees).toEqual(' 5°15′14″')
      expect(horoscope.pluto.formattedDegrees).toEqual(' 7°53′25″')
    })
  })

  describe('houses', () => {
    const funadyBirthLat = 43.0666666666666666 // 43°04′
    const funadyBirthLon = 141.35 // 141°21′

    it('省略', async () => {
      const horoscope = await Horoscope.getInstance(funadyBirthday)
      expect(horoscope.houses).toEqual(undefined)
    })
    it('プラシーダス（デフォルト）', async () => {
      const horoscope = await Horoscope.getInstance(funadyBirthday, funadyBirthLat, funadyBirthLon)
      expect(horoscope.houses).toEqual({
        house: [
          207.908591,
          235.781911,
          268.307258,
          303.803709,
          337.205891,
          5.251311,
          27.908591,
          55.781911,
          88.307258,
          123.803709,
          157.205891,
          185.251311,
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
      const horoscope = await Horoscope.getInstance(funadyBirthday, funadyBirthLat, funadyBirthLon, 'K')
      expect(horoscope.houses).toEqual({
        house: [
          207.908591,
          235.809886,
          265.452867,
          303.803709,
          331.708461,
          359.806556,
          27.908591,
          55.809886,
          85.452867,
          123.803709,
          151.708461,
          179.806556,
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
  })
})
