import { describe, it, expect } from 'vitest'
import { spreadLongitudes } from '../../src/horoscope/models'
import { expectToBeCloseTo } from '../test-util'

// 円周の上での差（0〜180度）
const diff = (a: number, b: number) => {
  const d = Math.abs(a - b) % 360
  return d > 180 ? 360 - d : d
}

// 表示する位置の順に並べたときの、隣どうしの間隔
const gaps = (shown: number[]) => {
  const sorted = [...shown].sort((a, b) => a - b)
  return sorted.map((value, i) => (i + 1 < sorted.length ? sorted[i + 1] - value : sorted[0] + 360 - value))
}

// 1987-09-08 08:53 札幌生まれ。惑星 10個、感受点 5個の順
const NAMES = [
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
  'northNode',
  'southNode',
  'lilith',
  'partOfFortune',
  'vertex',
]
const LONGITUDES = [
  164.817337, 348.062352, 180.67738, 169.112858, 160.29299, 29.125698, 254.845661, 262.735112, 275.253885, 217.890372,
  2.374847, 182.374847, 122.301895, 31.153606, 61.847894,
]

describe('記号が重ならないように、表示する位置を求める', () => {
  it('離れていれば、動かさない', () => {
    expectToBeCloseTo(spreadLongitudes([10, 50, 200], 9), [10, 50, 200])
  })

  it('ちょうど決めた間隔なら、動かさない', () => {
    expectToBeCloseTo(spreadLongitudes([10, 19], 9), [10, 19])
  })

  it('近すぎる2つは、本当の位置の平均を中心に、左右に広げる', () => {
    // 平均は 11度。そこから 4.5度ずつ
    expectToBeCloseTo(spreadLongitudes([10, 12], 9), [6.5, 15.5])
  })

  it('結果は、渡した順番で返す', () => {
    expectToBeCloseTo(spreadLongitudes([12, 10], 9), [15.5, 6.5])
    expectToBeCloseTo(spreadLongitudes([200, 12, 50, 10], 9), [200, 15.5, 50, 6.5])
  })

  it('広げた結果、隣と近くなったら、まとめて並べ直す', () => {
    // 10度と 12度を広げると、6.5度と 15.5度。22度との間隔が 6.5度になるので、3つをまとめる。
    // 平均は 44 / 3 = 14.666667度
    expectToBeCloseTo(spreadLongitudes([10, 12, 22], 9), [5.666667, 14.666667, 23.666667])
  })

  it('離れたかたまりは、別々に広げる', () => {
    expectToBeCloseTo(spreadLongitudes([10, 12, 100, 104], 9), [6.5, 15.5, 97.5, 106.5])
  })

  it('黄経0度をまたぐ', () => {
    // 358, 359, 361, 363 の平均は 360.25度
    expectToBeCloseTo(spreadLongitudes([358, 359, 1, 3], 9), [346.75, 355.75, 4.75, 13.75])
  })

  it('範囲の外の黄経も、0〜360度に直して扱う', () => {
    expectToBeCloseTo(spreadLongitudes([370, -348], 9), [6.5, 15.5])
  })

  it('同じ黄経のものは、渡した順番で並べる', () => {
    expectToBeCloseTo(spreadLongitudes([100, 100], 9), [95.5, 104.5])
    expectToBeCloseTo(spreadLongitudes([100, 50, 100, 100], 9), [91, 50, 100, 109])
  })

  it('すべてが同じ位置にある', () => {
    // 15個を、9度ずつ。幅は 126度で、両端は 63度動く
    const shown = spreadLongitudes(Array(15).fill(100), 9)
    expectToBeCloseTo(
      shown,
      Array.from({ length: 15 }, (_, i) => 37 + i * 9)
    )
  })

  it('1個と、0個', () => {
    expectToBeCloseTo(spreadLongitudes([123.456], 9), [123.456])
    expect(spreadLongitudes([], 9)).toEqual([])
  })

  describe('広げた結果、黄経0度をまたいで近くなる', () => {
    // 0度に 4個、300度に 4個、その間に 60度ごと。すき間は、どこも 60度。
    // 間隔を 30度にすると、12個で円をちょうど一周する
    const longitudes = [0, 0, 0, 0, 60, 120, 180, 240, 300, 300, 300, 300]
    const shown = spreadLongitudes(longitudes, 30)

    it('隣どうしの間隔が、どこも狭くならない', () => {
      gaps(shown).forEach((gap) => expect(gap).toBeGreaterThanOrEqual(30 - 1e-6))
    })

    it('位置', () => {
      // 全体が1つのかたまりになる。黄経の平均は 330度
      expectToBeCloseTo(shown, [345, 15, 45, 75, 105, 135, 165, 195, 225, 255, 285, 315])
    })
  })

  describe('円に入りきらない数', () => {
    // 50個を 9度ずつ並べると、450度になる
    const longitudes = Array.from({ length: 50 }, (_, i) => (i < 3 ? i * 3 : 200))
    const shown = spreadLongitudes(longitudes, 9)

    it('間隔を、360度 ÷ 個数に縮める', () => {
      gaps(shown).forEach((gap) => expect(gap).toBeCloseTo(7.2, 5))
    })

    it('0〜360度で返す', () => {
      shown.forEach((value) => {
        expect(value).toBeGreaterThanOrEqual(0)
        expect(value).toBeLessThan(360)
      })
    })
  })

  describe('基準の生年月日', () => {
    const shown = spreadLongitudes(LONGITUDES, 9)
    const of = (name: string) => shown[NAMES.indexOf(name)]

    it('重なっていない記号は、動かない', () => {
      ;['moon', 'northNode', 'vertex', 'lilith', 'pluto', 'neptune'].forEach((name) =>
        expect(of(name)).toBeCloseTo(LONGITUDES[NAMES.indexOf(name)], 5)
      )
    })

    it('火星・太陽・金星・水星・テイルは、1つのかたまりになる', () => {
      // 黄経の平均は 171.455082度。そこから 9度ずつ
      expectToBeCloseTo(
        ['mars', 'sun', 'venus', 'mercury', 'southNode'].map(of),
        [153.455082, 162.455082, 171.455082, 180.455082, 189.455082]
      )
    })

    it('木星と PoF、土星と天王星', () => {
      expectToBeCloseTo(['jupiter', 'partOfFortune'].map(of), [25.639652, 34.639652])
      expectToBeCloseTo(['saturn', 'uranus'].map(of), [254.290387, 263.290387])
    })

    it('隣どうしの間隔が、9度より狭くならない', () => {
      gaps(shown).forEach((gap) => expect(gap).toBeGreaterThanOrEqual(9 - 1e-6))
    })

    it('順番が入れ替わらない', () => {
      const byLongitude = [...NAMES].sort((a, b) => LONGITUDES[NAMES.indexOf(a)] - LONGITUDES[NAMES.indexOf(b)])
      const byShown = [...NAMES].sort((a, b) => of(a) - of(b))
      expect(byShown).toEqual(byLongitude)
    })

    it('動く量は、最大で 7.1度', () => {
      const moves = LONGITUDES.map((longitude, i) => diff(longitude, shown[i]))
      expect(Math.max(...moves)).toBeCloseTo(7.080235, 5)
    })

    it('間隔を 0 にすると、どれも動かない', () => {
      expectToBeCloseTo(spreadLongitudes(LONGITUDES, 0), LONGITUDES)
    })
  })
})
