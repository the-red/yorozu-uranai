import { describe, it, expect } from 'vitest'
import {
  DEFAULT_HOUSE_SYSTEM,
  HOUSE_SYSTEMS,
  HOUSE_SYSTEM_CODES,
  HOUSE_SYSTEM_NAMES,
  MAIN_HOUSE_SYSTEMS,
  getSolarSignCusps,
  toHouseSystem,
} from '../../src/horoscope/models'

describe('ハウスシステム', () => {
  it('最初の状態は、プラシーダス', () => {
    expect(DEFAULT_HOUSE_SYSTEM).toEqual('placidus')
    expect(HOUSE_SYSTEMS[0]).toEqual('placidus')
  })
  it('24種類。名前も、記号も、重複しない', () => {
    expect(HOUSE_SYSTEMS).toHaveLength(24)
    expect(new Set(HOUSE_SYSTEMS).size).toEqual(24)
    expect(new Set(Object.values(HOUSE_SYSTEM_NAMES)).size).toEqual(24)
    expect(new Set(Object.values(HOUSE_SYSTEM_CODES)).size).toEqual(24)
  })
  it('ソーラーサインの記号は、Swiss Ephemeris の記号（1文字）と、重ならない', () => {
    expect(HOUSE_SYSTEM_CODES.solarSign.length).toBeGreaterThan(1)
  })
  describe('ソーラーサインのカスプ', () => {
    it('太陽のあるサインの 0度から、30度ずつ', () => {
      expect(getSolarSignCusps(165.5)).toEqual([150, 180, 210, 240, 270, 300, 330, 0, 30, 60, 90, 120])
      expect(getSolarSignCusps(0.000001)).toEqual([0, 30, 60, 90, 120, 150, 180, 210, 240, 270, 300, 330])
      expect(getSolarSignCusps(359.999999)[0]).toEqual(330)
    })
    it('ちょうど境界にあるときは、新しいサイン', () => {
      expect(getSolarSignCusps(0)[0]).toEqual(0)
      expect(getSolarSignCusps(30)[0]).toEqual(30)
      expect(getSolarSignCusps(330)[0]).toEqual(330)
    })
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
      'solarSign',
    ])
    expect(HOUSE_SYSTEMS.slice(0, 8)).toEqual(MAIN_HOUSE_SYSTEMS)
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
