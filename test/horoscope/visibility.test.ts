import { describe, it, expect } from 'vitest'
import {
  ASTEROID_NAMES,
  DEFAULT_VISIBILITY,
  POINT_NAMES,
  VISIBILITY_KEYS,
  VISIBILITY_LABELS,
  isAsteroidVisible,
  isPointVisible,
  parseShowParam,
  toShowParam,
} from '../../src/horoscope/models'

describe('惑星以外のものを、表示するかどうか', () => {
  it('切り替えの単位と、並び順', () => {
    // 4つの小惑星は、まとめて切り替える。ヘッドとテイルは、必ず正反対にあるので、まとめる。Asc と Mc も、まとめる
    // 出生時刻と場所で決まるもの（Asc・Mc、Vx、PoF）を先に、日時だけで決まるものを後に置く
    expect(VISIBILITY_KEYS).toEqual(['ascMc', 'vertex', 'partOfFortune', 'asteroids', 'chiron', 'node', 'lilith'])
    expect(VISIBILITY_KEYS.map((_) => VISIBILITY_LABELS[_])).toEqual([
      'Asc・Mc',
      'Vx',
      'PoF',
      '小惑星',
      'キロン',
      'ヘッド・テイル',
      'リリス',
    ])
  })

  it('最初は、Asc・Mc だけを表示する', () => {
    expect(DEFAULT_VISIBILITY).toEqual({
      asteroids: false,
      chiron: false,
      node: false,
      lilith: false,
      ascMc: true,
      vertex: false,
      partOfFortune: false,
    })
  })

  describe('URLに入れる値', () => {
    const ALL_HIDDEN = { ...DEFAULT_VISIBILITY, ascMc: false }

    it('最初の状態は、URLに入れない', () => {
      expect(toShowParam(DEFAULT_VISIBILITY)).toBeUndefined()
      expect(parseShowParam(undefined)).toEqual(DEFAULT_VISIBILITY)
      expect(parseShowParam('')).toEqual(DEFAULT_VISIBILITY)
    })

    it('表示するものを、表示の順に、カンマで区切って並べる', () => {
      expect(toShowParam({ ...DEFAULT_VISIBILITY, lilith: true, chiron: true })).toEqual('ascMc,chiron,lilith')
      expect(toShowParam({ ...ALL_HIDDEN, vertex: true })).toEqual('vertex')
    })

    it('何も表示しないときは none', () => {
      expect(toShowParam(ALL_HIDDEN)).toEqual('none')
      expect(parseShowParam('none')).toEqual(ALL_HIDDEN)
    })

    it('並べたものだけを、表示する', () => {
      expect(parseShowParam('chiron,node')).toEqual({ ...ALL_HIDDEN, chiron: true, node: true })
      // Asc・Mc は、最初の状態では表示するが、並べなければ、表示しない
      expect(parseShowParam('lilith').ascMc).toEqual(false)
    })

    it('並び順は、問わない', () => {
      expect(parseShowParam('ascMc,asteroids')).toEqual(parseShowParam('asteroids,ascMc'))
    })

    it('知らない項目は、無視する', () => {
      expect(parseShowParam('lilith,unknown,ceres')).toEqual({ ...ALL_HIDDEN, lilith: true })
    })

    it('知っている項目が1つも無ければ、最初の状態', () => {
      expect(parseShowParam('unknown')).toEqual(DEFAULT_VISIBILITY)
      expect(parseShowParam('ceres,vesta')).toEqual(DEFAULT_VISIBILITY)
      expect(parseShowParam('None')).toEqual(DEFAULT_VISIBILITY)
    })

    it.each(VISIBILITY_KEYS)('%s だけを切り替えても、URLにして、読み取ると、元に戻る', (key) => {
      const visibility = { ...DEFAULT_VISIBILITY, [key]: !DEFAULT_VISIBILITY[key] }
      expect(parseShowParam(toShowParam(visibility))).toEqual(visibility)
    })

    it('最初の状態を、書き換えない', () => {
      parseShowParam('lilith').lilith = false
      parseShowParam(undefined).lilith = true
      expect(DEFAULT_VISIBILITY.lilith).toEqual(false)
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

    it('切り替えの欄は、惑星を先頭にして、2つずつ並べられる', () => {
      // 惑星 / Asc・Mc、Vx / PoF、小惑星 / キロン、ヘッド・テイル / リリス
      expect(VISIBILITY_KEYS[0]).toEqual('ascMc')
      expect((VISIBILITY_KEYS.length - 1) % 2).toEqual(0)
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
