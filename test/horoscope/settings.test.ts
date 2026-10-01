import { describe, it, expect } from 'vitest'
import {
  DEFAULT_ASPECT_SETTINGS,
  DEFAULT_VISIBILITY,
  HoroscopeSettings,
  parseSettings,
  toSettingsHash,
  toSettingsQuery,
} from '../../src/horoscope/models'

const DEFAULT: HoroscopeSettings = { visibility: DEFAULT_VISIBILITY, aspects: DEFAULT_ASPECT_SETTINGS }

describe('画面の設定 ⇄ URL', () => {
  it('最初の状態は、空', () => {
    expect(toSettingsQuery(DEFAULT)).toEqual({})
    expect(toSettingsHash(DEFAULT)).toEqual('')
    expect(parseSettings({}, '')).toEqual(DEFAULT)
    expect(parseSettings({}, '#')).toEqual(DEFAULT)
  })

  it('アスペクトの求め方はクエリに、表示するものはハッシュに入れる。最初の状態と違う項目だけ', () => {
    const settings: HoroscopeSettings = {
      visibility: { ...DEFAULT_VISIBILITY, chiron: true },
      aspects: { ...DEFAULT_ASPECT_SETTINGS, orb: 8, minor: [30, 150] },
    }
    expect(toSettingsQuery(settings)).toEqual({ orb: '8', minor: '30,150' })
    expect(toSettingsHash(settings)).toEqual('show=ascMc,chiron')
  })

  it('片方だけ', () => {
    const hidden: HoroscopeSettings = { ...DEFAULT, visibility: { ...DEFAULT_VISIBILITY, ascMc: false } }
    expect(toSettingsQuery(hidden)).toEqual({})
    expect(toSettingsHash(hidden)).toEqual('show=none')

    const wide: HoroscopeSettings = { ...DEFAULT, aspects: { ...DEFAULT_ASPECT_SETTINGS, sunMoonPlus: 2 } }
    expect(toSettingsQuery(wide)).toEqual({ sunMoonPlus: '2' })
    expect(toSettingsHash(wide)).toEqual('')
  })

  it('URLにして、読み取ると、元に戻る', () => {
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
    expect(parseSettings(toSettingsQuery(settings), toSettingsHash(settings))).toEqual(settings)
    expect(parseSettings(toSettingsQuery(settings), `#${toSettingsHash(settings)}`)).toEqual(settings)
  })

  it('%2C になったカンマも、読み取る', () => {
    expect(parseSettings({}, '#show=chiron%2CascMc').visibility).toEqual({ ...DEFAULT_VISIBILITY, chiron: true })
  })

  it('読み取れない値と、知らない項目は、無視する', () => {
    expect(parseSettings({ orb: 'abc', minor: '31', foo: 'bar', date: '19870908' }, '#foo=bar&top')).toEqual(DEFAULT)
    expect(parseSettings({ orb: 'abc', minorOrb: '3' }, '').aspects).toEqual({
      ...DEFAULT_ASPECT_SETTINGS,
      minorOrb: 3,
    })
  })

  it('アスペクトの求め方は、ハッシュからは読まない。表示するものは、クエリからは読まない', () => {
    expect(parseSettings({ show: 'chiron' }, '#orb=8&minor=30,150')).toEqual(DEFAULT)
  })
})
