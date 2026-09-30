import { describe, it, expect, vi, beforeEach, afterEach, MockInstance } from 'vitest'
import horoscope from '../../src/pages/api/horoscope'
import { DEFAULT_ASPECT_SETTINGS, HOUSE_SYSTEMS, Horoscope, toHoroscopeResult } from '../../src/horoscope/models'
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
      house: 'placidus',
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
      ['vertex', 'Vx', 'angle', null, '双子座', 8],
      ['partOfFortune', 'PoF', 'lot', 'day', '牡牛座', 7],
      ['northNode', 'ヘッド', 'node', 'true', '牡羊座', 5],
      ['southNode', 'テイル', 'node', 'true', '天秤座', 11],
      ['lilith', 'リリス', 'apogee', 'mean', '獅子座', 9],
    ])
    expect(json.result.points.map((_: any) => _.longitude)).toEqual([
      expect.closeTo(61.847894, NUM_DIGITS),
      expect.closeTo(31.153606, NUM_DIGITS),
      expect.closeTo(2.374847, NUM_DIGITS),
      expect.closeTo(182.374847, NUM_DIGITS),
      expect.closeTo(122.301895, NUM_DIGITS),
    ])
    expect(json.result.aspects.points).toEqual([
      { point: 'partOfFortune', planet: 'jupiter', name: 'conjunction', degrees: 0, type: 'hard' },
      { point: 'southNode', planet: 'mercury', name: 'conjunction', degrees: 0, type: 'hard' },
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

  describe('ハウスシステム', () => {
    it('指定が無ければ、プラシーダス', async () => {
      const { json } = await get(horoscope, query)
      expect(json.result.houses.system).toEqual('placidus')
      expect(json.raw.houses.house[1]).toBeCloseTo(235.781911, NUM_DIGITS)
    })
    it('コッホ', async () => {
      const { status, json } = await get(horoscope, { ...query, house: 'koch' })
      expect(status).toEqual(200)
      expect(json.input.house).toEqual('koch')
      expect(json.result.houses.system).toEqual('koch')
      // 2ハウスと 3ハウスのカスプが、プラシーダスと違う（test/astronomy.test.ts の「コッホ」）
      expect(json.raw.houses.house[1]).toBeCloseTo(235.809886, NUM_DIGITS)
      expect(json.raw.houses.house[2]).toBeCloseTo(265.452867, NUM_DIGITS)
      expect(new URL(json.page).searchParams.get('house')).toEqual('koch')
    })
    it('ホールサイン: Asc のあるサイン（天秤座）が、まるごと 1ハウス', async () => {
      const { json } = await get(horoscope, { ...query, house: 'wholeSign' })
      expect(json.raw.houses.house).toEqual([180, 210, 240, 270, 300, 330, 0, 30, 60, 90, 120, 150])
      // カスプは、どれも、サインの 0度
      expect(json.result.houses.cusps.map((_: any) => [_.house, _.sign, _.degrees])).toEqual([
        [1, '天秤座', 0],
        [2, '蠍座', 0],
        [3, '射手座', 0],
        [4, '山羊座', 0],
        [5, '水瓶座', 0],
        [6, '魚座', 0],
        [7, '牡羊座', 0],
        [8, '牡牛座', 0],
        [9, '双子座', 0],
        [10, '蟹座', 0],
        [11, '獅子座', 0],
        [12, '乙女座', 0],
      ])
      // Asc と Mc は、ハウスシステムに依らない
      expect(json.raw.houses.ascendant).toBeCloseTo(207.908591, NUM_DIGITS)
      expect(json.raw.houses.mc).toBeCloseTo(123.803709, NUM_DIGITS)
      // 惑星のハウスは、サインで決まる。太陽（乙女座）は 12ハウス、月（魚座）は 6ハウス、水星（天秤座）は 1ハウス
      expect(json.result.planets.slice(0, 3).map((_: any) => [_.name, _.sign, _.house])).toEqual([
        ['sun', '乙女座', 12],
        ['moon', '魚座', 6],
        ['mercury', '天秤座', 1],
      ])
    })
    it('ソーラーサイン: 太陽のあるサイン（乙女座）が、まるごと 1ハウス', async () => {
      const { status, json } = await get(horoscope, { ...query, house: 'solarSign' })
      expect(status).toEqual(200)
      expect(json.input.house).toEqual('solarSign')
      expect(json.result.houses.system).toEqual('solarSign')
      expect(json.raw.houses.house).toEqual([150, 180, 210, 240, 270, 300, 330, 0, 30, 60, 90, 120])
      // Asc、Mc、Vx は、ハウスシステムに依らない
      expect(json.raw.houses.ascendant).toBeCloseTo(207.908591, NUM_DIGITS)
      expect(json.raw.houses.mc).toBeCloseTo(123.803709, NUM_DIGITS)
      expect(json.raw.houses.vertex).toBeCloseTo(61.847894, NUM_DIGITS)
      // 惑星のハウスは、サインで決まる。太陽（乙女座）は 1ハウス、月（魚座）は 7ハウス、水星（天秤座）は 2ハウス
      expect(json.result.planets.slice(0, 3).map((_: any) => [_.name, _.sign, _.house])).toEqual([
        ['sun', '乙女座', 1],
        ['moon', '魚座', 7],
        ['mercury', '天秤座', 2],
      ])
      expect(new URL(json.page).searchParams.get('house')).toEqual('solarSign')
    })
    it('イコール: Asc から、30度ずつ', async () => {
      const { json } = await get(horoscope, { ...query, house: 'equal' })
      const { house, ascendant } = json.raw.houses
      house.forEach((cusp: number, i: number) => expect(cusp).toBeCloseTo((ascendant + 30 * i) % 360, 4))
      // Asc と Mc は、ハウスシステムに依らない。Mc は、10ハウスのカスプにならない
      expect(ascendant).toBeCloseTo(207.908591, NUM_DIGITS)
      expect(json.raw.houses.mc).toBeCloseTo(123.803709, NUM_DIGITS)
      expect(house[9]).toBeCloseTo(117.908591, 4)
    })
    describe('すべてのハウスシステム', () => {
      // 1ハウス、2ハウス、8ハウスのカスプ
      const CUSPS: [string, number, number, number][] = [
        ['placidus', 207.908591, 235.781911, 55.781911],
        ['koch', 207.908591, 235.809886, 55.809886],
        ['regiomontanus', 207.908591, 232.825342, 52.825342],
        ['campanus', 207.908591, 240.824377, 60.824377],
        ['porphyry', 207.908591, 239.87363, 59.87363],
        ['equal', 207.908591, 237.908591, 57.908591],
        ['wholeSign', 180, 210, 30],
        ['alcabitius', 207.908591, 241.438576, 61.438576],
        ['topocentric', 207.908591, 235.891375, 55.891375],
        ['morinus', 213.803709, 244.241285, 64.241285],
        ['meridian', 218.500087, 247.895237, 67.895237],
        ['equalMc', 213.803709, 243.803709, 63.803709],
        ['vehlow', 192.908591, 222.908591, 42.908591],
        ['equalAries', 0, 30, 210],
        ['sripati', 193.89111, 223.89111, 43.89111],
        ['carter', 207.908591, 238.169504, 58.169504],
        ['horizon', 241.847894, 276.359767, 96.359767],
        ['krusinski', 207.908591, 232.891328, 52.891328],
        ['pullenSd', 207.908591, 239.38237, 59.38237],
        ['pullenSr', 207.908591, 239.345227, 59.345227],
        ['savardA', 207.908591, 231.061417, 51.061417],
        ['sunshine', 207.908591, 231.744456, 53.815093],
        ['apc', 207.908591, 234.552337, 50.797828],
        ['solarSign', 150, 180, 0],
      ]

      it('選べるものを、すべて確かめている', () => {
        expect(CUSPS.map(([house]) => house)).toEqual(HOUSE_SYSTEMS)
      })

      it.each(CUSPS)('%s', async (house, first, second, eighth) => {
        const { status, json } = await get(horoscope, { ...query, house })
        expect(status).toEqual(200)
        expect(json.result.houses.system).toEqual(house)
        const cusps: number[] = json.raw.houses.house
        expect(cusps).toHaveLength(12)
        expect(cusps[0]).toBeCloseTo(first, NUM_DIGITS)
        expect(cusps[1]).toBeCloseTo(second, NUM_DIGITS)
        expect(cusps[7]).toBeCloseTo(eighth, NUM_DIGITS)

        // Asc と Mc は、ハウスシステムに依らない
        expect(json.raw.houses.ascendant).toBeCloseTo(207.908591, NUM_DIGITS)
        expect(json.raw.houses.mc).toBeCloseTo(123.803709, NUM_DIGITS)

        // カスプは、黄経が増える向きに並んで、1周する
        const widths = cusps.map((cusp, i) => (cusps[(i + 1) % 12] - cusp + 360) % 360)
        widths.forEach((width) => expect(width).toBeGreaterThan(0))
        expect(widths.reduce((sum, width) => sum + width, 0)).toBeCloseTo(360, 4)

        // Asc と Mc も、どれかのハウスに入る
        for (const angle of [json.result.houses.ascendant, json.result.houses.mc]) {
          expect(angle.house).toBeGreaterThanOrEqual(1)
          expect(angle.house).toBeLessThanOrEqual(12)
        }

        // どの惑星も、小惑星も、感受点も、1〜12 のどれかのハウスに入る
        const { planets, asteroids, points } = json.result
        for (const body of [...planets, ...asteroids, ...points]) {
          expect(body.house, body.name).toBeGreaterThanOrEqual(1)
          expect(body.house, body.name).toBeLessThanOrEqual(12)
        }
      })

      // Asc と Mc が入るハウス（1987-09-08 08:53 札幌）
      // NOTE: 多くのハウスシステムでは、Asc が 1ハウスの起点、Mc が 10ハウスの起点
      const ANGLE_HOUSES: Partial<Record<(typeof HOUSE_SYSTEMS)[number], [number, number]>> = {
        equal: [1, 10], // Mc（123.80度）は、10ハウス（117.91度から）の途中
        wholeSign: [1, 11], // Asc は天秤座（1ハウス）、Mc は獅子座（11ハウス）
        morinus: [12, 9], // 1ハウスは 213.80度から、10ハウスは 128.50度から
        meridian: [12, 10], // 1ハウスは 218.50度から
        equalMc: [12, 10], // 1ハウスは 213.80度から
        vehlow: [1, 10], // Asc は、1ハウス（192.91度から）の中央
        equalAries: [7, 5], // 牡羊座が 1ハウス。天秤座は 7ハウス、獅子座は 5ハウス
        sripati: [1, 10], // Asc は、1ハウス（193.89度から）の中央
        carter: [1, 10], // Mc は、10ハウス（114.03度から）の途中
        horizon: [12, 10], // 1ハウスは 241.85度から
        solarSign: [2, 12], // 乙女座が 1ハウス。天秤座は 2ハウス、獅子座は 12ハウス
      }
      it.each(HOUSE_SYSTEMS)('%s の、Asc と Mc のハウス', async (house) => {
        const { json } = await get(horoscope, { ...query, house })
        const { ascendant, mc } = json.result.houses
        expect([ascendant.house, mc.house]).toEqual(ANGLE_HOUSES[house] ?? [1, 10])
      })

      it('向かい合うカスプが、180度の反対側にならないものがある', async () => {
        const opposite = async (house: string) => {
          const cusps: number[] = (await get(horoscope, { ...query, house })).json.raw.houses.house
          return (cusps[7] - cusps[1] + 360) % 360
        }
        expect(await opposite('placidus')).toBeCloseTo(180, 4)
        // サンシャイン: 2ハウスは 231.74度、8ハウスは 53.82度
        expect(await opposite('sunshine')).toBeCloseTo(182.070637, 4)
        expect(await opposite('apc')).toBeCloseTo(176.245491, 4)
      })

      it.each(HOUSE_SYSTEMS.filter((_) => _ !== 'placidus' && _ !== 'koch'))(
        '%s は、極圏でも計算できる',
        async (house) => {
          expect((await get(horoscope, { ...query, lat: '80', house })).status).toEqual(200)
        }
      )
    })

    it('惑星の位置は、変わらない', async () => {
      const placidus = await get(horoscope, query)
      const koch = await get(horoscope, { ...query, house: 'koch' })
      expect(koch.json.raw.positions).toEqual(placidus.json.raw.positions)
    })
    it('極圏でも、ポーフィリーなら計算できる', async () => {
      expect((await get(horoscope, { ...query, lat: '80' })).status).toEqual(400)
      expect((await get(horoscope, { ...query, lat: '80', house: 'koch' })).status).toEqual(400)
      expect((await get(horoscope, { ...query, lat: '80', house: 'porphyry' })).status).toEqual(200)
    })
    it('読み取れない値は、エラーにする', async () => {
      const { status, json } = await get(horoscope, { ...query, house: 'K' })
      expect(status).toEqual(400)
      expect(json.error).toEqual({ code: 'invalid_query', message: 'house is invalid', params: ['house'] })
    })
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
    it('ページのURLには、同じ指定を、ハッシュで付ける', async () => {
      const { json } = await get(horoscope, { ...query, orb: '8', minor: '30,150', orbs: 'x' })
      const page = new URL(json.page)
      expect(page.search).toEqual('?date=19870908&time=0853&zone=Asia%2FTokyo&lat=43.06666666666667&lng=141.35')
      expect(page.hash).toEqual('#orb=8&minor=30,150')
    })
    it('指定が無ければ、ページのURLに、ハッシュを付けない', async () => {
      const { json } = await get(horoscope, query)
      expect(json.page).not.toContain('#')
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
