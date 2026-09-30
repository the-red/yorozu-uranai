import { describe, it, expect } from 'vitest'
import {
  DEFAULT_HOUSE_SYSTEM,
  HOUSE_SYSTEMS,
  HOUSE_SYSTEM_CODES,
  HOUSE_SYSTEM_NAMES_JA,
  MAIN_HOUSE_SYSTEMS,
  toHouseSystem,
} from '../../src/horoscope/models'

describe('ハウスシステム', () => {
  it('最初の状態は、プラシーダス', () => {
    expect(DEFAULT_HOUSE_SYSTEM).toEqual('placidus')
    expect(HOUSE_SYSTEMS[0]).toEqual('placidus')
  })
  it('23種類。名前も、記号も、重複しない', () => {
    expect(HOUSE_SYSTEMS).toHaveLength(23)
    expect(new Set(HOUSE_SYSTEMS).size).toEqual(23)
    expect(new Set(Object.values(HOUSE_SYSTEM_NAMES_JA)).size).toEqual(23)
    expect(new Set(Object.values(HOUSE_SYSTEM_CODES)).size).toEqual(23)
  })
  it('36 に分けるもの（G）と、ほかと同じもの（E、i）は、入れていない', () => {
    const codes: string[] = Object.values(HOUSE_SYSTEM_CODES)
    expect(codes).not.toContain('G')
    expect(codes).not.toContain('E')
    expect(codes).not.toContain('i')
  })
  it('主なものを、先に並べる', () => {
    expect(MAIN_HOUSE_SYSTEMS).toEqual([
      'placidus',
      'koch',
      'regiomontanus',
      'campanus',
      'porphyry',
      'equal',
      'wholeSign',
    ])
    expect(HOUSE_SYSTEMS.slice(0, 7)).toEqual(MAIN_HOUSE_SYSTEMS)
  })
  it('URLの値から読み取る', () => {
    for (const house of HOUSE_SYSTEMS) {
      expect(toHouseSystem(house)).toEqual(house)
    }
    expect(toHouseSystem('')).toBeUndefined()
    expect(toHouseSystem('P')).toBeUndefined()
    expect(toHouseSystem('Placidus')).toBeUndefined()
  })
})
