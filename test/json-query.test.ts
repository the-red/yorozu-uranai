import { describe, it, expect } from 'vitest'
import {
  parseHoroscopeQuery,
  parseSuimeiQuery,
  parseNumerologyQuery,
  toDateTime,
  toDate,
  toPageQuery,
} from '../src/lib/json-query'
import { DEFAULT_ASPECT_SETTINGS } from '../src/horoscope/models'

const horoscopeQuery = { date: '19870908', time: '0853', zone: 'Asia/Tokyo', lat: '43.06', lng: '141.35' }
const suimeiQuery = { date: '19870908', time: '0853', zone: 'Asia/Tokyo', lng: '141.35', gender: 'woman' }
const numerologyQuery = { date: '19701031', name: 'Suhi Kazuya' }

const invalid = (message: string, params: string[]) => ({
  ok: false,
  error: { code: 'invalid_query', message, params },
})

describe('ホロスコープのクエリ', () => {
  it('フォームと同じ形式の入力にする', () => {
    expect(parseHoroscopeQuery(horoscopeQuery)).toEqual({
      ok: true,
      input: {
        date: '1987-09-08',
        time: '08:53',
        timeUnknown: false,
        zone: 'Asia/Tokyo',
        lat: 43.06,
        lng: 141.35,
        aspects: DEFAULT_ASPECT_SETTINGS,
      },
    })
  })

  it('対象外のパラメータは無視する', () => {
    const parsed = parseHoroscopeQuery({ ...horoscopeQuery, gender: 'man', name: 'TARO', thisYear: 'abc', foo: 'bar' })
    expect(parsed).toEqual(parseHoroscopeQuery(horoscopeQuery))
  })

  it('同じパラメータが複数あるときは、最初の値を使う', () => {
    const parsed = parseHoroscopeQuery({ ...horoscopeQuery, date: ['19870908', '20000101'] })
    expect(parsed).toEqual(parseHoroscopeQuery(horoscopeQuery))
  })

  describe('必須', () => {
    it.each(['date', 'zone', 'lat', 'lng'] as const)('%s が無ければエラー', (name) => {
      const { [name]: _, ...rest } = horoscopeQuery
      expect(parseHoroscopeQuery(rest)).toEqual(invalid(`${name} is required`, [name]))
    })
    it('空文字は、無いものとして扱う', () => {
      expect(parseHoroscopeQuery({ ...horoscopeQuery, lat: '' })).toEqual(invalid('lat is required', ['lat']))
    })
    it('問題のあるパラメータを、すべて返す', () => {
      expect(parseHoroscopeQuery({ date: '1987', lat: '43.06' })).toEqual(
        invalid('date is invalid, zone is required, lng is required', ['date', 'zone', 'lng'])
      )
    })
  })

  describe('日付', () => {
    it.each(['1987-09-08', '1987098', '198709088', '19870931', '19871308', 'abcdefgh', ' 19870908'])(
      '%j はエラー',
      (date) => {
        expect(parseHoroscopeQuery({ ...horoscopeQuery, date })).toEqual(invalid('date is invalid', ['date']))
      }
    )
    it('うるう日', () => {
      expect(parseHoroscopeQuery({ ...horoscopeQuery, date: '20000229' })).toMatchObject({
        input: { date: '2000-02-29' },
      })
      expect(parseHoroscopeQuery({ ...horoscopeQuery, date: '19000229' })).toEqual(invalid('date is invalid', ['date']))
    })
  })

  describe('時刻', () => {
    it('無ければ、12:00 で計算する', () => {
      const { time: _, ...rest } = horoscopeQuery
      expect(parseHoroscopeQuery(rest)).toMatchObject({ input: { time: '12:00', timeUnknown: true } })
    })
    it('unknown なら、12:00 で計算する', () => {
      expect(parseHoroscopeQuery({ ...horoscopeQuery, time: 'unknown' })).toMatchObject({
        input: { time: '12:00', timeUnknown: true },
      })
    })
    it('00:00 と 23:59', () => {
      expect(parseHoroscopeQuery({ ...horoscopeQuery, time: '0000' })).toMatchObject({
        input: { time: '00:00', timeUnknown: false },
      })
      expect(parseHoroscopeQuery({ ...horoscopeQuery, time: '2359' })).toMatchObject({
        input: { time: '23:59', timeUnknown: false },
      })
    })
    it.each(['08:53', '853', '2400', '0860', 'Unknown', 'abcd'])('%j はエラー', (time) => {
      expect(parseHoroscopeQuery({ ...horoscopeQuery, time })).toEqual(invalid('time is invalid', ['time']))
    })
  })

  describe('タイムゾーン', () => {
    it.each(['Asia/Tokyo', 'America/New_York', 'UTC'])('%j', (zone) => {
      expect(parseHoroscopeQuery({ ...horoscopeQuery, zone })).toMatchObject({ input: { zone } })
    })
    it.each(['Tokyo', 'Asia/Nowhere', 'Asia/Tokyo ', '9'])('%j はエラー', (zone) => {
      expect(parseHoroscopeQuery({ ...horoscopeQuery, zone })).toEqual(invalid('zone is invalid', ['zone']))
    })
  })

  describe('緯度と経度', () => {
    it('0 と、範囲の端', () => {
      expect(parseHoroscopeQuery({ ...horoscopeQuery, lat: '0', lng: '0' })).toMatchObject({
        input: { lat: 0, lng: 0 },
      })
      expect(parseHoroscopeQuery({ ...horoscopeQuery, lat: '-90', lng: '180' })).toMatchObject({
        input: { lat: -90, lng: 180 },
      })
    })
    it.each(['90.1', '-90.1', 'abc', 'NaN', 'Infinity', ' '])('緯度 %j はエラー', (lat) => {
      expect(parseHoroscopeQuery({ ...horoscopeQuery, lat })).toEqual(invalid('lat is invalid', ['lat']))
    })
    it.each(['180.1', '-180.1', '460'])('経度 %j はエラー', (lng) => {
      expect(parseHoroscopeQuery({ ...horoscopeQuery, lng })).toEqual(invalid('lng is invalid', ['lng']))
    })
  })
})

describe('ホロスコープのクエリ: アスペクトの求め方', () => {
  const aspects = (query: Record<string, string>) => {
    const parsed = parseHoroscopeQuery({ ...horoscopeQuery, ...query })
    return parsed.ok ? parsed.input.aspects : parsed.error
  }

  it('指定した項目だけが変わる', () => {
    expect(aspects({ orb: '8', minor: '150,30', pointAspects: 'major', ascMcOrb: '2.5' })).toEqual({
      ...DEFAULT_ASPECT_SETTINGS,
      orb: 8,
      minor: [30, 150],
      ascMc: { aspects: 'major', orb: 2.5 },
      point: { aspects: 'major', orb: 3 },
    })
  })
  it('読み取れない値は、エラーにする', () => {
    expect(aspects({ orb: 'abc', minor: '30,31', asteroidAspects: 'all' })).toEqual({
      code: 'invalid_query',
      message: 'orb is invalid, minor is invalid, asteroidAspects is invalid',
      params: ['orb', 'minor', 'asteroidAspects'],
    })
  })
  it('ページのクエリには、入れない', () => {
    // ページは、アスペクトの求め方を、URLのハッシュで受け取る
    const parsed = parseHoroscopeQuery({ ...horoscopeQuery, orb: '8', minorOrb: '3' })
    expect(parsed.ok && toPageQuery(parsed.input)).toEqual(horoscopeQuery)
  })
})

describe('四柱推命のクエリ', () => {
  it('フォームと同じ形式の入力にする', () => {
    expect(parseSuimeiQuery(suimeiQuery)).toEqual({
      ok: true,
      input: {
        date: '1987-09-08',
        time: '08:53',
        timeUnknown: false,
        zone: 'Asia/Tokyo',
        lat: null,
        lng: 141.35,
        gender: 'woman',
        thisYear: null,
      },
    })
  })

  describe('緯度', () => {
    // 計算には使わない。同じ結果を表示するページのURLに入れるために受け取る
    it('付いていれば、数値にする', () => {
      expect(parseSuimeiQuery({ ...suimeiQuery, lat: '43.06' })).toMatchObject({ input: { lat: 43.06 } })
      expect(parseSuimeiQuery({ ...suimeiQuery, lat: '0' })).toMatchObject({ input: { lat: 0 } })
    })
    it('無くてもよい', () => {
      expect(parseSuimeiQuery({ ...suimeiQuery, lat: '' })).toMatchObject({ input: { lat: null } })
    })
    it.each(['abc', '90.1', '-90.1'])('%j はエラー', (lat) => {
      expect(parseSuimeiQuery({ ...suimeiQuery, lat })).toEqual(invalid('lat is invalid', ['lat']))
    })
  })

  describe('性別', () => {
    it('無ければエラー', () => {
      const { gender: _, ...rest } = suimeiQuery
      expect(parseSuimeiQuery(rest)).toEqual(invalid('gender is required', ['gender']))
    })
    it.each([
      ['man', 'man'],
      ['woman', 'woman'],
    ])('%j は %j', (gender, expected) => {
      expect(parseSuimeiQuery({ ...suimeiQuery, gender })).toMatchObject({ input: { gender: expected } })
    })
    // 推測で計算すると、大運の向きが逆になっても気づけない
    // NOTE: ページは、以前のURLの on を女性として読む。JSONでは受け付けない
    it.each(['male', 'female', 'MAN', 'Woman', 'man ', 'M', '男', 'unknown', 'on'])('%j はエラー', (gender) => {
      expect(parseSuimeiQuery({ ...suimeiQuery, gender })).toEqual(invalid('gender is invalid', ['gender']))
    })
  })

  describe('現在の年', () => {
    it('数値にする', () => {
      expect(parseSuimeiQuery({ ...suimeiQuery, thisYear: '2026' })).toMatchObject({ input: { thisYear: 2026 } })
    })
    it.each(['20260', '9007199254740993', '-2026', '2026.5', '1e3', 'abc'])('%j はエラー', (thisYear) => {
      expect(parseSuimeiQuery({ ...suimeiQuery, thisYear })).toEqual(invalid('thisYear is invalid', ['thisYear']))
    })
  })
})

describe('数秘術のクエリ', () => {
  it('名前は大文字にして、空白を1つにまとめる', () => {
    expect(parseNumerologyQuery({ date: '19701031', name: '  Suhi   Kazuya ' })).toEqual({
      ok: true,
      input: { date: '1970-10-31', name: 'SUHI KAZUYA', maxSameNumber: 22 },
    })
  })
  it('タイムゾーンは要らない', () => {
    expect(parseNumerologyQuery(numerologyQuery).ok).toEqual(true)
  })
  it.each(['date', 'name'] as const)('%s が無ければエラー', (name) => {
    const { [name]: _, ...rest } = numerologyQuery
    expect(parseNumerologyQuery(rest)).toEqual(invalid(`${name} is required`, [name]))
  })
  it.each(['山田太郎', 'やまだ', 'TARO2', 'TARO-YAMADA', ' '])('名前 %j はエラー', (name) => {
    expect(parseNumerologyQuery({ ...numerologyQuery, name })).toEqual(invalid('name is invalid', ['name']))
  })
})

describe('入力 → 日時', () => {
  it('出生地のタイムゾーンの日時にする', () => {
    const dateTime = toDateTime({ date: '1987-09-08', time: '20:00', zone: 'America/New_York' })
    expect(dateTime.toISO()).toEqual('1987-09-08T20:00:00.000-04:00')
    expect(dateTime.zoneName).toEqual('America/New_York')
  })
  it('日付だけのときは、暦の日付をそのまま持つ', () => {
    const date = toDate({ date: '1970-10-31' })
    expect([date.year, date.month, date.day]).toEqual([1970, 10, 31])
  })
})

describe('入力 → ページのクエリ', () => {
  it('ホロスコープ', () => {
    const parsed = parseHoroscopeQuery(horoscopeQuery)
    expect(parsed.ok && toPageQuery(parsed.input)).toEqual(horoscopeQuery)
  })
  it('時刻不明', () => {
    const parsed = parseSuimeiQuery({ ...suimeiQuery, time: 'unknown', thisYear: '2026' })
    // 現在の年は、ページがブラウザで求めるので付けない
    expect(parsed.ok && toPageQuery(parsed.input)).toEqual({ ...suimeiQuery, time: 'unknown' })
  })
  it('四柱推命の緯度', () => {
    const parsed = parseSuimeiQuery({ ...suimeiQuery, lat: '43.06' })
    expect(parsed.ok && toPageQuery(parsed.input)).toEqual({ ...suimeiQuery, lat: '43.06' })
  })
  it('数秘術', () => {
    const parsed = parseNumerologyQuery(numerologyQuery)
    expect(parsed.ok && toPageQuery(parsed.input)).toEqual({ date: '19701031', name: 'SUHI KAZUYA' })
  })
})
