import { describe, it, expect } from 'vitest'
import {
  DEFAULT_VISIBILITY,
  POINT_NAMES,
  VISIBILITY_KEYS,
  VISIBILITY_LABELS,
  isPointVisible,
  parseVisibility,
  toggleVisibility,
} from '../../src/horoscope/models'

describe('惑星以外のものを、表示するかどうか', () => {
  it('切り替えの単位と、並び順', () => {
    // ヘッドとテイルは、必ず正反対にあるので、まとめて切り替える。Asc と Mc も、まとめる
    expect(VISIBILITY_KEYS).toEqual(['node', 'lilith', 'ascMc', 'vertex', 'partOfFortune'])
    expect(VISIBILITY_KEYS.map((_) => VISIBILITY_LABELS[_])).toEqual([
      'ヘッド・テイル',
      'リリス',
      'Asc・Mc',
      'Vx',
      'PoF',
    ])
  })

  it('最初は、すべて表示する', () => {
    expect(DEFAULT_VISIBILITY).toEqual({
      node: true,
      lilith: true,
      ascMc: true,
      vertex: true,
      partOfFortune: true,
    })
  })

  describe('保存した文字列から読み取る', () => {
    it('保存していなければ、最初の状態', () => {
      expect(parseVisibility(null)).toEqual(DEFAULT_VISIBILITY)
    })

    it('保存した内容', () => {
      const saved = JSON.stringify({ node: false, lilith: true, ascMc: true, vertex: false, partOfFortune: true })
      expect(parseVisibility(saved)).toEqual({
        node: false,
        lilith: true,
        ascMc: true,
        vertex: false,
        partOfFortune: true,
      })
    })

    it('保存していない項目は、最初の状態で補う', () => {
      // 項目を増やす前に保存した内容
      expect(parseVisibility('{"lilith":false}')).toEqual({ ...DEFAULT_VISIBILITY, lilith: false })
    })

    it('知らない項目は、無視する', () => {
      expect(parseVisibility('{"lilith":false,"unknown":false}')).toEqual({ ...DEFAULT_VISIBILITY, lilith: false })
    })

    it('真偽値でない値は、無視する', () => {
      expect(parseVisibility('{"lilith":"false","node":0,"vertex":null}')).toEqual(DEFAULT_VISIBILITY)
    })

    it.each(['', 'abc', '{', 'null', '[]', '[false]', '"lilith"', '123', 'true'])(
      '読み取れない内容（%j）なら、最初の状態',
      (saved) => {
        expect(parseVisibility(saved)).toEqual(DEFAULT_VISIBILITY)
      }
    )

    it('最初の状態を、書き換えない', () => {
      parseVisibility('{"lilith":false}')
      expect(DEFAULT_VISIBILITY.lilith).toEqual(true)
    })
  })

  describe('切り替える', () => {
    it('1つだけを変えた文字列を返す', () => {
      const saved = toggleVisibility(DEFAULT_VISIBILITY, 'vertex', false)
      expect(parseVisibility(saved)).toEqual({ ...DEFAULT_VISIBILITY, vertex: false })
    })

    it('元の値を、書き換えない', () => {
      const visibility = { ...DEFAULT_VISIBILITY }
      toggleVisibility(visibility, 'vertex', false)
      expect(visibility).toEqual(DEFAULT_VISIBILITY)
    })

    it('続けて切り替える', () => {
      const first = parseVisibility(toggleVisibility(DEFAULT_VISIBILITY, 'node', false))
      const second = parseVisibility(toggleVisibility(first, 'lilith', false))
      const third = parseVisibility(toggleVisibility(second, 'node', true))
      expect(third).toEqual({ ...DEFAULT_VISIBILITY, lilith: false })
    })
  })

  describe('感受点を、表示するかどうか', () => {
    it('最初は、すべて表示する', () => {
      expect(POINT_NAMES.filter((_) => isPointVisible(_, DEFAULT_VISIBILITY))).toEqual([...POINT_NAMES])
    })

    it('ヘッドとテイルは、まとめて切り替わる', () => {
      const visibility = { ...DEFAULT_VISIBILITY, node: false }
      expect(POINT_NAMES.filter((_) => isPointVisible(_, visibility))).toEqual(['lilith', 'vertex', 'partOfFortune'])
    })

    it.each([
      ['lilith', ['northNode', 'southNode', 'vertex', 'partOfFortune']],
      ['vertex', ['northNode', 'southNode', 'lilith', 'partOfFortune']],
      ['partOfFortune', ['northNode', 'southNode', 'lilith', 'vertex']],
    ] as const)('%s を消す', (key, expected) => {
      const visibility = { ...DEFAULT_VISIBILITY, [key]: false }
      expect(POINT_NAMES.filter((_) => isPointVisible(_, visibility))).toEqual(expected)
    })

    it('Asc・Mc を消しても、感受点は消えない', () => {
      const visibility = { ...DEFAULT_VISIBILITY, ascMc: false }
      expect(POINT_NAMES.filter((_) => isPointVisible(_, visibility))).toEqual([...POINT_NAMES])
    })

    it('すべて消す', () => {
      const visibility = { node: false, lilith: false, ascMc: false, vertex: false, partOfFortune: false }
      expect(POINT_NAMES.filter((_) => isPointVisible(_, visibility))).toEqual([])
    })
  })
})
