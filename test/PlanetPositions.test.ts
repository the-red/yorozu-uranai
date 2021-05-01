import { PlanetPositions } from '../src/PlanetPositions'

describe('PlanetPositions', () => {
  const funadyBirthday = new Date('1987-09-08T08:53:00+09:00')

  it('fullDegrees', async () => {
    const planetPositions = await PlanetPositions.getInstance(funadyBirthday)
    expect(planetPositions.sun.fullDegrees).toEqual(164.81733724787827)
    expect(planetPositions.moon.fullDegrees).toEqual(348.062352793152)
    expect(planetPositions.mercury.fullDegrees).toEqual(180.6773808524685)
    expect(planetPositions.venus.fullDegrees).toEqual(169.1128586411532)
    expect(planetPositions.mars.fullDegrees).toEqual(160.29299017109622)
    expect(planetPositions.jupiter.fullDegrees).toEqual(29.12569818364847)
    expect(planetPositions.saturn.fullDegrees).toEqual(254.84566155370035)
    expect(planetPositions.uranus.fullDegrees).toEqual(262.7351126192776)
    expect(planetPositions.neptune.fullDegrees).toEqual(275.25388573532695)
    expect(planetPositions.pluto.fullDegrees).toEqual(217.8903727536004)
  })

  it('sign', async () => {
    const planetPositions = await PlanetPositions.getInstance(funadyBirthday)
    expect(planetPositions.sun.sign).toEqual(5)
    expect(planetPositions.moon.sign).toEqual(11)
    expect(planetPositions.mercury.sign).toEqual(6)
    expect(planetPositions.venus.sign).toEqual(5)
    expect(planetPositions.mars.sign).toEqual(5)
    expect(planetPositions.jupiter.sign).toEqual(0)
    expect(planetPositions.saturn.sign).toEqual(8)
    expect(planetPositions.uranus.sign).toEqual(8)
    expect(planetPositions.neptune.sign).toEqual(9)
    expect(planetPositions.pluto.sign).toEqual(7)
  })

  it('degrees', async () => {
    const planetPositions = await PlanetPositions.getInstance(funadyBirthday)
    expect(planetPositions.sun.degrees).toEqual('14°49′02″')
    expect(planetPositions.moon.degrees).toEqual('18°03′44″')
    expect(planetPositions.mercury.degrees).toEqual(' 0°40′39″')
    expect(planetPositions.venus.degrees).toEqual('19°06′46″')
    expect(planetPositions.mars.degrees).toEqual('10°17′35″')
    expect(planetPositions.jupiter.degrees).toEqual('29°07′33″')
    expect(planetPositions.saturn.degrees).toEqual('14°50′44″')
    expect(planetPositions.uranus.degrees).toEqual('22°44′06″')
    expect(planetPositions.neptune.degrees).toEqual(' 5°15′14″')
    expect(planetPositions.pluto.degrees).toEqual(' 7°53′25″')
  })
})
