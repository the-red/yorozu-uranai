import { describe, it, expect } from 'vitest'
import { Horoscope, HoroscopeProps, POINT_ORB, getPointConjunctions } from '../../src/horoscope/models'
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
}

// ヘッドの位置だけを変える
const withNode = (longitude: number, isRetrograde = true) =>
  new Horoscope({ ...props, node: position(longitude, isRetrograde) })

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

describe('感受点と、惑星のコンジャンクション', () => {
  it('オーブは 3度', () => {
    expect(POINT_ORB).toEqual(3)
  })

  it('コンジャンクションが無い', () => {
    // ヘッドは 2.37度、テイルは 182.37度。一番近いのは、水星（180.68度）の 1.7度
    expect(getPointConjunctions(new Horoscope(props), 1)).toEqual([])
  })

  it('テイルと、水星', () => {
    expect(getPointConjunctions(new Horoscope(props), POINT_ORB)).toEqual([{ point: 'southNode', planet: 'mercury' }])
  })

  it('ヘッドと、太陽', () => {
    expect(getPointConjunctions(withNode(165), POINT_ORB)).toEqual([{ point: 'northNode', planet: 'sun' }])
  })

  it('オーブの境界', () => {
    // 冥王星は 217.890372度。近くに、ほかの惑星は無い
    const pluto = [{ point: 'northNode', planet: 'pluto' }]
    expect(getPointConjunctions(withNode(220.89), POINT_ORB)).toEqual(pluto)
    expect(getPointConjunctions(withNode(220.9), POINT_ORB)).toEqual([])
    expect(getPointConjunctions(withNode(214.9), POINT_ORB)).toEqual(pluto)
    expect(getPointConjunctions(withNode(214.88), POINT_ORB)).toEqual([])
  })

  it('黄経0度をまたぐ', () => {
    // 月は 348.062352度。ヘッドを 0.5度に置くと、差は 12.4度
    expect(getPointConjunctions(withNode(0.5), 13).map((_) => _.planet)).toContain('moon')
    // 木星は 29.125698度。テイルが 359度（ヘッドは 179度）なら、差は 30.1度
    expect(getPointConjunctions(withNode(179), 31)).toContainEqual({ point: 'southNode', planet: 'jupiter' })
  })

  it('複数の惑星', () => {
    // ヘッド（167度）の近くに、太陽 164.82度と、金星 169.11度。
    // テイル（347度）の近くに、月 348.06度
    expect(getPointConjunctions(withNode(167), POINT_ORB)).toEqual([
      { point: 'northNode', planet: 'sun' },
      { point: 'northNode', planet: 'venus' },
      { point: 'southNode', planet: 'moon' },
    ])
  })

  it('コンジャンクション以外は、求めない', () => {
    // 太陽（164.82度）と、ヘッド（74.82度）はスクエア。テイルは 254.82度で、土星（254.85度）とコンジャンクション
    expect(getPointConjunctions(withNode(74.82), POINT_ORB)).toEqual([{ point: 'southNode', planet: 'saturn' }])
  })
})
