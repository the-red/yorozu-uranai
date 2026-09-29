import { describe, it, expect } from 'vitest'
import {
  Horoscope,
  HoroscopeProps,
  POINT_NAMES,
  POINT_ORB,
  PlanetName,
  getPartOfFortune,
  getPointConjunctions,
  getPointVariant,
  isDayBirth,
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
}

// ヘッドの位置だけを変える
const withNode = (longitude: number, isRetrograde = true) =>
  new Horoscope({ ...props, node: position(longitude, isRetrograde) })

// 惑星の位置だけを変える
const withPlanet = (name: PlanetName, longitude: number) =>
  new Horoscope({
    ...props,
    positions: props.positions.map(([_, current]) => [_, _ === name ? position(longitude) : current]),
  })

// ヘッドとテイルのコンジャンクション
const getNodeConjunctions = (horoscope: Horoscope, orb: number) =>
  getPointConjunctions(horoscope, orb).filter((_) => _.point === 'northNode' || _.point === 'southNode')

describe('感受点', () => {
  it('並び順', () => {
    // 記号が無いもの（Vx）を、最後に置く
    expect(POINT_NAMES).toEqual(['northNode', 'southNode', 'lilith', 'partOfFortune', 'vertex'])
    expect(Object.keys(new Horoscope(props).points)).toEqual([...POINT_NAMES])
  })

  it('求め方', () => {
    const horoscope = new Horoscope(props)
    expect(POINT_NAMES.map((_) => getPointVariant(_, horoscope))).toEqual(['true', 'true', 'mean', 'day', null])
  })
})

describe('ヘッドとテイル', () => {
  const { points } = new Horoscope(props)

  it('ヘッド', () => {
    const { northNode } = points
    expect(northNode.name).toEqual('northNode')
    expect(northNode.icon).toEqual('☊')
    expect(northNode.longitude).toBeCloseTo(2.374847, NUM_DIGITS)
    expect(northNode.sign).toEqual('牡羊座')
    expect(northNode.formattedDegrees).toEqual(' 2°22′R')
    // 5ハウスは、337.2度から 5.25度まで（黄経0度をまたぐ）
    expect(northNode.house).toEqual(5)
  })

  it('テイルは、ヘッドの反対側', () => {
    const { southNode } = points
    expect(southNode.name).toEqual('southNode')
    expect(southNode.icon).toEqual('☋')
    expect(southNode.longitude).toBeCloseTo(182.374847, NUM_DIGITS)
    expect(southNode.sign).toEqual('天秤座')
    expect(southNode.formattedDegrees).toEqual(' 2°22′R')
    expect(southNode.house).toEqual(11)
  })

  it('反対側が、黄経0度をまたぐ', () => {
    const { northNode, southNode } = withNode(190).points
    expect(northNode.sign).toEqual('天秤座')
    expect(southNode.longitude).toBeCloseTo(10, NUM_DIGITS)
    expect(southNode.sign).toEqual('牡羊座')
  })

  it('逆行しているかどうかは、2つとも同じ', () => {
    expect(withNode(100, true).points.northNode.isRetrograde).toEqual(true)
    expect(withNode(100, true).points.southNode.isRetrograde).toEqual(true)
    expect(withNode(100, false).points.northNode.formattedDegrees).toEqual('10°00′')
    expect(withNode(100, false).points.southNode.formattedDegrees).toEqual('10°00′')
  })

  it('惑星には含めない', () => {
    expect(Object.keys(new Horoscope(props).planets)).toEqual([
      'sun',
      'moon',
      'mercury',
      'venus',
      'mars',
      'jupiter',
      'saturn',
      'uranus',
      'neptune',
      'pluto',
    ])
  })
})

describe('リリス', () => {
  it('位置', () => {
    const { lilith } = new Horoscope(props).points
    expect(lilith.name).toEqual('lilith')
    expect(lilith.icon).toEqual('⚸')
    expect(lilith.longitude).toBeCloseTo(122.301895, NUM_DIGITS)
    expect(lilith.sign).toEqual('獅子座')
    expect(lilith.formattedDegrees).toEqual(' 2°18′')
    // 9ハウスは、88.3度から 123.8度まで
    expect(lilith.house).toEqual(9)
    expect(lilith.isRetrograde).toEqual(false)
  })
})

describe('バーテックス', () => {
  it('位置は、ハウスの計算結果から取る', () => {
    const { vertex } = new Horoscope(props).points
    expect(vertex.name).toEqual('vertex')
    // 記号は無いので、名前をそのまま使う
    expect(vertex.icon).toEqual('Vx')
    expect(vertex.longitude).toBeCloseTo(61.847894, NUM_DIGITS)
    expect(vertex.sign).toEqual('双子座')
    expect(vertex.formattedDegrees).toEqual(' 1°51′')
    // 8ハウスは、55.8度から 88.3度まで
    expect(vertex.house).toEqual(8)
    expect(vertex.isRetrograde).toEqual(false)
  })
})

describe('パート・オブ・フォーチュン', () => {
  describe('昼生まれかどうか', () => {
    // Asc から、黄経が増える向きに 180度までが、地平線の下（1〜6ハウス）
    it.each([
      [207.908591, 164.817337, true], // 基準の生年月日。太陽は 11ハウス
      [207.908591, 250, false],
      [10, 300, true],
      [350, 100, false],
    ])('Asc が %d度、太陽が %d度なら %j', (ascendant, sun, expected) => {
      expect(isDayBirth(ascendant, sun)).toEqual(expected)
    })

    it('境界は、ハウスの決め方に合わせる', () => {
      // カスプとちょうど同じ黄経は、手前のハウスに入る。Asc と同じなら 12ハウス（昼）、Dsc と同じなら 6ハウス（夜）
      expect(isDayBirth(100, 100)).toEqual(true)
      expect(isDayBirth(100, 100.000001)).toEqual(false)
      expect(isDayBirth(100, 280)).toEqual(false)
      expect(isDayBirth(100, 280.000001)).toEqual(true)
    })
  })

  describe('黄経', () => {
    it('昼生まれは、Asc + 月 − 太陽', () => {
      // 207.908591 + 348.062352 − 164.817337 = 391.153606
      expect(getPartOfFortune({ ascendant: 207.908591, sun: 164.817337, moon: 348.062352 })).toBeCloseTo(
        31.153606,
        NUM_DIGITS
      )
    })
    it('夜生まれは、Asc + 太陽 − 月', () => {
      // 207.908591 + 250 − 348.062352
      expect(getPartOfFortune({ ascendant: 207.908591, sun: 250, moon: 348.062352 })).toBeCloseTo(
        109.846239,
        NUM_DIGITS
      )
    })
    it('負の値にならない', () => {
      // 10 + 20 − 300 = −270
      expect(getPartOfFortune({ ascendant: 10, sun: 300, moon: 20 })).toBeCloseTo(90, NUM_DIGITS)
    })
    it('360度を超えない', () => {
      // 350 + 100 − 20 = 430
      expect(getPartOfFortune({ ascendant: 350, sun: 100, moon: 20 })).toBeCloseTo(70, NUM_DIGITS)
    })
    it('境界', () => {
      expect(getPartOfFortune({ ascendant: 100, sun: 100, moon: 30 })).toBeCloseTo(30, NUM_DIGITS)
      expect(getPartOfFortune({ ascendant: 100, sun: 100.000001, moon: 30 })).toBeCloseTo(170.000001, NUM_DIGITS)
      expect(getPartOfFortune({ ascendant: 100, sun: 280, moon: 30 })).toBeCloseTo(350, NUM_DIGITS)
      expect(getPartOfFortune({ ascendant: 100, sun: 280.000001, moon: 30 })).toBeCloseTo(209.999999, NUM_DIGITS)
    })
  })

  it('昼生まれ', () => {
    const horoscope = new Horoscope(props)
    const { partOfFortune } = horoscope.points
    expect(partOfFortune.name).toEqual('partOfFortune')
    expect(partOfFortune.icon).toEqual('⊗')
    expect(partOfFortune.longitude).toBeCloseTo(31.153606, NUM_DIGITS)
    expect(partOfFortune.sign).toEqual('牡牛座')
    expect(partOfFortune.formattedDegrees).toEqual(' 1°09′')
    // 7ハウスは、27.9度から 55.8度まで
    expect(partOfFortune.house).toEqual(7)
    expect(partOfFortune.isRetrograde).toEqual(false)
    expect(getPointVariant('partOfFortune', horoscope)).toEqual('day')
  })

  it('夜生まれ', () => {
    // 太陽を 250度（2ハウス）に置く
    const horoscope = withPlanet('sun', 250)
    const { partOfFortune } = horoscope.points
    expect(partOfFortune.longitude).toBeCloseTo(109.846239, NUM_DIGITS)
    expect(partOfFortune.sign).toEqual('蟹座')
    expect(partOfFortune.formattedDegrees).toEqual('19°51′')
    expect(partOfFortune.house).toEqual(9)
    expect(getPointVariant('partOfFortune', horoscope)).toEqual('night')
  })
})

describe('感受点と、惑星のコンジャンクション', () => {
  it('オーブは 3度', () => {
    expect(POINT_ORB).toEqual(3)
  })

  it('コンジャンクションが無い', () => {
    // ヘッドは 2.37度、テイルは 182.37度。一番近いのは、水星（180.68度）の 1.7度
    expect(getNodeConjunctions(new Horoscope(props), 1)).toEqual([])
  })

  it('テイルと、水星', () => {
    expect(getNodeConjunctions(new Horoscope(props), POINT_ORB)).toEqual([{ point: 'southNode', planet: 'mercury' }])
  })

  it('感受点の並び順に求める', () => {
    // テイル（182.37度）と水星（180.68度）、PoF（31.15度）と木星（29.13度）
    expect(getPointConjunctions(new Horoscope(props), POINT_ORB)).toEqual([
      { point: 'southNode', planet: 'mercury' },
      { point: 'partOfFortune', planet: 'jupiter' },
    ])
  })

  it('リリスと、太陽', () => {
    // 太陽は 164.82度
    const horoscope = new Horoscope({ ...props, lilith: position(165) })
    expect(getPointConjunctions(horoscope, POINT_ORB)).toContainEqual({ point: 'lilith', planet: 'sun' })
  })

  it('バーテックスと、土星', () => {
    // 土星は 254.85度
    const horoscope = new Horoscope({ ...props, houses: { ...props.houses, vertex: 254 } })
    expect(getPointConjunctions(horoscope, POINT_ORB)).toContainEqual({ point: 'vertex', planet: 'saturn' })
  })

  it('PoF と、木星', () => {
    // PoF は 31.15度、木星は 29.13度。差は 2.03度
    expect(getPointConjunctions(new Horoscope(props), POINT_ORB)).toContainEqual({
      point: 'partOfFortune',
      planet: 'jupiter',
    })
    expect(getPointConjunctions(new Horoscope(props), 2).map((_) => _.point)).not.toContain('partOfFortune')
  })

  it('ヘッドと、太陽', () => {
    expect(getNodeConjunctions(withNode(165), POINT_ORB)).toEqual([{ point: 'northNode', planet: 'sun' }])
  })

  it('オーブの境界', () => {
    // 冥王星は 217.890372度。近くに、ほかの惑星は無い
    const pluto = [{ point: 'northNode', planet: 'pluto' }]
    expect(getNodeConjunctions(withNode(220.89), POINT_ORB)).toEqual(pluto)
    expect(getNodeConjunctions(withNode(220.9), POINT_ORB)).toEqual([])
    expect(getNodeConjunctions(withNode(214.9), POINT_ORB)).toEqual(pluto)
    expect(getNodeConjunctions(withNode(214.88), POINT_ORB)).toEqual([])
  })

  it('黄経0度をまたぐ', () => {
    // 月は 348.062352度。ヘッドを 0.5度に置くと、差は 12.4度
    expect(getNodeConjunctions(withNode(0.5), 13).map((_) => _.planet)).toContain('moon')
    // 木星は 29.125698度。テイルが 359度（ヘッドは 179度）なら、差は 30.1度
    expect(getNodeConjunctions(withNode(179), 31)).toContainEqual({ point: 'southNode', planet: 'jupiter' })
  })

  it('複数の惑星', () => {
    // ヘッド（167度）の近くに、太陽 164.82度と、金星 169.11度。
    // テイル（347度）の近くに、月 348.06度
    expect(getNodeConjunctions(withNode(167), POINT_ORB)).toEqual([
      { point: 'northNode', planet: 'sun' },
      { point: 'northNode', planet: 'venus' },
      { point: 'southNode', planet: 'moon' },
    ])
  })

  it('コンジャンクション以外は、求めない', () => {
    // 太陽（164.82度）と、ヘッド（74.82度）はスクエア。テイルは 254.82度で、土星（254.85度）とコンジャンクション
    expect(getNodeConjunctions(withNode(74.82), POINT_ORB)).toEqual([{ point: 'southNode', planet: 'saturn' }])
  })
})
