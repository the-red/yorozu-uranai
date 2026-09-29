import { describe, it, expect } from 'vitest'
import { Horoscope, HoroscopeProps, POINT_ORB, ORB, toHoroscopeResult } from '../../src/horoscope/models'
import { expectToBeCloseTo } from '../test-util'

// 1987-09-08 08:53 札幌生まれの計算結果（test/horoscope/Horoscope.test.ts と同じ）
const position = (longitude: number, isRetrograde = false) =>
  ({ longitude, isRetrograde }) as HoroscopeProps['positions'][number][1]
const props: HoroscopeProps = {
  positions: [
    ['sun', position(164.817337)],
    ['moon', position(348.062352)],
    ['mercury', position(180.67738)],
    ['venus', position(169.112858)],
    ['mars', position(160.29299)],
    ['jupiter', position(29.125698, true)],
    ['saturn', position(254.845661)],
    ['uranus', position(262.735112)],
    ['neptune', position(275.253885, true)],
    ['pluto', position(217.890372)],
  ],
  houses: {
    house: [
      207.908591, 235.781911, 268.307258, 303.803709, 337.205891, 5.251311, 27.908591, 55.781911, 88.307258, 123.803709,
      157.205891, 185.251311,
    ],
    ascendant: 207.908591,
    mc: 123.803709,
    armc: 126.121101,
    vertex: 61.847894,
    equatorialAscendant: 218.500087,
    kochCoAscendant: 237.939031,
    munkaseyCoAscendant: 206.8052,
    munkaseyPolarAscendant: 57.939031,
  },
  node: position(2.374847, true),
  lilith: position(122.301895),
  asteroids: [
    ['chiron', position(88.267633)],
    ['ceres', position(264.007846)],
    ['pallas', position(234.541557)],
    ['juno', position(326.419652, true)],
    ['vesta', position(108.71123)],
  ],
}

describe('ホロスコープ → JSON', () => {
  const result = toHoroscopeResult(new Horoscope(props), ORB, POINT_ORB)

  it('オーブは 6', () => {
    expect(ORB).toEqual(6)
    expect(result.aspects.orb).toEqual(6)
  })

  it('惑星', () => {
    expectToBeCloseTo(result.planets, [
      {
        name: 'sun',
        nameJa: '太陽',
        sign: '乙女座',
        degrees: 14.817337,
        longitude: 164.817337,
        isRetrograde: false,
        house: 11,
        element: 'earth',
        quality: 'mutable',
        polarity: 'feminine',
      },
      {
        name: 'moon',
        nameJa: '月',
        sign: '魚座',
        degrees: 18.062352,
        longitude: 348.062352,
        isRetrograde: false,
        house: 5,
        element: 'water',
        quality: 'mutable',
        polarity: 'feminine',
      },
      {
        name: 'mercury',
        nameJa: '水星',
        sign: '天秤座',
        degrees: 0.67738,
        longitude: 180.67738,
        isRetrograde: false,
        house: 11,
        element: 'air',
        quality: 'cardinal',
        polarity: 'masculine',
      },
      {
        name: 'venus',
        nameJa: '金星',
        sign: '乙女座',
        degrees: 19.112858,
        longitude: 169.112858,
        isRetrograde: false,
        house: 11,
        element: 'earth',
        quality: 'mutable',
        polarity: 'feminine',
      },
      {
        name: 'mars',
        nameJa: '火星',
        sign: '乙女座',
        degrees: 10.29299,
        longitude: 160.29299,
        isRetrograde: false,
        house: 11,
        element: 'earth',
        quality: 'mutable',
        polarity: 'feminine',
      },
      {
        name: 'jupiter',
        nameJa: '木星',
        sign: '牡羊座',
        degrees: 29.125698,
        longitude: 29.125698,
        isRetrograde: true,
        house: 7,
        element: 'fire',
        quality: 'cardinal',
        polarity: 'masculine',
      },
      {
        name: 'saturn',
        nameJa: '土星',
        sign: '射手座',
        degrees: 14.845661,
        longitude: 254.845661,
        isRetrograde: false,
        house: 2,
        element: 'fire',
        quality: 'mutable',
        polarity: 'masculine',
      },
      {
        name: 'uranus',
        nameJa: '天王星',
        sign: '射手座',
        degrees: 22.735112,
        longitude: 262.735112,
        isRetrograde: false,
        house: 2,
        element: 'fire',
        quality: 'mutable',
        polarity: 'masculine',
      },
      {
        name: 'neptune',
        nameJa: '海王星',
        sign: '山羊座',
        degrees: 5.253885,
        longitude: 275.253885,
        isRetrograde: true,
        house: 3,
        element: 'earth',
        quality: 'cardinal',
        polarity: 'feminine',
      },
      {
        name: 'pluto',
        nameJa: '冥王星',
        sign: '蠍座',
        degrees: 7.890372,
        longitude: 217.890372,
        isRetrograde: false,
        house: 1,
        element: 'water',
        quality: 'fixed',
        polarity: 'feminine',
      },
    ])
  })

  it('ハウス', () => {
    expectToBeCloseTo(result.houses.ascendant, { sign: '天秤座', degrees: 27.908591, longitude: 207.908591 })
    expectToBeCloseTo(result.houses.mc, { sign: '獅子座', degrees: 3.803709, longitude: 123.803709 })
    expect(result.houses.cusps.map((_) => _.house)).toEqual([1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12])
    expect(result.houses.cusps.map((_) => _.sign)).toEqual([
      '天秤座',
      '蠍座',
      '射手座',
      '水瓶座',
      '魚座',
      '牡羊座',
      '牡羊座',
      '牡牛座',
      '双子座',
      '獅子座',
      '乙女座',
      '天秤座',
    ])
    expectToBeCloseTo(result.houses.cusps[5], { house: 6, sign: '牡羊座', degrees: 5.251311, longitude: 5.251311 })
  })

  it('アスペクトは、惑星の組み合わせごとに1つ', () => {
    expect(result.aspects.major).toEqual([
      { planets: ['sun', 'moon'], name: 'opposition', degrees: 180, type: 'hard' },
      { planets: ['sun', 'venus'], name: 'conjunction', degrees: 0, type: 'hard' },
      { planets: ['sun', 'mars'], name: 'conjunction', degrees: 0, type: 'hard' },
      { planets: ['sun', 'saturn'], name: 'square', degrees: 90, type: 'hard' },
      { planets: ['moon', 'venus'], name: 'opposition', degrees: 180, type: 'hard' },
      { planets: ['moon', 'saturn'], name: 'square', degrees: 90, type: 'hard' },
      { planets: ['moon', 'uranus'], name: 'square', degrees: 90, type: 'hard' },
      { planets: ['mercury', 'neptune'], name: 'square', degrees: 90, type: 'hard' },
      { planets: ['venus', 'saturn'], name: 'square', degrees: 90, type: 'hard' },
      { planets: ['venus', 'uranus'], name: 'square', degrees: 90, type: 'hard' },
      { planets: ['mars', 'saturn'], name: 'square', degrees: 90, type: 'hard' },
      { planets: ['mars', 'neptune'], name: 'trine', degrees: 120, type: 'soft' },
      { planets: ['mars', 'pluto'], name: 'sextile', degrees: 60, type: 'soft' },
      { planets: ['neptune', 'pluto'], name: 'sextile', degrees: 60, type: 'soft' },
    ])
  })

  describe('感受点', () => {
    it('惑星とは別の項目にする', () => {
      expect(result.planets).toHaveLength(10)
      expect(result.planets.map((_) => _.name)).not.toContain('northNode')
    })

    it('位置', () => {
      expectToBeCloseTo(result.points, [
        {
          name: 'northNode',
          nameJa: 'ヘッド',
          type: 'node',
          variant: 'true',
          sign: '牡羊座',
          degrees: 2.374847,
          longitude: 2.374847,
          isRetrograde: true,
          house: 5,
        },
        {
          name: 'southNode',
          nameJa: 'テイル',
          type: 'node',
          variant: 'true',
          sign: '天秤座',
          degrees: 2.374847,
          longitude: 182.374847,
          isRetrograde: true,
          house: 11,
        },
        {
          name: 'lilith',
          nameJa: 'リリス',
          type: 'apogee',
          variant: 'mean',
          sign: '獅子座',
          degrees: 2.301895,
          longitude: 122.301895,
          isRetrograde: false,
          house: 9,
        },
        {
          name: 'vertex',
          nameJa: 'Vx',
          type: 'angle',
          variant: null,
          sign: '双子座',
          degrees: 1.847894,
          longitude: 61.847894,
          isRetrograde: false,
          house: 8,
        },
        {
          name: 'partOfFortune',
          nameJa: 'PoF',
          type: 'lot',
          variant: 'day',
          sign: '牡牛座',
          degrees: 1.153606,
          longitude: 31.153606,
          isRetrograde: false,
          house: 7,
        },
      ])
    })

    it('夜生まれの PoF は、式を変える', () => {
      // 太陽を 250度（2ハウス）に置く
      const night: HoroscopeProps = {
        ...props,
        positions: props.positions.map(([name, current]) => [name, name === 'sun' ? position(250) : current]),
      }
      const { points } = toHoroscopeResult(new Horoscope(night), ORB, POINT_ORB)
      expectToBeCloseTo(points[4], {
        name: 'partOfFortune',
        nameJa: 'PoF',
        type: 'lot',
        variant: 'night',
        sign: '蟹座',
        degrees: 19.846239,
        longitude: 109.846239,
        isRetrograde: false,
        house: 9,
      })
    })

    it('惑星とのコンジャンクション', () => {
      expect(result.aspects.pointOrb).toEqual(3)
      // テイル（182.37度）と水星（180.68度）、PoF（31.15度）と木星（29.13度）
      expect(result.aspects.points).toEqual([
        { point: 'southNode', planet: 'mercury', name: 'conjunction', degrees: 0 },
        { point: 'partOfFortune', planet: 'jupiter', name: 'conjunction', degrees: 0 },
      ])
    })

    it('惑星どうしのアスペクトには、含めない', () => {
      const names = result.aspects.major.flatMap((_) => _.planets)
      expect(names).not.toContain('northNode')
      expect(names).not.toContain('southNode')
      expect(names).not.toContain('lilith')
      expect(names).not.toContain('vertex')
      expect(names).not.toContain('partOfFortune')
      expect(result.aspects.major).toHaveLength(14)
    })

    it('オーブを変えると、コンジャンクションが変わる', () => {
      const { aspects } = toHoroscopeResult(new Horoscope(props), ORB, 1)
      expect(aspects.pointOrb).toEqual(1)
      expect(aspects.points).toEqual([])
    })
  })

  describe('小惑星とキロン', () => {
    it('位置', () => {
      expectToBeCloseTo(result.asteroids, [
        {
          name: 'chiron',
          nameJa: 'キロン',
          type: 'centaur',
          sign: '双子座',
          degrees: 28.267633,
          longitude: 88.267633,
          isRetrograde: false,
          house: 8,
        },
        {
          name: 'ceres',
          nameJa: 'セレス',
          type: 'asteroid',
          sign: '射手座',
          degrees: 24.007846,
          longitude: 264.007846,
          isRetrograde: false,
          house: 2,
        },
        {
          name: 'pallas',
          nameJa: 'パラス',
          type: 'asteroid',
          sign: '蠍座',
          degrees: 24.541557,
          longitude: 234.541557,
          isRetrograde: false,
          house: 1,
        },
        {
          name: 'juno',
          nameJa: 'ジュノ',
          type: 'asteroid',
          sign: '水瓶座',
          degrees: 26.419652,
          longitude: 326.419652,
          isRetrograde: true,
          house: 4,
        },
        {
          name: 'vesta',
          nameJa: 'ベスタ',
          type: 'asteroid',
          sign: '蟹座',
          degrees: 18.71123,
          longitude: 108.71123,
          isRetrograde: false,
          house: 9,
        },
      ])
    })

    it('惑星とのコンジャンクション', () => {
      // セレス（264.01度）と、天王星（262.74度）。オーブは、感受点と同じ
      expect(result.aspects.asteroids).toEqual([
        { asteroid: 'ceres', planet: 'uranus', name: 'conjunction', degrees: 0 },
      ])
    })

    it('惑星と、感受点には、含めない', () => {
      expect(result.planets).toHaveLength(10)
      expect(result.points).toHaveLength(5)
      expect([...result.planets, ...result.points].map((_) => _.name)).not.toContain('chiron')
      expect(result.aspects.major).toHaveLength(14)
    })

    it('計算できない日付では、null にする', () => {
      const { asteroids, aspects, planets, points } = toHoroscopeResult(
        new Horoscope({ ...props, asteroids: null }),
        ORB,
        POINT_ORB
      )
      expect(asteroids).toBeNull()
      expect(aspects.asteroids).toEqual([])
      expect(planets).toHaveLength(10)
      expect(points).toHaveLength(5)
    })
  })

  it('オーブを変えると、アスペクトが変わる', () => {
    const { aspects } = toHoroscopeResult(new Horoscope(props), 1, POINT_ORB)
    expect(aspects.orb).toEqual(1)
    expect(aspects.major.map((_) => _.planets)).toEqual([['sun', 'saturn']])
  })

  it('モデルがハウスを返さない惑星は、house を null にする', () => {
    const noCusps: HoroscopeProps = { ...props, houses: { ...props.houses, house: [] } }
    const { planets, points, asteroids } = toHoroscopeResult(new Horoscope(noCusps), ORB, POINT_ORB)
    expect(planets.map((_) => _.house)).toEqual(Array(10).fill(null))
    expect(points.map((_) => _.house)).toEqual(Array(5).fill(null))
    expect(asteroids?.map((_) => _.house)).toEqual(Array(5).fill(null))
  })

  it('JSONにしても値が変わらない', () => {
    expect(JSON.parse(JSON.stringify(result))).toEqual(result)
  })
})
