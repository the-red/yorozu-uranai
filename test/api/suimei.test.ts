import { describe, it, expect, afterEach } from 'vitest'
import { Settings } from 'luxon'
import suimei from '../../src/pages/api/suimei'
import { restoreKanshi, toDaiun, toSuimeiResult } from '../../src/suimei/models'
import { generateSaiun } from '../../src/suimei/models/Saiun'
import { toDateTime } from '../../src/lib/json-query'
import { get } from './test-util'

// 1987-09-08 08:53 札幌生まれ
const query = { date: '19870908', time: '0853', zone: 'Asia/Tokyo', lng: '141.35', gender: 'woman' }

describe('/suimei.json', () => {
  it('入力とページのURLを返す', async () => {
    const { status, json } = await get(suimei, { ...query, lat: '43.06', thisYear: '2023' })
    expect(status).toEqual(200)
    expect(json.type).toEqual('suimei')
    expect(json.input).toEqual({
      date: '1987-09-08',
      time: '08:53',
      timeUnknown: false,
      zone: 'Asia/Tokyo',
      lng: 141.35,
      gender: 'woman',
      thisYear: 2023,
    })
    // 現在の年は、ページがブラウザで求めるので付けない
    expect(json.page).toEqual(
      'https://yorozu-uranai.com/suimei?date=19870908&time=0853&zone=Asia%2FTokyo&lng=141.35&gender=woman'
    )
  })

  it('日本生まれ: サーバーのタイムゾーンに依らず、日本の暦で計算する', async () => {
    // 日柱は庚申、月柱は戊申（白露の前）
    const { json } = await get(suimei, { ...query, thisYear: '2023' })
    expect(json.raw.sekkiPair).toEqual({ today: '立秋', endOfMonth: '白露' })
    expect(json.raw.equationOfTime).toBeCloseTo(2.0069, 2)
    expect(json.result.節).toEqual('立秋')
    expect(json.result.真太陽時.dateTime).toEqual('1987-09-08T09:20')
    expect(json.result.命式.月柱.干支).toEqual('戊申')
    expect(json.result.命式.日柱.干支).toEqual('庚申')
    expect(json.result.大運[0]).toMatchObject({ 干支: '戊申', 通変星: '偏印', 蔵干通変星: '比肩', 十二運: '建禄' })
  })

  it('海外生まれ: 出生地の暦で計算する', async () => {
    // ニューヨークで 1987-09-08 20:00 生まれ（日本時間では 09-09 09:00）
    // 日柱は庚申、月柱は己酉（白露の後）
    const newYork = { date: '19870908', time: '2000', zone: 'America/New_York', lng: '-74.006', gender: 'woman' }
    const { status, json } = await get(suimei, { ...newYork, thisYear: '2023' })
    expect(status).toEqual(200)
    expect(json.raw.sekkiPair).toEqual({ today: '白露', endOfMonth: '白露' })
    expect(json.result.真太陽時.dateTime).toEqual('1987-09-08T19:06')
    expect(json.result.命式.月柱.干支).toEqual('己酉')
    expect(json.result.命式.日柱.干支).toEqual('庚申')
    expect(json.result.大運[0]).toMatchObject({ 干支: '己酉', 通変星: '印綬', 蔵干通変星: '劫財', 十二運: '帝旺' })
  })

  it('大運は真太陽時の日干で計算する', async () => {
    // 札幌で 09-08 23:50 生まれ。真太陽時では 09-09 00:17 なので、日柱は庚申ではなく辛酉
    const { json } = await get(suimei, { ...query, time: '2350', thisYear: '2023' })
    expect(json.result.命式.日柱.干支).toEqual('辛酉')
    expect(json.result.大運[0]).toMatchObject({ 干支: '己酉', 通変星: '偏印', 蔵干通変星: '比肩', 十二運: '建禄' })
  })

  it('性別で大運の向きが変わる', async () => {
    const woman = await get(suimei, { ...query, gender: 'woman' })
    const man = await get(suimei, { ...query, gender: 'man' })
    const on = await get(suimei, { ...query, gender: 'on' })
    expect(woman.json.result.大運[1].干支).toEqual('己酉')
    expect(man.json.result.大運[1].干支).toEqual('丁未')
    // 以前のURLの on は、女性として返す
    expect(on.json.input.gender).toEqual('woman')
    expect(on.json.result).toEqual(woman.json.result)
  })

  it('材料からモデルを復元して変換し直すと、結果と一致する', async () => {
    const { json } = await get(suimei, { ...query, thisYear: '2023' })
    const dateTime = toDateTime(json.input)
    const { solarTime, kanshi } = restoreKanshi(dateTime, json.input.lng, json.raw)
    const { sekkiPair } = json.raw
    const restored = toSuimeiResult({
      sekkiPair,
      solarTime,
      kanshi,
      daiun: json.result.大運.map(toDaiun),
      saiun: generateSaiun(kanshi, dateTime, sekkiPair, 2023, 2018, 2033),
      hasThisYear: true,
    })
    expect(JSON.parse(JSON.stringify(restored))).toEqual(json.result)
  })

  describe('現在の年', () => {
    afterEach(() => {
      Settings.now = () => Date.now()
    })

    const currentDaiun = (json: any) => json.result.大運.filter((_: any) => _.current).map((_: any) => _.fromAge)
    const currentSaiun = (json: any) => json.result.歳運.filter((_: any) => _.current).map((_: any) => _.year)
    const years = (json: any) => json.result.歳運.map((_: any) => _.year)

    it('閲覧者から送られてきた年で判定する', async () => {
      // 1987年生まれ。2028年なら41歳（41〜50歳の行）、2027年なら40歳（31〜40歳の行）
      const in2028 = await get(suimei, { ...query, thisYear: '2028' })
      const in2027 = await get(suimei, { ...query, thisYear: '2027' })
      expect(currentDaiun(in2028.json)).toEqual([41])
      expect(currentDaiun(in2027.json)).toEqual([31])
      expect(currentSaiun(in2028.json)).toEqual([2028])
    })
    it('サーバーの時計は使わない', async () => {
      Settings.now = () => new Date('2050-01-01T00:00:00Z').getTime()
      const { json } = await get(suimei, { ...query, thisYear: '2028' })
      expect(currentDaiun(json)).toEqual([41])
    })
    it('歳運は、5年前から10年後まで', async () => {
      const { json } = await get(suimei, { ...query, thisYear: '2028' })
      expect(years(json)).toHaveLength(16)
      expect([years(json)[0], years(json).at(-1)]).toEqual([2023, 2038])
    })
    it('歳運に、生まれ年より前は含めない', async () => {
      const { json } = await get(suimei, { ...query, thisYear: '1989' })
      expect([years(json)[0], years(json).at(-1)]).toEqual([1987, 1999])
    })
    it('生まれ年より前の年を渡しても、計算が終わる', async () => {
      const { json } = await get(suimei, { ...query, thisYear: '1900' })
      expect([years(json)[0], years(json).at(-1)]).toEqual([1987, 1997])
      expect(currentDaiun(json)).toEqual([])
    })

    describe('無いとき', () => {
      it('current を付けない', async () => {
        const { json } = await get(suimei, query)
        expect(json.input.thisYear).toBeNull()
        expect(json.result.大運.some((_: any) => 'current' in _)).toEqual(false)
        expect(json.result.歳運.some((_: any) => 'current' in _)).toEqual(false)
      })
      it('歳運は、生まれ年から120年後まで', async () => {
        const { json } = await get(suimei, query)
        expect(years(json)).toHaveLength(121)
        expect([years(json)[0], years(json).at(-1)]).toEqual([1987, 2107])
      })
      it('サーバーの時計は使わない', async () => {
        const before = await get(suimei, query)
        Settings.now = () => new Date('2050-01-01T00:00:00Z').getTime()
        const after = await get(suimei, query)
        expect(after.json).toEqual(before.json)
      })
    })
  })

  it('時刻不明なら、12:00 で計算する', async () => {
    const unknown = await get(suimei, { ...query, time: 'unknown' })
    const noon = await get(suimei, { ...query, time: '1200' })
    expect(unknown.json.input).toMatchObject({ time: '12:00', timeUnknown: true })
    expect(unknown.json.page).toContain('time=unknown')
    expect(unknown.json.result).toEqual(noon.json.result)
  })

  it('成功したらキャッシュさせる', async () => {
    const { headers } = await get(suimei, query)
    expect(headers).toEqual({ 'cache-control': 'public, max-age=0, s-maxage=86400', 'x-robots-tag': 'noindex' })
  })

  describe('エラー', () => {
    it('必須のパラメータが無い', async () => {
      const { status, json, headers } = await get(suimei, { date: '19870908', zone: 'Asia/Tokyo' })
      expect(status).toEqual(400)
      expect(json).toEqual({
        error: { code: 'invalid_query', message: 'lng is required, gender is required', params: ['lng', 'gender'] },
      })
      expect(headers['cache-control']).toEqual('no-store')
    })
    it('現在の年が大きすぎる', async () => {
      const { status, json } = await get(suimei, { ...query, thisYear: '9007199254740993' })
      expect(status).toEqual(400)
      expect(json.error).toMatchObject({ code: 'invalid_query', params: ['thisYear'] })
    })
    it('節入りを計算できない年', async () => {
      const { status, json } = await get(suimei, { ...query, date: '99991231' })
      expect(status).toEqual(400)
      expect(json.error.code).toEqual('calculation_failed')
    })
    it('GET以外', async () => {
      const { status, json } = await get(suimei, query, { method: 'POST' })
      expect(status).toEqual(405)
      expect(json.error.code).toEqual('method_not_allowed')
    })
  })
})
