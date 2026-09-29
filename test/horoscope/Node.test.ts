import { describe, it, expect } from 'vitest'
import { Horoscope, HoroscopeProps, NODE_ORB, getNodeConjunctions } from '../../src/horoscope/models'
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

// ドラゴンヘッドの位置だけを変える
const withNode = (longitude: number, isRetrograde = true) =>
  new Horoscope({ ...props, node: position(longitude, isRetrograde) })

describe('ドラゴンヘッドとドラゴンテイル', () => {
  const { nodes } = new Horoscope(props)

  it('ドラゴンヘッド', () => {
    const { northNode } = nodes
    expect(northNode.name).toEqual('northNode')
    expect(northNode.icon).toEqual('☊')
    expect(northNode.longitude).toBeCloseTo(2.374847, NUM_DIGITS)
    expect(northNode.sign).toEqual('牡羊座')
    expect(northNode.formattedDegrees).toEqual(' 2°22′R')
    // 5ハウスは、337.2度から 5.25度まで（黄経0度をまたぐ）
    expect(northNode.house).toEqual(5)
  })

  it('ドラゴンテイルは、ドラゴンヘッドの反対側', () => {
    const { southNode } = nodes
    expect(southNode.name).toEqual('southNode')
    expect(southNode.icon).toEqual('☋')
    expect(southNode.longitude).toBeCloseTo(182.374847, NUM_DIGITS)
    expect(southNode.sign).toEqual('天秤座')
    expect(southNode.formattedDegrees).toEqual(' 2°22′R')
    expect(southNode.house).toEqual(11)
  })

  it('反対側が、黄経0度をまたぐ', () => {
    const { northNode, southNode } = withNode(190).nodes
    expect(northNode.sign).toEqual('天秤座')
    expect(southNode.longitude).toBeCloseTo(10, NUM_DIGITS)
    expect(southNode.sign).toEqual('牡羊座')
  })

  it('逆行しているかどうかは、2つとも同じ', () => {
    expect(withNode(100, true).nodes.northNode.isRetrograde).toEqual(true)
    expect(withNode(100, true).nodes.southNode.isRetrograde).toEqual(true)
    expect(withNode(100, false).nodes.northNode.formattedDegrees).toEqual('10°00′')
    expect(withNode(100, false).nodes.southNode.formattedDegrees).toEqual('10°00′')
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

describe('ドラゴンヘッド・ドラゴンテイルと、惑星のコンジャンクション', () => {
  it('オーブは 3度', () => {
    expect(NODE_ORB).toEqual(3)
  })

  it('コンジャンクションが無い', () => {
    // ドラゴンヘッドは 2.37度、ドラゴンテイルは 182.37度。一番近いのは、水星（180.68度）の 1.7度
    expect(getNodeConjunctions(new Horoscope(props), 1)).toEqual([])
  })

  it('ドラゴンテイルと、水星', () => {
    expect(getNodeConjunctions(new Horoscope(props), NODE_ORB)).toEqual([{ node: 'southNode', planet: 'mercury' }])
  })

  it('ドラゴンヘッドと、太陽', () => {
    expect(getNodeConjunctions(withNode(165), NODE_ORB)).toEqual([{ node: 'northNode', planet: 'sun' }])
  })

  it('オーブの境界', () => {
    // 冥王星は 217.890372度。近くに、ほかの惑星は無い
    const pluto = [{ node: 'northNode', planet: 'pluto' }]
    expect(getNodeConjunctions(withNode(220.89), NODE_ORB)).toEqual(pluto)
    expect(getNodeConjunctions(withNode(220.9), NODE_ORB)).toEqual([])
    expect(getNodeConjunctions(withNode(214.9), NODE_ORB)).toEqual(pluto)
    expect(getNodeConjunctions(withNode(214.88), NODE_ORB)).toEqual([])
  })

  it('黄経0度をまたぐ', () => {
    // 月は 348.062352度。ドラゴンヘッドを 0.5度に置くと、差は 12.4度
    expect(getNodeConjunctions(withNode(0.5), 13).map((_) => _.planet)).toContain('moon')
    // 木星は 29.125698度。ドラゴンテイルが 359度（ドラゴンヘッドは 179度）なら、差は 30.1度
    expect(getNodeConjunctions(withNode(179), 31)).toContainEqual({ node: 'southNode', planet: 'jupiter' })
  })

  it('複数の惑星', () => {
    // ドラゴンヘッド（167度）の近くに、太陽 164.82度と、金星 169.11度。
    // ドラゴンテイル（347度）の近くに、月 348.06度
    expect(getNodeConjunctions(withNode(167), NODE_ORB)).toEqual([
      { node: 'northNode', planet: 'sun' },
      { node: 'northNode', planet: 'venus' },
      { node: 'southNode', planet: 'moon' },
    ])
  })

  it('コンジャンクション以外は、求めない', () => {
    // 太陽（164.82度）と、ドラゴンヘッド（74.82度）はスクエア。ドラゴンテイルは 254.82度で、土星（254.85度）とコンジャンクション
    expect(getNodeConjunctions(withNode(74.82), NODE_ORB)).toEqual([{ node: 'southNode', planet: 'saturn' }])
  })
})
