import { Horoscope } from '../../src/horoscope/Horoscope'

describe('Horoscope', () => {
  const funadyBirthday = new Date('1987-09-08T08:53:00+09:00')

  it('longitude', async () => {
    const horoscope = await Horoscope.getInstance(funadyBirthday)
    expect(horoscope.sun.longitude).toEqual(164.8173372478)
    expect(horoscope.moon.longitude).toEqual(348.0623527931)
    expect(horoscope.mercury.longitude).toEqual(180.6773808524)
    expect(horoscope.venus.longitude).toEqual(169.1128586411)
    expect(horoscope.mars.longitude).toEqual(160.292990171)
    expect(horoscope.jupiter.longitude).toEqual(29.1256981836)
    expect(horoscope.saturn.longitude).toEqual(254.8456615537)
    expect(horoscope.uranus.longitude).toEqual(262.7351126192)
    expect(horoscope.neptune.longitude).toEqual(275.2538857353)
    expect(horoscope.pluto.longitude).toEqual(217.8903727536)
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
