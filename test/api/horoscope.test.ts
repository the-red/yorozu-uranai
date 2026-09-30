import { describe, it, expect, vi, beforeEach, afterEach, MockInstance } from 'vitest'
import horoscope from '../../src/pages/api/horoscope'
import { DEFAULT_ASPECT_SETTINGS, Horoscope, toHoroscopeResult } from '../../src/horoscope/models'
import { NUM_DIGITS } from '../test-util'
import { get } from './test-util'

// 1987-09-08 08:53 札幌生まれ
const query = { date: '19870908', time: '0853', zone: 'Asia/Tokyo', lat: '43.0666666666666666', lng: '141.35' }

describe('/horoscope.json', () => {
  it('入力とページのURLを返す', async () => {
    const { status, json } = await get(horoscope, query)
    expect(status).toEqual(200)
    expect(json.type).toEqual('horoscope')
    expect(json.input).toEqual({
      date: '1987-09-08',
      time: '08:53',
      timeUnknown: false,
      zone: 'Asia/Tokyo',
      lat: 43.06666666666667,
      lng: 141.35,
      aspects: DEFAULT_ASPECT_SETTINGS,
    })
    expect(json.page).toEqual(
      'https://yorozu-uranai.com/horoscope?date=19870908&time=0853&zone=Asia%2FTokyo&lat=43.06666666666667&lng=141.35'
    )
  })

  it('日本生まれ: サーバーのタイムゾーンに依らず、出生地の時刻で計算する', async () => {
    const { json } = await get(horoscope, query)
    const [name, sun] = json.raw.positions[0]
    expect(name).toEqual('sun')
    expect(sun.longitude).toBeCloseTo(164.817337, NUM_DIGITS)
    expect(json.raw.houses.ascendant).toBeCloseTo(207.908591, NUM_DIGITS)

    expect(json.result.planets[0]).toMatchObject({ name: 'sun', nameJa: '太陽', sign: '乙女座', house: 11 })
    expect(json.result.planets[1]).toMatchObject({ name: 'moon', nameJa: '月', sign: '魚座', house: 5 })
    expect(json.result.houses.ascendant.sign).toEqual('天秤座')
    expect(json.result.aspects.settings).toEqual(DEFAULT_ASPECT_SETTINGS)
    expect(json.result.aspects.major).toHaveLength(14)
  })

  it('感受点', async () => {
    const { json } = await get(horoscope, query)
    expect(json.raw.node.longitude).toBeCloseTo(2.374847, NUM_DIGITS)
    expect(json.raw.node.isRetrograde).toEqual(true)
    expect(json.raw.lilith.longitude).toBeCloseTo(122.301895, NUM_DIGITS)
    expect(json.raw.lilith.isRetrograde).toEqual(false)
    expect(json.raw.houses.vertex).toBeCloseTo(61.847894, NUM_DIGITS)

    expect(json.result.points.map((_: any) => [_.name, _.nameJa, _.type, _.variant, _.sign, _.house])).toEqual([
      ['northNode', 'ヘッド', 'node', 'true', '牡羊座', 5],
      ['southNode', 'テイル', 'node', 'true', '天秤座', 11],
      ['lilith', 'リリス', 'apogee', 'mean', '獅子座', 9],
      ['vertex', 'Vx', 'angle', null, '双子座', 8],
      ['partOfFortune', 'PoF', 'lot', 'day', '牡牛座', 7],
    ])
    expect(json.result.points.map((_: any) => _.longitude)).toEqual([
      expect.closeTo(2.374847, NUM_DIGITS),
      expect.closeTo(182.374847, NUM_DIGITS),
      expect.closeTo(122.301895, NUM_DIGITS),
      expect.closeTo(61.847894, NUM_DIGITS),
      expect.closeTo(31.153606, NUM_DIGITS),
    ])
    expect(json.result.aspects.points).toEqual([
      { point: 'southNode', planet: 'mercury', name: 'conjunction', degrees: 0, type: 'hard' },
      { point: 'partOfFortune', planet: 'jupiter', name: 'conjunction', degrees: 0, type: 'hard' },
    ])
    // 惑星は、10個のまま
    expect(json.result.planets).toHaveLength(10)
  })

  it('小惑星とキロン', async () => {
    const { json } = await get(horoscope, query)
    expect(json.raw.asteroids.map(([name]: [string]) => name)).toEqual(['ceres', 'pallas', 'juno', 'vesta', 'chiron'])
    expect(json.raw.asteroids[4][1].longitude).toBeCloseTo(88.267609, NUM_DIGITS)
    expect(json.raw.asteroids[2][1].isRetrograde).toEqual(true)

    expect(json.result.asteroids.map((_: any) => [_.name, _.nameJa, _.type, _.sign, _.house, _.isRetrograde])).toEqual([
      ['ceres', 'セレス', 'asteroid', '射手座', 2, false],
      ['pallas', 'パラス', 'asteroid', '蠍座', 1, false],
      ['juno', 'ジュノ', 'asteroid', '水瓶座', 4, true],
      ['vesta', 'ベスタ', 'asteroid', '蟹座', 9, false],
      ['chiron', 'キロン', 'centaur', '双子座', 8, false],
    ])
    expect(json.result.aspects.asteroids).toEqual([
      { asteroid: 'ceres', planet: 'uranus', name: 'conjunction', degrees: 0, type: 'hard' },
    ])
  })

  it.each([
    ['17000615', '1700年'],
    ['24500615', '2450年'],
  ])('小惑星を計算できない日付（%s）でも、ほかは返す', async (date) => {
    // 天体暦のファイルは、1800年から 2399年まで
    const { status, json } = await get(horoscope, { ...query, date })
    expect(status).toEqual(200)
    expect(json.raw.asteroids).toBeNull()
    expect(json.result.asteroids).toBeNull()
    expect(json.result.aspects.asteroids).toEqual([])
    expect(json.result.planets).toHaveLength(10)
    expect(json.result.points).toHaveLength(5)
  })

  describe('アスペクトの求め方', () => {
    it('クエリで指定できる', async () => {
      const { status, json } = await get(horoscope, { ...query, orb: '1', minor: '150', pointOrb: '1' })
      expect(status).toEqual(200)
      expect(json.input.aspects).toEqual({
        ...DEFAULT_ASPECT_SETTINGS,
        orb: 1,
        minor: [150],
        point: { aspects: 'conjunction', orb: 1 },
      })
      expect(json.result.aspects.settings).toEqual(json.input.aspects)
      expect(json.result.aspects.major.map((_: any) => _.planets)).toEqual([['sun', 'saturn']])
      expect(json.result.aspects.minor.map((_: any) => _.planets)).toEqual([['mercury', 'jupiter']])
      expect(json.result.aspects.points).toEqual([])
      // 天文計算の結果は、変わらない
      expect(json.raw).toEqual((await get(horoscope, query)).json.raw)
    })
    it('ページのURLにも、同じ指定を付ける', async () => {
      const { json } = await get(horoscope, { ...query, orb: '8', minor: '30,150', orbs: 'x' })
      expect(new URL(json.page).search).toEqual(
        '?date=19870908&time=0853&zone=Asia%2FTokyo&lat=43.06666666666667&lng=141.35&orb=8&minor=30%2C150'
      )
    })
    it('読み取れない値は、エラーにする', async () => {
      const { status, json } = await get(horoscope, { ...query, orb: '99', ascMcAspects: 'all' })
      expect(status).toEqual(400)
      expect(json).toEqual({
        error: {
          code: 'invalid_query',
          message: 'orb is invalid, ascMcAspects is invalid',
          params: ['orb', 'ascMcAspects'],
        },
      })
    })
  })

  it('海外生まれ: 同じ瞬間なら、同じ結果になる', async () => {
    // 日本時間の 1987-09-08 08:53 は、ニューヨークでは前日の 19:53（サマータイム）
    const tokyo = await get(horoscope, query)
    const newYork = await get(horoscope, { ...query, date: '19870907', time: '1953', zone: 'America/New_York' })
    expect(newYork.json.raw).toEqual(tokyo.json.raw)
    expect(newYork.json.result).toEqual(tokyo.json.result)
  })

  it('材料からモデルを復元して変換し直すと、結果と一致する', async () => {
    const { json } = await get(horoscope, query)
    const restored = toHoroscopeResult(new Horoscope(json.raw), json.input.aspects)
    expect(JSON.parse(JSON.stringify(restored))).toEqual(json.result)
  })

  it('時刻不明なら、12:00 で計算する', async () => {
    const unknown = await get(horoscope, { ...query, time: 'unknown' })
    const noon = await get(horoscope, { ...query, time: '1200' })
    expect(unknown.json.input).toMatchObject({ time: '12:00', timeUnknown: true })
    expect(unknown.json.page).toContain('time=unknown')
    expect(unknown.json.result).toEqual(noon.json.result)
  })

  describe('ヘッダー', () => {
    it('成功したらキャッシュさせる', async () => {
      const { headers } = await get(horoscope, query)
      expect(headers).toEqual({ 'cache-control': 'public, max-age=0, s-maxage=86400', 'x-robots-tag': 'noindex' })
    })
    it('エラーはキャッシュさせない', async () => {
      const { headers } = await get(horoscope, {})
      expect(headers).toEqual({ 'cache-control': 'no-store', 'x-robots-tag': 'noindex' })
    })
  })

  describe('ページのURLのオリジン', () => {
    it('リクエストのヘッダーから求める', async () => {
      const headers = { 'host': 'localhost:3000', 'x-forwarded-proto': 'http' }
      const { json } = await get(horoscope, query, { headers })
      expect(json.page.startsWith('http://localhost:3000/horoscope?')).toEqual(true)
    })
    it.each(['javascript', 'ftp', ''])('プロトコルが %j なら、https にする', async (proto) => {
      const headers = { 'host': 'yorozu-uranai.com', 'x-forwarded-proto': proto }
      const { json } = await get(horoscope, query, { headers })
      expect(json.page.startsWith('https://yorozu-uranai.com/horoscope?')).toEqual(true)
    })
    it('ホストが分からなければ、パスだけにする', async () => {
      const { json } = await get(horoscope, query, { headers: {} })
      expect(json.page.startsWith('/horoscope?')).toEqual(true)
    })
  })

  describe('エラー', () => {
    let consoleError: MockInstance
    beforeEach(() => {
      consoleError = vi.spyOn(console, 'error').mockImplementation(() => {})
    })
    afterEach(() => {
      consoleError.mockRestore()
    })

    it('必須のパラメータが無い', async () => {
      const { status, json } = await get(horoscope, { date: '19870908' })
      expect(status).toEqual(400)
      expect(json).toEqual({
        error: {
          code: 'invalid_query',
          message: 'zone is required, lat is required, lng is required',
          params: ['zone', 'lat', 'lng'],
        },
      })
    })
    it('極地ではハウスを計算できない', async () => {
      const { status, json } = await get(horoscope, { ...query, lat: '80' })
      expect(status).toEqual(400)
      expect(json).toEqual({
        error: {
          code: 'calculation_failed',
          message: 'Houses cannot be calculated at this latitude',
          params: ['lat'],
        },
      })
    })
    it('天体の位置を計算できない年', async () => {
      const { status, json } = await get(horoscope, { ...query, date: '99991231' })
      expect(status).toEqual(400)
      // ライブラリのエラーメッセージ（内部のファイル名やパスを含む）を、そのまま返さない
      expect(json).toEqual({
        error: { code: 'calculation_failed', message: 'This date cannot be calculated', params: ['date'] },
      })
    })
    it('計算できなかった原因を、ログに残す', async () => {
      await get(horoscope, { ...query, date: '99991231' })
      expect(consoleError).toHaveBeenCalledTimes(1)
      expect(String(consoleError.mock.calls[0][0])).toContain('outside Moshier planet range')
    })
    it('GET以外', async () => {
      const { status, json, headers } = await get(horoscope, query, { method: 'POST' })
      expect(status).toEqual(405)
      expect(json).toEqual({ error: { code: 'method_not_allowed', message: 'Use GET', params: [] } })
      expect(headers.allow).toEqual('GET')
    })
  })
})
