import { getHoroscopeInstance } from '../../src/horoscope/horoscopeFactory'

describe('Horoscope', () => {
  const funadyBirthday = new Date('1987-09-08T08:53:00+09:00')
  const funadyBirthLat = 43.0666666666666666 // 43°04′
  const funadyBirthLon = 141.35 // 141°21′

  describe('planets', () => {
    it('longitude', async () => {
      const { planets } = await getHoroscopeInstance(funadyBirthday, funadyBirthLat, funadyBirthLon)
      expect(planets.sun.longitude).toEqual(164.817337)
      expect(planets.moon.longitude).toEqual(348.062352)
      expect(planets.mercury.longitude).toEqual(180.67738)
      expect(planets.venus.longitude).toEqual(169.112858)
      expect(planets.mars.longitude).toEqual(160.29299)
      expect(planets.jupiter.longitude).toEqual(29.125698)
      expect(planets.saturn.longitude).toEqual(254.845661)
      expect(planets.uranus.longitude).toEqual(262.735112)
      expect(planets.neptune.longitude).toEqual(275.253885)
      expect(planets.pluto.longitude).toEqual(217.890372)
    })

    it('sign', async () => {
      const { planets } = await getHoroscopeInstance(funadyBirthday, funadyBirthLat, funadyBirthLon)
      expect(planets.sun.sign).toEqual('乙女座')
      expect(planets.moon.sign).toEqual('魚座')
      expect(planets.mercury.sign).toEqual('天秤座')
      expect(planets.venus.sign).toEqual('乙女座')
      expect(planets.mars.sign).toEqual('乙女座')
      expect(planets.jupiter.sign).toEqual('牡羊座')
      expect(planets.saturn.sign).toEqual('射手座')
      expect(planets.uranus.sign).toEqual('射手座')
      expect(planets.neptune.sign).toEqual('山羊座')
      expect(planets.pluto.sign).toEqual('蠍座')
    })

    it('formattedDegrees', async () => {
      const { planets } = await getHoroscopeInstance(funadyBirthday, funadyBirthLat, funadyBirthLon)
      expect(planets.sun.formattedDegrees).toEqual('14°49′02″')
      expect(planets.moon.formattedDegrees).toEqual('18°03′44″')
      expect(planets.mercury.formattedDegrees).toEqual(' 0°40′39″')
      expect(planets.venus.formattedDegrees).toEqual('19°06′46″')
      expect(planets.mars.formattedDegrees).toEqual('10°17′35″')
      expect(planets.jupiter.formattedDegrees).toEqual('29°07′33″R')
      expect(planets.saturn.formattedDegrees).toEqual('14°50′44″')
      expect(planets.uranus.formattedDegrees).toEqual('22°44′06″')
      expect(planets.neptune.formattedDegrees).toEqual(' 5°15′14″R')
      expect(planets.pluto.formattedDegrees).toEqual(' 7°53′25″')
    })

    it('coordinate', async () => {
      const { planets } = await getHoroscopeInstance(funadyBirthday, funadyBirthLat, funadyBirthLon)
      expect(planets.sun.coordinate).toEqual({ x: 0.965095785521996, y: 0.26189716448957856 })
      expect(planets.moon.coordinate).toEqual({ x: -0.9783732809057316, y: -0.20684710104266457 })
      expect(planets.mercury.coordinate).toEqual({ x: 0.9999301149274349, y: -0.011822235880189675 })
      expect(planets.venus.coordinate).toEqual({ x: 0.9820011237165059, y: 0.1888750725202235 })
      expect(planets.mars.coordinate).toEqual({ x: 0.9414292949764493, y: 0.33721044254314764 })
      expect(planets.jupiter.coordinate).toEqual({ x: -0.8735540065837044, y: 0.4867272311896646 })
      expect(planets.saturn.coordinate).toEqual({ x: 0.26142004024630655, y: -0.9652251356847372 })
      expect(planets.uranus.coordinate).toEqual({ x: 0.12645673202073257, y: -0.991972124067323 })
      expect(planets.neptune.coordinate).toEqual({ x: -0.09156914004318954, y: -0.9957987209229336 })
      expect(planets.pluto.coordinate).toEqual({ x: 0.7891872983628521, y: -0.6141525934999728 })
    })
  })

  describe('houses', () => {
    it('プラシーダス（デフォルト）', async () => {
      const { houses } = await getHoroscopeInstance(funadyBirthday, funadyBirthLat, funadyBirthLon)
      expect(houses).toEqual({
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
      const { houses } = await getHoroscopeInstance(funadyBirthday, funadyBirthLat, funadyBirthLon, 'K')
      expect(houses).toEqual({
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
  })
})
