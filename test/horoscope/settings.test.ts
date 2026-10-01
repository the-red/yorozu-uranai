import { describe, it, expect } from 'vitest'
import {
  DEFAULT_ASPECT_SETTINGS,
  DEFAULT_VISIBILITY,
  HoroscopeSettings,
  SETTINGS_QUERY_KEYS,
  parseSettings,
  toSettingsQuery,
} from '../../src/horoscope/models'
import { FORM_QUERY_KEYS } from '../../src/lib/params'

const DEFAULT: HoroscopeSettings = { visibility: DEFAULT_VISIBILITY, aspects: DEFAULT_ASPECT_SETTINGS }

describe('画面の設定 ⇄ URLのクエリ', () => {
  it('最初の状態は、空', () => {
    expect(toSettingsQuery(DEFAULT)).toEqual({})
    expect(parseSettings({})).toEqual(DEFAULT)
  })

  it('最初の状態と違う項目だけを入れる。アスペクトの求め方、表示するものの順', () => {
    const settings: HoroscopeSettings = {
      visibility: { ...DEFAULT_VISIBILITY, chiron: true },
      aspects: { ...DEFAULT_ASPECT_SETTINGS, orb: 8, minor: [30, 150] },
    }
    expect(toSettingsQuery(settings)).toEqual({ orb: '8', minor: '30,150', show: 'ascMc,chiron' })
    expect(Object.keys(toSettingsQuery(settings))).toEqual(['orb', 'minor', 'show'])
  })

  it('片方だけ', () => {
    expect(toSettingsQuery({ ...DEFAULT, visibility: { ...DEFAULT_VISIBILITY, ascMc: false } })).toEqual({
      show: 'none',
    })
    expect(toSettingsQuery({ ...DEFAULT, aspects: { ...DEFAULT_ASPECT_SETTINGS, sunMoonPlus: 2 } })).toEqual({
      sunMoonPlus: '2',
    })
  })

  it('クエリにして、読み取ると、元に戻る', () => {
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
    expect(parseSettings(toSettingsQuery(settings))).toEqual(settings)
  })

  it('同じパラメータが複数あるときは、最初の値を使う', () => {
    expect(parseSettings({ show: ['chiron,ascMc', 'none'] }).visibility).toEqual({
      ...DEFAULT_VISIBILITY,
      chiron: true,
    })
  })

  it('読み取れない値と、知らない項目は、無視する', () => {
    expect(parseSettings({ orb: 'abc', minor: '31', show: 'foo', foo: 'bar', date: '19870908' })).toEqual(DEFAULT)
    expect(parseSettings({ orb: 'abc', minorOrb: '3' }).aspects).toEqual({ ...DEFAULT_ASPECT_SETTINGS, minorOrb: 3 })
  })

  it('設定の項目は、入力の項目と重ならない', () => {
    // 入力の項目が変わらなければ、設定を変えても、結果を取り直さない
    expect(SETTINGS_QUERY_KEYS.filter((_) => (FORM_QUERY_KEYS as readonly string[]).includes(_))).toEqual([])
    expect(SETTINGS_QUERY_KEYS).toContain('show')
    expect(SETTINGS_QUERY_KEYS).toContain('orb')
  })
})
