import { PlanetPosition, PlanetPositions } from '../src/PlanetPositions'

describe('PlanetPosition 星座の境界値', () => {
  it('0.0: 魚座', () => {
    const planetPosition = new PlanetPosition(0)
    expect(planetPosition.sign).toEqual('魚座')
    expect(planetPosition.degrees).toEqual(0)
  })
  it('0.5: 牡羊座', () => {
    const planetPosition = new PlanetPosition(0.5)
    expect(planetPosition.sign).toEqual('牡羊座')
    expect(planetPosition.degrees).toEqual(0.5)
  })
  it('60.0: 牡牛座', () => {
    const planetPosition = new PlanetPosition(60)
    expect(planetPosition.sign).toEqual('牡牛座')
    expect(planetPosition.degrees).toEqual(0)
  })
  it('61.89: 双子座', () => {
    const planetPosition = new PlanetPosition(61.89)
    expect(planetPosition.sign).toEqual('双子座')
    expect(planetPosition.degrees).toEqual(1.8900000000000006)
  })
})

describe('PlanetPositions', () => {
  const funadyBirthday = new Date('1987-09-08T08:53:00+09:00')

  it('longitude', async () => {
    const planetPositions = await PlanetPositions.getInstance(funadyBirthday)
    expect(planetPositions.sun.longitude).toEqual(164.81733724787827)
    expect(planetPositions.moon.longitude).toEqual(348.062352793152)
    expect(planetPositions.mercury.longitude).toEqual(180.6773808524685)
    expect(planetPositions.venus.longitude).toEqual(169.1128586411532)
    expect(planetPositions.mars.longitude).toEqual(160.29299017109622)
    expect(planetPositions.jupiter.longitude).toEqual(29.12569818364847)
    expect(planetPositions.saturn.longitude).toEqual(254.84566155370035)
    expect(planetPositions.uranus.longitude).toEqual(262.7351126192776)
    expect(planetPositions.neptune.longitude).toEqual(275.25388573532695)
    expect(planetPositions.pluto.longitude).toEqual(217.8903727536004)
  })

  it('sign', async () => {
    const planetPositions = await PlanetPositions.getInstance(funadyBirthday)
    expect(planetPositions.sun.sign).toEqual('乙女座')
    expect(planetPositions.moon.sign).toEqual('魚座')
    expect(planetPositions.mercury.sign).toEqual('天秤座')
    expect(planetPositions.venus.sign).toEqual('乙女座')
    expect(planetPositions.mars.sign).toEqual('乙女座')
    expect(planetPositions.jupiter.sign).toEqual('牡羊座')
    expect(planetPositions.saturn.sign).toEqual('射手座')
    expect(planetPositions.uranus.sign).toEqual('射手座')
    expect(planetPositions.neptune.sign).toEqual('山羊座')
    expect(planetPositions.pluto.sign).toEqual('蠍座')
  })

  it('formattedDegrees', async () => {
    const planetPositions = await PlanetPositions.getInstance(funadyBirthday)
    expect(planetPositions.sun.formattedDegrees).toEqual('14°49′02″')
    expect(planetPositions.moon.formattedDegrees).toEqual('18°03′44″')
    expect(planetPositions.mercury.formattedDegrees).toEqual(' 0°40′39″')
    expect(planetPositions.venus.formattedDegrees).toEqual('19°06′46″')
    expect(planetPositions.mars.formattedDegrees).toEqual('10°17′35″')
    expect(planetPositions.jupiter.formattedDegrees).toEqual('29°07′33″')
    expect(planetPositions.saturn.formattedDegrees).toEqual('14°50′44″')
    expect(planetPositions.uranus.formattedDegrees).toEqual('22°44′06″')
    expect(planetPositions.neptune.formattedDegrees).toEqual(' 5°15′14″')
    expect(planetPositions.pluto.formattedDegrees).toEqual(' 7°53′25″')
  })
})
