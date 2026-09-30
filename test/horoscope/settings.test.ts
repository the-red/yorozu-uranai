import { describe, it, expect } from 'vitest'
import {
  DEFAULT_ASPECT_SETTINGS,
  DEFAULT_VISIBILITY,
  HoroscopeSettings,
  parseSettingsHash,
  toSettingsHash,
} from '../../src/horoscope/models'

const DEFAULT: HoroscopeSettings = { visibility: DEFAULT_VISIBILITY, aspects: DEFAULT_ASPECT_SETTINGS }

describe('画面の設定 ⇄ URLのハッシュ', () => {
  it('最初の状態は、空', () => {
    expect(toSettingsHash(DEFAULT)).toEqual('')
    expect(parseSettingsHash('')).toEqual(DEFAULT)
    expect(parseSettingsHash('#')).toEqual(DEFAULT)
  })

  it('最初の状態と違う項目だけを入れる。表示するもの、アスペクトの求め方の順', () => {
    const settings: HoroscopeSettings = {
      visibility: { ...DEFAULT_VISIBILITY, chiron: true },
      aspects: { ...DEFAULT_ASPECT_SETTINGS, orb: 8, minor: [30, 150] },
    }
    // カンマは、そのまま入れる（%2C にしない）
    expect(toSettingsHash(settings)).toEqual('show=chiron,ascMc&orb=8&minor=30,150')
  })

  it('片方だけ', () => {
    expect(toSettingsHash({ ...DEFAULT, visibility: { ...DEFAULT_VISIBILITY, ascMc: false } })).toEqual('show=none')
    expect(toSettingsHash({ ...DEFAULT, aspects: { ...DEFAULT_ASPECT_SETTINGS, sunMoonPlus: 2 } })).toEqual(
      'sunMoonPlus=2'
    )
  })

  it('ハッシュにして、読み取ると、元に戻る', () => {
    const settings: HoroscopeSettings = {
      visibility: {
        asteroids: true,
        chiron: false,
        node: true,
        lilith: false,
        ascMc: false,
        vertex: true,
        partOfFortune: true,
      },
      aspects: {
        orb: 7.5,
        sunMoonPlus: 2,
        minor: [45, 72, 135],
        minorOrb: 1,
        ascMc: { aspects: 'conjunction', orb: 5 },
        asteroid: { aspects: 'major', orb: 2 },
        point: { aspects: 'major', orb: 1.5 },
      },
    }
    expect(parseSettingsHash(toSettingsHash(settings))).toEqual(settings)
    expect(parseSettingsHash(`#${toSettingsHash(settings)}`)).toEqual(settings)
  })

  it('%2C になったカンマも、読み取る', () => {
    expect(parseSettingsHash('#show=chiron%2CascMc&minor=30%2C150')).toEqual({
      visibility: { ...DEFAULT_VISIBILITY, chiron: true },
      aspects: { ...DEFAULT_ASPECT_SETTINGS, minor: [30, 150] },
    })
  })

  it('読み取れない値と、知らない項目は、無視する', () => {
    expect(parseSettingsHash('#orb=abc&minor=31&foo=bar&top')).toEqual(DEFAULT)
    expect(parseSettingsHash('#orb=abc&minorOrb=3').aspects).toEqual({ ...DEFAULT_ASPECT_SETTINGS, minorOrb: 3 })
  })
})
