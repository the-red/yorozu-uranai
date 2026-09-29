import { describe, it, expect } from 'vitest'
import {
  ASTEROID_NAMES,
  ASTEROID_NAMES_JA,
  ASTEROID_TYPES,
  Horoscope,
  HoroscopeProps,
  POINT_ORB,
  getAsteroidConjunctions,
} from '../../src/horoscope/models'
import { NUM_DIGITS } from '../test-util'

const position = (longitude: number, isRetrograde = false) =>
  ({ longitude, isRetrograde }) as HoroscopeProps['positions'][number][1]

// 1987-09-08 08:53 札幌生まれ
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

// 小惑星の位置を変える
const withAsteroid = (name: string, longitude: number) =>
  new Horoscope({
    ...props,
    asteroids: props.asteroids?.map(([_, current]) => [_, _ === name ? position(longitude) : current]) ?? null,
  })

describe('小惑星とキロン', () => {
  it('並び順と、名前', () => {
    // よく使われるキロンを先に、小惑星は番号の順に置く
    expect(ASTEROID_NAMES).toEqual(['chiron', 'ceres', 'pallas', 'juno', 'vesta'])
    expect(ASTEROID_NAMES.map((_) => ASTEROID_NAMES_JA[_])).toEqual(['キロン', 'セレス', 'パラス', 'ジュノ', 'ベスタ'])
  })

  it('種類', () => {
    // キロンは、小惑星と彗星の中間の天体（ケンタウルス族）
    expect(ASTEROID_NAMES.map((_) => ASTEROID_TYPES[_])).toEqual([
      'centaur',
      'asteroid',
      'asteroid',
      'asteroid',
      'asteroid',
    ])
  })

  it('位置', () => {
    const { asteroids } = new Horoscope(props)
    expect(Object.keys(asteroids ?? {})).toEqual([...ASTEROID_NAMES])
    expect(
      ASTEROID_NAMES.map((name) => {
        const { icon, sign, formattedDegrees, house, isRetrograde } = asteroids![name]
        return [name, icon, sign, formattedDegrees, house, isRetrograde]
      })
    ).toEqual([
      ['chiron', '⚷', '双子座', '28°16′', 8, false],
      ['ceres', '⚳', '射手座', '24°00′', 2, false],
      ['pallas', '⚴', '蠍座', '24°32′', 1, false],
      ['juno', '⚵', '水瓶座', '26°25′R', 4, true],
      ['vesta', '⚶', '蟹座', '18°43′', 9, false],
    ])
    expect(asteroids!.chiron.longitude).toBeCloseTo(88.267633, NUM_DIGITS)
  })

  it('計算できない日付では、無い', () => {
    // 天体暦のファイルの範囲（1800年から 2399年まで）の外
    const horoscope = new Horoscope({ ...props, asteroids: null })
    expect(horoscope.asteroids).toBeUndefined()
    // 惑星と感受点は、ある
    expect(Object.keys(horoscope.planets)).toHaveLength(10)
    expect(Object.keys(horoscope.points)).toHaveLength(5)
  })

  it('惑星と、感受点には、含めない', () => {
    const { planets, points } = new Horoscope(props)
    expect(Object.keys(planets)).toHaveLength(10)
    expect(Object.keys(points)).toHaveLength(5)
    expect(Object.keys({ ...planets, ...points })).not.toContain('chiron')
  })
})

describe('小惑星と、惑星のコンジャンクション', () => {
  it('セレスと、天王星', () => {
    // セレスは 264.01度、天王星は 262.74度。差は 1.27度
    expect(getAsteroidConjunctions(new Horoscope(props), POINT_ORB)).toEqual([{ asteroid: 'ceres', planet: 'uranus' }])
  })

  it('オーブの境界', () => {
    expect(getAsteroidConjunctions(new Horoscope(props), 1.28)).toEqual([{ asteroid: 'ceres', planet: 'uranus' }])
    expect(getAsteroidConjunctions(new Horoscope(props), 1.27)).toEqual([])
  })

  it('小惑星の並び順に求める', () => {
    // キロンを太陽（164.82度）に、ベスタを月（348.06度）に重ねる
    const horoscope = new Horoscope({
      ...props,
      asteroids: [
        ['chiron', position(165)],
        ['ceres', position(264.007846)],
        ['pallas', position(234.541557)],
        ['juno', position(326.419652, true)],
        ['vesta', position(348)],
      ],
    })
    expect(getAsteroidConjunctions(horoscope, 1)).toEqual([
      { asteroid: 'chiron', planet: 'sun' },
      { asteroid: 'vesta', planet: 'moon' },
    ])
  })

  it('黄経0度をまたぐ', () => {
    // 月は 348.06度。パラスを 1度に置くと、差は 12.94度
    expect(getAsteroidConjunctions(withAsteroid('pallas', 1), 13)).toContainEqual({
      asteroid: 'pallas',
      planet: 'moon',
    })
    expect(getAsteroidConjunctions(withAsteroid('pallas', 1), 12.9)).not.toContainEqual({
      asteroid: 'pallas',
      planet: 'moon',
    })
  })

  it('計算できない日付では、空', () => {
    expect(getAsteroidConjunctions(new Horoscope({ ...props, asteroids: null }), POINT_ORB)).toEqual([])
  })
})
