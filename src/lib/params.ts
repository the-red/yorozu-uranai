import { DateTime } from 'luxon'
import { DEFAULT_HOUSE_SYSTEM, HouseSystem, toHouseSystem } from '../horoscope/models/HouseSystem'

export type Gender = 'man' | 'woman'
export type FormValuesBase = {
  name?: string
  date?: string
  time?: string
  zone?: string
  timeUnknown: boolean
  lat?: number
  lng?: number
  gender?: Gender
  house?: HouseSystem // ホロスコープの、ハウスシステム
}

export type QueryValue = string | string[] | undefined
export type Query = Partial<{
  name: QueryValue
  date: QueryValue
  time: QueryValue
  zone: QueryValue
  lat: QueryValue
  lng: QueryValue
  gender: QueryValue
  house: QueryValue
}>

// フォームの入力になるクエリ
export const FORM_QUERY_KEYS = [
  'name',
  'date',
  'time',
  'zone',
  'lat',
  'lng',
  'gender',
  'house',
] as const satisfies readonly (keyof Query)[]

export const QUERY_DATE_FORMAT = 'yyyyMMdd' as const
export const QUERY_TIME_FORMAT = 'HHmm' as const
export const QUERY_TIME_UNKNOWN = 'unknown' as const
export const FORM_DATE_FORMAT = 'yyyy-MM-dd' as const
export const FORM_TIME_FORMAT = 'HH:mm' as const

// 同じパラメータが複数あるときは、最初の値を使う
export const singleValue = (value: QueryValue) => (Array.isArray(value) ? value[0] : value)

// NOTE: 以前は「女性」のラジオボタンに値が無く、URLが gender=on になっていた。
// 計算は「男性でなければ女性」として扱っているので、男性以外の値は女性として読み取る
export const toGender = (value: string | undefined): Gender | undefined =>
  value === undefined ? undefined : value === 'man' ? 'man' : 'woman'

// 形式を変えるためだけに、日付や時刻を読む
// NOTE: タイムゾーンを指定しないと、「閲覧者のタイムゾーンの、今日の、その時刻」として読まれる。
// 閲覧者の地域が夏時間に切り替わる日は、存在しない時刻（02:30 など）が1時間ずれるので、夏時間の無いUTCで読む
const convert = (value: string, from: string, to: string) =>
  DateTime.fromFormat(value, from, { zone: 'utc' }).toFormat(to)

export const queryToFormValues = (q: Query): FormValuesBase => {
  const name = singleValue(q.name)

  const _date = singleValue(q.date)
  let date: string | undefined
  if (_date) {
    date = convert(_date, QUERY_DATE_FORMAT, FORM_DATE_FORMAT)
  }

  const _time = singleValue(q.time)
  const timeUnknown = _time === QUERY_TIME_UNKNOWN
  let time: string | undefined
  if (_time && !timeUnknown) {
    time = convert(_time, QUERY_TIME_FORMAT, FORM_TIME_FORMAT)
  }

  const zone = singleValue(q.zone)

  const lat = singleValue(q.lat)
  const lng = singleValue(q.lng)

  const gender = toGender(singleValue(q.gender))

  return {
    name,
    date,
    time,
    zone,
    timeUnknown,
    lat: lat ? Number(lat) : undefined,
    lng: lng ? Number(lng) : undefined,
    gender: gender,
    // NOTE: 読み取れない値は、無視する（プラシーダスにする）
    house: toHouseSystem(singleValue(q.house) ?? ''),
  }
}

export const formValuesToQuery = (f: Partial<FormValuesBase>): Query => {
  return {
    ...(f.name && { name: f.name }),
    ...(f.date && { date: convert(f.date, FORM_DATE_FORMAT, QUERY_DATE_FORMAT) }),
    ...(f.time && { time: convert(f.time, FORM_TIME_FORMAT, QUERY_TIME_FORMAT) }),
    ...(f.zone && { zone: f.zone }),
    ...(f.timeUnknown && { time: QUERY_TIME_UNKNOWN }),
    ...(f.lat && { lat: f.lat.toString() }),
    ...(f.lng && { lng: f.lng.toString() }),
    ...(f.gender && { gender: f.gender }),
    // NOTE: 最初の状態（プラシーダス）なら、入れない。今までのURLを、そのまま使う
    ...(f.house && f.house !== DEFAULT_HOUSE_SYSTEM && { house: f.house }),
  }
}
