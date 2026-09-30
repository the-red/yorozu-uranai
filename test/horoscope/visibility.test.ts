import { describe, it, expect } from 'vitest'
import {
  ASTEROID_NAMES,
  DEFAULT_VISIBILITY,
  POINT_NAMES,
  VISIBILITY_KEYS,
  VISIBILITY_LABELS,
  isAsteroidVisible,
  isPointVisible,
  parseVisibility,
  toggleVisibility,
} from '../../src/horoscope/models'

describe('惑星以外のものを、表示するかどうか', () => {
  it('切り替えの単位と、並び順', () => {
    // 4つの小惑星は、まとめて切り替える。ヘッドとテイルは、必ず正反対にあるので、まとめる。Asc と Mc も、まとめる
    expect(VISIBILITY_KEYS).toEqual(['chiron', 'asteroids', 'node', 'lilith', 'ascMc', 'vertex', 'partOfFortune'])
    expect(VISIBILITY_KEYS.map((_) => VISIBILITY_LABELS[_])).toEqual([
      'キロン',
      '小惑星',
      'ヘッド・テイル',
      'リリス',
      'Asc・Mc',
      'Vx',
      'PoF',
    ])
  })

  it('最初は、Asc・Mc だけを表示する', () => {
    expect(DEFAULT_VISIBILITY).toEqual({
      chiron: false,
      asteroids: false,
      node: false,
      lilith: false,
      ascMc: true,
      vertex: false,
      partOfFortune: false,
    })
  })

  describe('保存した文字列から読み取る', () => {
    it('保存していなければ、最初の状態', () => {
      expect(parseVisibility(null)).toEqual(DEFAULT_VISIBILITY)
    })

    it('保存した内容', () => {
      const saved = JSON.stringify({ chiron: true, node: true, lilith: true, ascMc: false, vertex: false })
      expect(parseVisibility(saved)).toEqual({
        chiron: true,
        asteroids: false,
        node: true,
        lilith: true,
        ascMc: false,
        vertex: false,
        partOfFortune: false,
      })
    })

    it('保存していない項目は、最初の状態で補う', () => {
      // 項目を増やす前に保存した内容
      expect(parseVisibility('{"lilith":true}')).toEqual({ ...DEFAULT_VISIBILITY, lilith: true })
    })

    it('知らない項目は、無視する', () => {
      expect(parseVisibility('{"lilith":true,"unknown":true}')).toEqual({ ...DEFAULT_VISIBILITY, lilith: true })
      // 小惑星を1つずつ切り替えていたときに、保存した内容
      expect(parseVisibility('{"ceres":true,"vesta":true}')).toEqual(DEFAULT_VISIBILITY)
    })

    it('真偽値でない値は、無視する', () => {
      expect(parseVisibility('{"lilith":"true","node":1,"ascMc":null}')).toEqual(DEFAULT_VISIBILITY)
    })

    it.each(['', 'abc', '{', 'null', '[]', '[false]', '"lilith"', '123', 'true'])(
      '読み取れない内容（%j）なら、最初の状態',
      (saved) => {
        expect(parseVisibility(saved)).toEqual(DEFAULT_VISIBILITY)
      }
    )

    it('最初の状態を、書き換えない', () => {
      parseVisibility('{"lilith":true}')
      expect(DEFAULT_VISIBILITY.lilith).toEqual(false)
    })
  })

  describe('切り替える', () => {
    it('1つだけを変えた文字列を返す', () => {
      const saved = toggleVisibility(DEFAULT_VISIBILITY, 'vertex', true)
      expect(parseVisibility(saved)).toEqual({ ...DEFAULT_VISIBILITY, vertex: true })
    })

    it('元の値を、書き換えない', () => {
      const visibility = { ...DEFAULT_VISIBILITY }
      toggleVisibility(visibility, 'vertex', true)
      expect(visibility).toEqual(DEFAULT_VISIBILITY)
    })

    it('続けて切り替える', () => {
      const first = parseVisibility(toggleVisibility(DEFAULT_VISIBILITY, 'node', true))
      const second = parseVisibility(toggleVisibility(first, 'lilith', true))
      const third = parseVisibility(toggleVisibility(second, 'node', false))
      expect(third).toEqual({ ...DEFAULT_VISIBILITY, lilith: true })
    })
  })

  describe('感受点を、表示するかどうか', () => {
    it('最初は、表示しない', () => {
      expect(POINT_NAMES.filter((_) => isPointVisible(_, DEFAULT_VISIBILITY))).toEqual([])
    })

    it('ヘッドとテイルは、まとめて切り替わる', () => {
      const visibility = { ...DEFAULT_VISIBILITY, node: true }
      expect(POINT_NAMES.filter((_) => isPointVisible(_, visibility))).toEqual(['northNode', 'southNode'])
    })

    it.each([
      ['lilith', ['lilith']],
      ['vertex', ['vertex']],
      ['partOfFortune', ['partOfFortune']],
    ] as const)('%s を表示する', (key, expected) => {
      const visibility = { ...DEFAULT_VISIBILITY, [key]: true }
      expect(POINT_NAMES.filter((_) => isPointVisible(_, visibility))).toEqual(expected)
    })

    it('Asc・Mc を消しても、感受点は変わらない', () => {
      const visibility = { ...DEFAULT_VISIBILITY, ascMc: false }
      expect(POINT_NAMES.filter((_) => isPointVisible(_, visibility))).toEqual([])
    })

    it('すべて表示する', () => {
      const visibility = {
        ...DEFAULT_VISIBILITY,
        node: true,
        lilith: true,
        vertex: true,
        partOfFortune: true,
      }
      expect(POINT_NAMES.filter((_) => isPointVisible(_, visibility))).toEqual([...POINT_NAMES])
    })
  })

  describe('小惑星とキロンを、表示するかどうか', () => {
    it('最初は、表示しない', () => {
      expect(ASTEROID_NAMES.filter((_) => isAsteroidVisible(_, DEFAULT_VISIBILITY))).toEqual([])
    })

    it('キロンだけを表示する', () => {
      const visibility = { ...DEFAULT_VISIBILITY, chiron: true }
      expect(ASTEROID_NAMES.filter((_) => isAsteroidVisible(_, visibility))).toEqual(['chiron'])
    })

    it('4つの小惑星は、まとめて切り替わる', () => {
      const visibility = { ...DEFAULT_VISIBILITY, asteroids: true }
      expect(ASTEROID_NAMES.filter((_) => isAsteroidVisible(_, visibility))).toEqual([
        'ceres',
        'pallas',
        'juno',
        'vesta',
      ])
    })

    it('感受点は、変わらない', () => {
      const visibility = { ...DEFAULT_VISIBILITY, chiron: true }
      expect(POINT_NAMES.filter((_) => isPointVisible(_, visibility))).toEqual([])
    })
  })
})
