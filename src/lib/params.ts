import { DateTime } from 'luxon'

type Gender = 'man' | 'woman'
export type FormValuesBase = {
  name?: string
  date?: string
  time?: string
  zone?: string
  timeUnknown: boolean
  lat?: number
  lng?: number
  gender?: Gender
}

type QueryValue = string | string[] | undefined
export type Query = Partial<{
  name: QueryValue
  date: QueryValue
  time: QueryValue
  zone: QueryValue
  lat: QueryValue
  lng: QueryValue
  gender: QueryValue
}>

const QUERY_DATE_FORMAT = 'yyyyMMdd' as const
const QUERY_TIME_FORMAT = 'HHmm' as const
const QUERY_TIME_UNKNOWN = 'unknown' as const
export const FORM_DATE_FORMAT = 'yyyy-MM-dd' as const
export const FORM_TIME_FORMAT = 'HH:mm' as const

export const queryToFormValues = (q: Query): FormValuesBase => {
  const singleValue = (value: string | string[] | undefined) => (Array.isArray(value) ? value[0] : value)

  const name = singleValue(q.name)

  const _date = singleValue(q.date)
  let date: string | undefined
  if (_date) {
    date = DateTime.fromFormat(_date, QUERY_DATE_FORMAT).toFormat(FORM_DATE_FORMAT)
  }

  const _time = singleValue(q.time)
  const timeUnknown = _time === QUERY_TIME_UNKNOWN
  let time: string | undefined
  if (_time && !timeUnknown) {
    time = DateTime.fromFormat(_time, QUERY_TIME_FORMAT).toFormat(FORM_TIME_FORMAT)
  }

  const zone = singleValue(q.zone)

  const lat = singleValue(q.lat)
  const lng = singleValue(q.lng)

  const gender = singleValue(q.gender) as Gender

  return {
    name,
    date,
    time,
    zone,
    timeUnknown,
    lat: lat ? Number(lat) : undefined,
    lng: lng ? Number(lng) : undefined,
    gender: gender,
  }
}

export const formValuesToQuery = (f: Partial<FormValuesBase>): Query => {
  return {
    ...(f.name && { name: f.name }),
    ...(f.date && { date: DateTime.fromFormat(f.date, FORM_DATE_FORMAT).toFormat(QUERY_DATE_FORMAT) }),
    ...(f.time && { time: DateTime.fromFormat(f.time, FORM_TIME_FORMAT).toFormat(QUERY_TIME_FORMAT) }),
    ...(f.zone && { zone: f.zone }),
    ...(f.timeUnknown && { time: QUERY_TIME_UNKNOWN }),
    ...(f.lat && { lat: f.lat.toString() }),
    ...(f.lng && { lng: f.lng.toString() }),
    ...(f.gender && { gender: f.gender }),
  }
}
