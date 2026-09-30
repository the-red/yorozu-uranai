import { describe, it, expect } from 'vitest'
import { MAJOR_ASPECTS, MINOR_ASPECTS, closest, findAspect } from '../../src/horoscope/models'

describe('一番近いアスペクト', () => {
  it('オーブに収まるものを返す', () => {
    expect(findAspect(92, MAJOR_ASPECTS, 6)).toEqual({ aspect: { degrees: 90, name: 'square', type: 'hard' }, gap: 2 })
    expect(findAspect(55, MAJOR_ASPECTS, 6)?.aspect.name).toEqual('sextile')
  })
  it('オーブの境界は、含める', () => {
    expect(findAspect(96, MAJOR_ASPECTS, 6)?.aspect.name).toEqual('square')
    expect(findAspect(96.01, MAJOR_ASPECTS, 6)).toBeUndefined()
    expect(findAspect(84, MAJOR_ASPECTS, 6)?.aspect.name).toEqual('square')
    expect(findAspect(83.99, MAJOR_ASPECTS, 6)).toBeUndefined()
  })
  it('オーブが 0 なら、ちょうどの角度だけ', () => {
    expect(findAspect(120, MAJOR_ASPECTS, 0)?.aspect.name).toEqual('trine')
    expect(findAspect(120.5, MAJOR_ASPECTS, 0)).toBeUndefined()
  })
  it('隣り合うアスペクトの両方に収まるときは、ずれの小さいほうを選ぶ', () => {
    // 135度と 144度の間。オーブ 5度なら、どちらにも収まる
    expect(findAspect(139, MINOR_ASPECTS, 5)?.aspect.degrees).toEqual(135)
    expect(findAspect(140, MINOR_ASPECTS, 5)?.aspect.degrees).toEqual(144)
    // 144度と 150度の間
    expect(findAspect(146, MINOR_ASPECTS, 5)?.aspect.degrees).toEqual(144)
    expect(findAspect(148, MINOR_ASPECTS, 5)?.aspect.degrees).toEqual(150)
  })
  it('ずれが同じなら、角度の小さいほうを選ぶ', () => {
    expect(findAspect(147, MINOR_ASPECTS, 5)?.aspect.degrees).toEqual(144)
  })
  it('候補が無ければ undefined', () => {
    expect(findAspect(90, [], 6)).toBeUndefined()
    expect(closest([undefined, undefined])).toBeUndefined()
  })
})
