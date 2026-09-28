import { DateTime, IANAZone } from 'luxon'
import {
  FORM_DATE_FORMAT,
  FORM_TIME_FORMAT,
  Gender,
  QUERY_DATE_FORMAT,
  QUERY_TIME_FORMAT,
  QUERY_TIME_UNKNOWN,
  QueryValue,
  singleValue,
  toGender,
} from './params'

// JSON APIが受け取るクエリ。値はすべて文字列で届く
export type JsonQuery = Partial<Record<string, QueryValue>>

export type HoroscopeInput = {
  date: string
  time: string
  timeUnknown: boolean
  zone: string
  lat: number
  lng: number
}
export type SuimeiInput = {
  date: string
  time: string
  timeUnknown: boolean
  zone: string
  lng: number
  gender: Gender
  thisYear: number | null
}
export type NumerologyInput = {
  date: string
  name: string
  maxSameNumber: 22
}

export type InvalidQuery = { code: 'invalid_query'; message: string; params: string[] }
export type Parsed<T> = { ok: true; input: T } | { ok: false; error: InvalidQuery }

// 時刻不明のときに計算に使う時刻（ページと同じ）
const TIME_UNKNOWN = '12:00'

type Problem = 'required' | 'invalid'

// 1つのクエリを解釈する間の、問題のあるパラメータを集める
class Parser {
  private problems: [string, Problem][] = []

  constructor(private readonly query: JsonQuery) {}

  private value(name: string) {
    const value = singleValue(this.query[name])
    return value === undefined || value === '' ? undefined : value
  }

  private required(name: string) {
    const value = this.value(name)
    if (value === undefined) {
      this.problems.push([name, 'required'])
    }
    return value
  }

  private invalid(name: string) {
    this.problems.push([name, 'invalid'])
    return undefined
  }

  date() {
    const value = this.required('date')
    if (value === undefined) return undefined

    // NOTE: luxonは桁数の違う値も読めてしまうので、先に桁数を確かめる
    const date = DateTime.fromFormat(value, QUERY_DATE_FORMAT, { zone: 'utc' })
    if (!/^\d{8}$/.test(value) || !date.isValid) return this.invalid('date')
    return date.toFormat(FORM_DATE_FORMAT)
  }

  time() {
    const value = this.value('time')
    if (value === undefined || value === QUERY_TIME_UNKNOWN) {
      return { time: TIME_UNKNOWN, timeUnknown: true }
    }

    // NOTE: luxonは 2400 を翌日の 00:00 として読めてしまうので、先に範囲を確かめる
    const time = DateTime.fromFormat(value, QUERY_TIME_FORMAT, { zone: 'utc' })
    if (!/^([01]\d|2[0-3])[0-5]\d$/.test(value) || !time.isValid) return this.invalid('time')
    return { time: time.toFormat(FORM_TIME_FORMAT), timeUnknown: false }
  }

  zone() {
    const value = this.required('zone')
    if (value === undefined) return undefined

    // NOTE: IANAの名前のほかに、実行環境が受け付ける別名（JSTなど）も通る
    return IANAZone.isValidZone(value) ? value : this.invalid('zone')
  }

  // 緯度・経度。maxは絶対値の上限
  degrees(name: 'lat' | 'lng', max: number) {
    const value = this.required(name)
    if (value === undefined) return undefined

    const degrees = Number(value)
    if (value.trim() === '' || !Number.isFinite(degrees) || Math.abs(degrees) > max) return this.invalid(name)
    return degrees
  }

  gender() {
    return toGender(this.required('gender'))
  }

  thisYear() {
    const value = this.value('thisYear')
    if (value === undefined) return null

    // NOTE: 歳運は1年ずつ数えて求めるので、大きすぎる値を通すと計算が終わらなくなる
    if (!/^\d{1,4}$/.test(value)) return this.invalid('thisYear') ?? null
    return Number(value)
  }

  name() {
    const value = this.required('name')
    if (value === undefined) return undefined

    // 数秘術はローマ字の名前から計算する
    if (!/^[A-Za-z\s]+$/.test(value) || value.trim() === '') return this.invalid('name')
    return value.trim().replace(/\s+/g, ' ').toUpperCase()
  }

  result<T>(input: { [K in keyof T]: T[K] | undefined }): Parsed<T> {
    if (this.problems.length > 0) {
      return {
        ok: false,
        error: {
          code: 'invalid_query',
          message: this.problems.map(([name, problem]) => `${name} is ${problem}`).join(', '),
          params: this.problems.map(([name]) => name),
        },
      }
    }
    return { ok: true, input: input as T }
  }
}

export const parseHoroscopeQuery = (query: JsonQuery): Parsed<HoroscopeInput> => {
  const parser = new Parser(query)
  const date = parser.date()
  const time = parser.time()
  const zone = parser.zone()
  const lat = parser.degrees('lat', 90)
  const lng = parser.degrees('lng', 180)
  return parser.result<HoroscopeInput>({ date, time: time?.time, timeUnknown: time?.timeUnknown, zone, lat, lng })
}

export const parseSuimeiQuery = (query: JsonQuery): Parsed<SuimeiInput> => {
  const parser = new Parser(query)
  const date = parser.date()
  const time = parser.time()
  const zone = parser.zone()
  const lng = parser.degrees('lng', 180)
  const gender = parser.gender()
  const thisYear = parser.thisYear()
  return parser.result<SuimeiInput>({
    date,
    time: time?.time,
    timeUnknown: time?.timeUnknown,
    zone,
    lng,
    gender,
    thisYear,
  })
}

export const parseNumerologyQuery = (query: JsonQuery): Parsed<NumerologyInput> => {
  const parser = new Parser(query)
  const date = parser.date()
  const name = parser.name()
  return parser.result<NumerologyInput>({ date, name, maxSameNumber: 22 })
}

// 入力の日時を、出生地のタイムゾーンのDateTimeにする
export const toDateTime = ({ date, time, zone }: { date: string; time: string; zone: string }): DateTime =>
  DateTime.fromISO(`${date}T${time}`, { zone })

// 入力の日付を、暦の日付だけを持つDateTimeにする（数秘術用）
export const toDate = ({ date }: { date: string }): DateTime => DateTime.fromISO(date, { zone: 'utc' })

// 同じ結果を表示するページのクエリ
export const toPageQuery = (
  input: Partial<HoroscopeInput & SuimeiInput & NumerologyInput>
): Record<string, string> => ({
  ...(input.name !== undefined && { name: input.name }),
  ...(input.date !== undefined && { date: input.date.replaceAll('-', '') }),
  ...(input.time !== undefined && { time: input.timeUnknown ? QUERY_TIME_UNKNOWN : input.time.replace(':', '') }),
  ...(input.zone !== undefined && { zone: input.zone }),
  ...(input.lat !== undefined && { lat: String(input.lat) }),
  ...(input.lng !== undefined && { lng: String(input.lng) }),
  ...(input.gender !== undefined && { gender: input.gender }),
})
