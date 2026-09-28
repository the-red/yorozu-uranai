import { describe, it, expect, afterEach } from 'vitest'
import type { NextApiRequest, NextApiResponse } from 'next'
import { Settings } from 'luxon'
import suimeiProps from '../src/pages/api/suimei-props'

const post = async (body: { dateTime: string; gender: 'man' | 'woman'; lng?: number; thisYear?: number }) => {
  let status: number | undefined
  let json: any
  const res = {
    status(code: number) {
      status = code
      return res
    },
    json(data: unknown) {
      json = data
    },
  }
  await suimeiProps({ body } as NextApiRequest, res as unknown as NextApiResponse)
  return { status, json }
}

describe('/api/suimei-props', () => {
  it('日本生まれ: サーバーのタイムゾーンに依らず、日本の暦で計算する', async () => {
    // 日柱は庚申、月柱は戊申（白露の前）
    const { status, json } = await post({
      dateTime: '1987-09-08T08:53:00.000+09:00',
      gender: 'woman',
      lng: 141.35,
      thisYear: 2023,
    })
    expect(status).toEqual(200)
    expect(json.sekkiPair).toEqual({ today: '立秋', endOfMonth: '白露' })
    expect(json.equationOfTime).toBeCloseTo(2.05, 0)
    expect(json.daiun[0]).toMatchObject({
      kanshi: '戊申',
      tenkanTsuhensei: '偏印',
      zoukanTsuhensei: '比肩',
      juuniun: '建禄',
    })
  })

  it('海外生まれ: 出生地の暦で計算する', async () => {
    // ニューヨークで 1987-09-08 20:00 生まれ（日本時間では 09-09 09:00）
    // 日柱は庚申、月柱は己酉（白露の後）
    const { status, json } = await post({
      dateTime: '1987-09-08T20:00:00.000-04:00',
      gender: 'woman',
      lng: -74.006,
      thisYear: 2023,
    })
    expect(status).toEqual(200)
    expect(json.sekkiPair).toEqual({ today: '白露', endOfMonth: '白露' })
    expect(json.daiun[0]).toMatchObject({
      kanshi: '己酉',
      tenkanTsuhensei: '印綬',
      zoukanTsuhensei: '劫財',
      juuniun: '帝旺',
    })
  })

  it('大運は真太陽時の日干で計算する', async () => {
    // 札幌で 09-08 23:50 生まれ。真太陽時では 09-09 00:17 なので、日柱は庚申ではなく辛酉
    const { status, json } = await post({
      dateTime: '1987-09-08T23:50:00.000+09:00',
      gender: 'woman',
      lng: 141.35,
      thisYear: 2023,
    })
    expect(status).toEqual(200)
    expect(json.daiun[0]).toMatchObject({
      kanshi: '己酉',
      tenkanTsuhensei: '偏印',
      zoukanTsuhensei: '比肩',
      juuniun: '建禄',
    })
  })

  describe('大運の「現在」の行', () => {
    afterEach(() => {
      Settings.now = () => Date.now()
    })

    const currentRow = (json: any) => json.daiun.filter((_: any) => _.thisYear).map((_: any) => _.fromAge)

    it('閲覧者から送られてきた年で判定する', async () => {
      // 1987年生まれ。2028年なら41歳（41〜50歳の行）、2027年なら40歳（31〜40歳の行）
      const body = { dateTime: '1987-09-08T08:53:00.000+09:00', gender: 'woman', lng: 141.35 } as const
      expect(currentRow((await post({ ...body, thisYear: 2028 })).json)).toEqual([41])
      expect(currentRow((await post({ ...body, thisYear: 2027 })).json)).toEqual([31])
    })
    it('サーバーの時計は使わない', async () => {
      Settings.now = () => new Date('2050-01-01T00:00:00Z').getTime()
      const body = { dateTime: '1987-09-08T08:53:00.000+09:00', gender: 'woman', lng: 141.35 } as const
      expect(currentRow((await post({ ...body, thisYear: 2028 })).json)).toEqual([41])
    })
  })

  it('不正な日時はエラー', async () => {
    const { status, json } = await post({ dateTime: 'invalid', gender: 'woman', lng: 141.35, thisYear: 2023 })
    expect(status).toEqual(400)
    expect(json).toEqual({ errorMessage: 'Invalid birthday' })
  })

  it('経度が無ければエラー', async () => {
    const { status, json } = await post({ dateTime: '1987-09-08T08:53:00.000+09:00', gender: 'woman', thisYear: 2023 })
    expect(status).toEqual(400)
    expect(json).toEqual({ errorMessage: 'Invalid longitude' })
  })

  it('現在の年が無ければエラー', async () => {
    const { status, json } = await post({ dateTime: '1987-09-08T08:53:00.000+09:00', gender: 'woman', lng: 141.35 })
    expect(status).toEqual(400)
    expect(json).toEqual({ errorMessage: 'Invalid thisYear' })
  })
})
