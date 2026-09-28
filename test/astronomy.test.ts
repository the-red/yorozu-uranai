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
