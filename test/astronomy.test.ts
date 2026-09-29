import { describe, it, expect } from 'vitest'
import {
  julday,
  eclipticPosition,
  calcHouses,
  houseSystemName,
  longitudeToDate,
  equationOfTime,
} from '../src/astronomy'
import { NUM_DIGITS, expectToBeCloseTo } from './test-util'

describe('astronomy', () => {
  const funadyBirthday = new Date('1987-09-08T08:53:00+09:00')
  const funadyBirthLat = 43.0666666666666666 // 43°04′
  const funadyBirthLon = 141.35 // 141°21′

  describe('ユリウス日', () => {
    it('ユリウス日', async () => {
      expect(await julday(funadyBirthday)).toBeCloseTo(2447046.4951388887, NUM_DIGITS)
    })
    it('J2000.0（2000年1月1日 正午）', async () => {
      expect(await julday(new Date('2000-01-01T12:00:00Z'))).toEqual(2451545)
    })
    it('秒とミリ秒', async () => {
      // 12時間30秒500ミリ秒 = 0.5 + 30.5 / 86400 日
      expect(await julday(new Date('2000-01-01T00:00:30.500Z'))).toBeCloseTo(2451544.5 + 30.5 / 86400, 8)
    })
    it('標準時が制定される前の日付も、実行環境のタイムゾーンに依らない', async () => {
      // NOTE: 標準時の制定より前は、タイムゾーンのオフセットに秒の端数がある（東京は +9:18:59）
      expect(await julday(new Date('1880-01-01T03:00:00Z'))).toEqual(2407715.625)
      expect(await julday(new Date('1700-06-15T18:00:00Z'))).toEqual(2342138.25)
    })
  })

  describe('黄道座標', () => {
    it('太陽', async () => {
      expectToBeCloseTo(await eclipticPosition(await julday(funadyBirthday), 'sun'), {
        latitude: -0.000063,
        latitudeSpeed: 0.00004,
        longitude: 164.817337,
        longitudeSpeed: 0.970187,
        distance: 1.007604,
        distanceSpeed: -0.000254,
        rflag: 260,
        isRetrograde: false,
      })
    })
    it('月', async () => {
      expectToBeCloseTo(await eclipticPosition(await julday(funadyBirthday), 'moon'), {
        latitude: -1.303161,
        latitudeSpeed: 1.30799,
        longitude: 348.062352,
        longitudeSpeed: 14.677112,
        distance: 0.002432,
        distanceSpeed: 0.00002,
        rflag: 260,
        isRetrograde: false,
      })
    })
    it('海王星', async () => {
      expectToBeCloseTo(await eclipticPosition(await julday(funadyBirthday), 'neptune'), {
        latitude: 1.018576,
        latitudeSpeed: -0.000705,
        longitude: 275.253885,
        longitudeSpeed: -0.005075,
        distance: 29.866133,
        distanceSpeed: 0.015932,
        rflag: 260,
        isRetrograde: true,
      })
    })
  })

  describe('ドラゴンヘッド（月の昇交点）', () => {
    // 平均の位置（Meeus, Astronomical Algorithms）。ライブラリとは別の方法で求める
    const meanNode = (julday_ut: number) => {
      const t = (julday_ut - 2451545) / 36525
      return (((125.04452 - 1934.136261 * t + 0.0020708 * t * t) % 360) + 360) % 360
    }

    it('真位置', async () => {
      // 牡羊座 2°22′
      expectToBeCloseTo(await eclipticPosition(await julday(funadyBirthday), 'trueNode'), {
        latitude: 0,
        latitudeSpeed: 0,
        longitude: 2.374847,
        longitudeSpeed: -0.016159,
        distance: 0.002456,
        distanceSpeed: 0.000001,
        rflag: 260,
        isRetrograde: true,
      })
    })
    it.each(['1987-09-07T23:53:00Z', '2000-01-01T00:00:00Z', '2026-03-20T03:00:00Z', '1950-06-15T12:00:00Z'])(
      '%s: 真位置は、平均の位置から 2度以内にある',
      async (iso) => {
        // NOTE: 真位置は、平均の位置の前後を、最大で 1.7度ほど揺れ動く。
        // 別の天体（月の遠地点など）を計算していれば、大きくずれる
        const julday_ut = await julday(new Date(iso))
        const { longitude } = await eclipticPosition(julday_ut, 'trueNode')
        const diff = Math.abs(longitude - meanNode(julday_ut))
        expect(Math.min(diff, 360 - diff)).toBeLessThan(2)
      }
    )
    it('順行することもある', async () => {
      // 真位置は、ほとんどの期間は逆行するが、短い期間だけ順行する
      const days = Array.from({ length: 60 }, (_, i) => new Date(Date.UTC(2026, 0, 1 + i)))
      const positions = await Promise.all(days.map(async (_) => eclipticPosition(await julday(_), 'trueNode')))
      const retrograde = positions.filter((_) => _.isRetrograde).length
      expect(retrograde).toBeGreaterThan(30)
      expect(retrograde).toBeLessThan(60)
    })
  })

  describe('ハウス', () => {
    it('プラシーダス（デフォルト）', async () => {
      expectToBeCloseTo(await calcHouses(await julday(funadyBirthday), funadyBirthLat, funadyBirthLon), {
        house: [
          207.908591, 235.781911, 268.307258, 303.803709, 337.205891, 5.251311, 27.908591, 55.781911, 88.307258,
          123.803709, 157.205891, 185.251311,
        ],
        ascendant: 207.908591,
        mc: 123.803709,
        armc: 126.121101,
        vertex: 61.847894,
        equatorialAscendant: 218.500087,
        kochCoAscendant: 237.939031,
        munkaseyCoAscendant: 206.8052,
        munkaseyPolarAscendant: 57.939031,
      })
    })

    it('コッホ', async () => {
      expectToBeCloseTo(await calcHouses(await julday(funadyBirthday), funadyBirthLat, funadyBirthLon, 'K'), {
        house: [
          207.908591, 235.809886, 265.452867, 303.803709, 331.708461, 359.806556, 27.908591, 55.809886, 85.452867,
          123.803709, 151.708461, 179.806556,
        ],
        ascendant: 207.908591,
        mc: 123.803709,
        armc: 126.121101,
        vertex: 61.847894,
        equatorialAscendant: 218.500087,
        kochCoAscendant: 237.939031,
        munkaseyCoAscendant: 206.8052,
        munkaseyPolarAscendant: 57.939031,
      })
    })

    it('ハウスシステム名', async () => {
      expect(houseSystemName('A')).toEqual('equal')
      expect(houseSystemName()).toEqual('Placidus')
    })
  })
})

describe('均時差', () => {
  // 期待値は暦の一般的な値（年による違いは数秒程度）。分単位で、0.5分未満の差なら一致とみなす
  const MINUTE_DIGITS = 0
  const getEquationOfTime = async (iso: string) => equationOfTime(await julday(new Date(iso)))

  it('9月上旬はほぼ0（視太陽時がわずかに進んでいる）', async () => {
    expect(await getEquationOfTime('1987-09-08T08:53:00+09:00')).toBeCloseTo(2.05, MINUTE_DIGITS)
  })
  it('11月上旬は視太陽時が最も進んでいる', async () => {
    expect(await getEquationOfTime('2023-11-03T12:00:00+09:00')).toBeCloseTo(16.4, MINUTE_DIGITS)
  })
  it('2月中旬は視太陽時が最も遅れている', async () => {
    expect(await getEquationOfTime('2023-02-11T12:00:00+09:00')).toBeCloseTo(-14.2, MINUTE_DIGITS)
  })
})

describe('黄経から日付を算出', () => {
  it('順行: 3日後に立春', async () => {
    const res = await longitudeToDate(315, new Date('2022-02-01T05:00:48+09:00'), true)
    expect(res).toMatchObject(new Date('2022-02-04T05:50:46+09:00'))
  }, 100_000)
  it('逆行: 1日前に立春', async () => {
    const res = await longitudeToDate(315, new Date('2022-02-05T05:50:46+09:00'), false)
    expect(res).toMatchObject(new Date('2022-02-04T05:50:46+09:00'))
  }, 100_000)
  it('順行: 4か月後に立春', async () => {
    const res = await longitudeToDate(315, new Date('2021-10-05T05:50:46+09:00'), true)
    expect(res).toMatchObject(new Date('2022-02-04T05:50:46+09:00'))
  }, 100_000)
  it('逆行: 4か月前に立春', async () => {
    const res = await longitudeToDate(315, new Date('2022-08-05T05:50:46+09:00'), false)
    expect(res).toMatchObject(new Date('2022-02-04T05:50:46+09:00'))
  }, 100_000)
  it('順行: 1年後に立春', async () => {
    const res = await longitudeToDate(315, new Date('2021-02-03T23:58:47+09:00'), true)
    expect(res).toMatchObject(new Date('2022-02-04T05:50:46+09:00'))
  }, 100_000)
})
