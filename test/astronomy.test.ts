import { describe, it, expect, afterEach } from 'vitest'
import { mkdtempSync } from 'fs'
import { tmpdir } from 'os'
import { join } from 'path'
import { set_ephe_path } from 'sweph'
import {
  julday,
  eclipticPosition,
  isAsteroidRange,
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

  describe('リリス（月の遠地点）', () => {
    // 平均の位置（Meeus, Astronomical Algorithms）。月の近地点の平均の位置の、反対側
    const meanApogee = (julday_ut: number) => {
      const t = (julday_ut - 2451545) / 36525
      const perigee = 83.3532465 + 4069.0137287 * t - 0.01032 * t * t - (t * t * t) / 80053
      return (((perigee + 180) % 360) + 360) % 360
    }

    it('平均の位置', async () => {
      // 獅子座 2°18′
      expectToBeCloseTo(await eclipticPosition(await julday(funadyBirthday), 'meanApogee'), {
        latitude: 4.501169,
        latitudeSpeed: -0.007147,
        longitude: 122.301895,
        longitudeSpeed: 0.111718,
        distance: 0.00271,
        distanceSpeed: 0,
        rflag: 260,
        isRetrograde: false,
      })
    })
    it.each([
      '1987-09-07T23:53:00Z',
      '2000-01-01T00:00:00Z',
      '2026-03-20T03:00:00Z',
      '1950-06-15T12:00:00Z',
      '1900-01-01T00:00:00Z',
      '2050-12-31T00:00:00Z',
    ])('%s: 別の式で求めた平均の位置から、0.5度以内にある', async (iso) => {
      // NOTE: ライブラリは、月の軌道の傾きを計算に入れるので、0.1度ほどの差が出る。
      // 真位置を計算していれば、1度から20度ほどずれる
      const julday_ut = await julday(new Date(iso))
      const { longitude } = await eclipticPosition(julday_ut, 'meanApogee')
      const diff = Math.abs(longitude - meanApogee(julday_ut))
      expect(Math.min(diff, 360 - diff)).toBeLessThan(0.5)
    })
    it('逆行しない', async () => {
      // 平均の位置は、約9年で1周する速さで、順行を続ける
      const days = Array.from({ length: 60 }, (_, i) => new Date(Date.UTC(2026, 0, 1 + i)))
      const positions = await Promise.all(days.map(async (_) => eclipticPosition(await julday(_), 'meanApogee')))
      expect(positions.filter((_) => _.isRetrograde)).toEqual([])
    })
  })

  describe('小惑星とキロン', () => {
    it.each([
      [
        'chiron', // 双子座 28°16′
        {
          latitude: -5.579595,
          latitudeSpeed: -0.008283,
          longitude: 88.267609,
          longitudeSpeed: 0.036934,
          distance: 13.114626,
          distanceSpeed: -0.018069,
          rflag: 258,
          isRetrograde: false,
        },
      ],
      [
        'ceres', // 射手座 24°00′
        {
          latitude: -4.84861,
          latitudeSpeed: -0.011396,
          longitude: 264.007801,
          longitudeSpeed: 0.152304,
          distance: 2.563962,
          distanceSpeed: 0.014094,
          rflag: 258,
          isRetrograde: false,
        },
      ],
      [
        'pallas', // 蠍座 24°32′
        {
          latitude: 32.904522,
          latitudeSpeed: -0.107794,
          longitude: 234.541626,
          longitudeSpeed: 0.308639,
          distance: 3.273354,
          distanceSpeed: 0.012331,
          rflag: 258,
          isRetrograde: false,
        },
      ],
      [
        'juno', // 水瓶座 26°25′。逆行
        {
          latitude: 6.254035,
          latitudeSpeed: -0.108901,
          longitude: 326.419658,
          longitudeSpeed: -0.223158,
          distance: 1.447619,
          distanceSpeed: 0.00128,
          rflag: 258,
          isRetrograde: true,
        },
      ],
      [
        'vesta', // 蟹座 18°42′
        {
          latitude: -1.509881,
          latitudeSpeed: 0.018216,
          longitude: 108.71123,
          longitudeSpeed: 0.364783,
          distance: 2.986796,
          distanceSpeed: -0.011225,
          rflag: 258,
          isRetrograde: false,
        },
      ],
    ] as const)('%s', async (name, expected) => {
      expectToBeCloseTo(await eclipticPosition(await julday(funadyBirthday), name), expected)
    })

    it('セレスが発見されたときの位置', async () => {
      // 1801-01-01 に、パレルモで発見された。記録の位置は、赤経 51.78度、赤緯 +15.69度（牡牛座）。
      // 黄経に直すと、53.38度
      const { longitude } = await eclipticPosition(await julday(new Date('1801-01-01T19:00:00Z')), 'ceres')
      expect(Math.abs(longitude - 53.38)).toBeLessThan(0.1)
    })

    describe('計算できる日付の範囲', () => {
      // 天体暦のファイル（seas_18.se1）は、1800年から 2399年まで
      it.each([
        ['1799-12-31T23:59:59Z', false],
        ['1800-01-01T00:00:00Z', false], // 光が届くまでの時間をさかのぼるので、初日は計算できない
        ['1800-01-02T00:00:00Z', true],
        ['1987-09-07T23:53:00Z', true],
        ['2399-12-31T23:59:59Z', true],
        ['2400-01-01T00:00:00Z', false],
      ])('%s なら %j', async (iso, expected) => {
        expect(isAsteroidRange(await julday(new Date(iso)))).toEqual(expected)
      })

      it.each(['1800-01-02T00:00:00Z', '2399-12-31T23:59:59Z'])(
        '範囲の端（%s）でも、5つとも計算できる',
        async (iso) => {
          const julday_ut = await julday(new Date(iso))
          for (const name of ['chiron', 'ceres', 'pallas', 'juno', 'vesta'] as const) {
            const { longitude } = await eclipticPosition(julday_ut, name)
            expect(longitude).toBeGreaterThanOrEqual(0)
            expect(longitude).toBeLessThan(360)
          }
        }
      )

      it('範囲の外は、エラーになる', async () => {
        const julday_ut = await julday(new Date('1700-01-01T00:00:00Z'))
        await expect(eclipticPosition(julday_ut, 'ceres')).rejects.toThrow('SwissEph file')
      })
    })

    it('惑星の値は、変わらない', async () => {
      // NOTE: 天体暦のファイルの場所を指定すると、惑星もファイルで計算するようになり、値がわずかに変わる。
      // 惑星は、今までと同じ計算方法（Moshier）を指定する
      const julday_ut = await julday(funadyBirthday)
      expect((await eclipticPosition(julday_ut, 'sun')).longitude).toBeCloseTo(164.817337, NUM_DIGITS)
      expect((await eclipticPosition(julday_ut, 'moon')).longitude).toBeCloseTo(348.062352, NUM_DIGITS)
      expect((await eclipticPosition(julday_ut, 'trueNode')).longitude).toBeCloseTo(2.374847, NUM_DIGITS)
      expect((await eclipticPosition(julday_ut, 'meanApogee')).longitude).toBeCloseTo(122.301895, NUM_DIGITS)
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

    describe('緯度が高いとき', () => {
      // NOTE: プラシーダスとコッホは、極圏（緯度 66.56度より上）では計算できない
      it.each(['', 'K'])('ハウスシステム「%s」は、極圏の手前までは計算できる', async (hsys) => {
        const { house } = await calcHouses(await julday(funadyBirthday), 66, funadyBirthLon, hsys)
        expect(house).toHaveLength(12)
      })
      it.each([
        ['', 67],
        ['', 80],
        ['', -80],
        ['', 90],
        ['K', 67],
        ['K', -80],
      ])('ハウスシステム「%s」は、緯度 %d度では計算できない', async (hsys, lat) => {
        await expect(calcHouses(await julday(funadyBirthday), lat, funadyBirthLon, hsys)).rejects.toThrow(
          `Can't calculate houses.`
        )
      })
      it('ポーフィリーは、極圏でも計算できる', async () => {
        const { house, ascendant } = await calcHouses(await julday(funadyBirthday), 80, funadyBirthLon, 'O')
        expect(house).toHaveLength(12)
        expect(house[0]).toEqual(ascendant)
      })
    })

    describe('ハウスシステム名', () => {
      it.each([
        ['A', 'equal'],
        ['B', 'Alcabitius'],
        ['C', 'Campanus'],
        ['D', 'equal (MC)'],
        ['E', 'equal'],
        ['F', 'Carter poli-equ.'],
        ['G', 'Gauquelin sectors'],
        ['H', 'horizon/azimut'],
        ['I', 'Sunshine'],
        ['i', 'Sunshine/alt.'],
        ['J', 'Savard-A'],
        ['K', 'Koch'],
        ['L', 'Pullen SD'],
        ['M', 'Morinus'],
        ['N', 'equal/1=Aries'],
        ['O', 'Porphyry'],
        ['P', 'Placidus'],
        ['Q', 'Pullen SR'],
        ['R', 'Regiomontanus'],
        ['S', 'Sripati'],
        ['T', 'Polich/Page'],
        ['U', 'Krusinski-Pisa-Goelzer'],
        ['V', 'equal/Vehlow'],
        ['W', 'equal/ whole sign'],
        ['X', 'axial rotation system/Meridian houses'],
        ['Y', 'APC houses'],
      ])('%s は %s', (hsys, expected) => {
        expect(houseSystemName(hsys)).toEqual(expected)
      })
      it.each([undefined, '', 'Z', '?'])('知らない値（%j）は、プラシーダス', (hsys) => {
        expect(houseSystemName(hsys)).toEqual('Placidus')
      })
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
  it('計算できない日付は、エラーになる', async () => {
    // 天体の位置を計算できる範囲（紀元前3000年ごろから、西暦3000年ごろまで）の外
    await expect(equationOfTime(2451545 + 365.25 * 8000)).rejects.toThrow()
    await expect(equationOfTime(2451545 - 365.25 * 8000)).rejects.toThrow()
  })
})

describe('天体暦のファイルが無いとき', () => {
  // NOTE: Vercel では、APIごとに、必要なファイルだけを切り出す。四柱推命のAPIには、天体暦のファイルが入らない
  const funadyBirthday = new Date('1987-09-08T08:53:00+09:00')
  const withoutFiles = () => set_ephe_path(mkdtempSync(join(tmpdir(), 'ephe-')))
  afterEach(() => set_ephe_path(join(process.cwd(), 'ephe')))

  it('均時差は、計算式で求める', async () => {
    // NOTE: ライブラリは、成功の結果に「ファイルが無いので、計算式で求めた」という知らせを付ける。失敗として扱わない
    const julday_ut = await julday(funadyBirthday)
    const expected = await equationOfTime(julday_ut)
    withoutFiles()
    // ファイルがあるときとの差は、0.002秒ほど
    expect(await equationOfTime(julday_ut)).toBeCloseTo(expected, 3)
  })
  it('惑星の値は、変わらない', async () => {
    withoutFiles()
    const julday_ut = await julday(funadyBirthday)
    expect((await eclipticPosition(julday_ut, 'sun')).longitude).toBeCloseTo(164.817337, NUM_DIGITS)
    expect((await eclipticPosition(julday_ut, 'moon')).longitude).toBeCloseTo(348.062352, NUM_DIGITS)
  })
  it('小惑星は、エラーになる', async () => {
    withoutFiles()
    await expect(eclipticPosition(await julday(funadyBirthday), 'ceres')).rejects.toThrow('SwissEph file')
  })
})

describe('黄経から日付を算出', () => {
  it('順行: 3日後に立春', async () => {
    const res = await longitudeToDate(315, new Date('2022-02-01T05:00:48+09:00'), true)
    expect(res).toMatchObject(new Date('2022-02-04T05:50:47+09:00'))
  }, 100_000)
  it('逆行: 1日前に立春', async () => {
    const res = await longitudeToDate(315, new Date('2022-02-05T05:50:46+09:00'), false)
    expect(res).toMatchObject(new Date('2022-02-04T05:50:47+09:00'))
  }, 100_000)
  it('順行: 4か月後に立春', async () => {
    const res = await longitudeToDate(315, new Date('2021-10-05T05:50:46+09:00'), true)
    expect(res).toMatchObject(new Date('2022-02-04T05:50:47+09:00'))
  }, 100_000)
  it('逆行: 4か月前に立春', async () => {
    const res = await longitudeToDate(315, new Date('2022-08-05T05:50:46+09:00'), false)
    expect(res).toMatchObject(new Date('2022-02-04T05:50:47+09:00'))
  }, 100_000)
  it('順行: 1年後に立春', async () => {
    const res = await longitudeToDate(315, new Date('2021-02-03T23:58:47+09:00'), true)
    expect(res).toMatchObject(new Date('2022-02-04T05:50:47+09:00'))
  }, 100_000)
})
