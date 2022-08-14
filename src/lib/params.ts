import { DateTime } from 'luxon'

type FormValues = {
  name?: string
  date?: string
  time?: string
  zone?: string
  timeUnknown: boolean
  lat: number
  lon: number
}

type QueryValue = string | string[] | undefined
type Query = Partial<Record<keyof FormValues, QueryValue>>

const QUERY_DATE_FORMAT = 'yyyyMMdd' as const
const QUERY_TIME_FORMAT = 'HHmm' as const
const QUERY_TIME_UNKNOWN = 'unknown' as const
const FORM_TIME_FORMAT = 'HH:mm' as const

const DEFAULT_LAT = 35.604839 as const
const DEFAULT_LON = 139.667717 as const

const fromQuery = (q: Query): FormValues => {
  const singleValue = (value: string | string[] | undefined) => (Array.isArray(value) ? value[0] : value)

  const name = singleValue(q.name)

  const _date = singleValue(q.date)
  let date: string | undefined
  if (_date) {
    date = DateTime.fromFormat(_date, QUERY_DATE_FORMAT).toISODate()
  }

  const _time = singleValue(q.time)
  const timeUnknown = _time === QUERY_TIME_UNKNOWN
  let time: string | undefined
  if (_time && !timeUnknown) {
    time = DateTime.fromFormat(_time, QUERY_TIME_FORMAT).toFormat(FORM_TIME_FORMAT)
  }

  const zone = singleValue(q.zone)

  const lat = singleValue(q.lat)
  const lon = singleValue(q.lon)

  return {
    name,
    date,
    time,
    zone,
    timeUnknown,
    lat: lat ? Number(lat) : DEFAULT_LAT,
    lon: lon ? Number(lon) : DEFAULT_LON,
  }
}

const toQuery = (p: Partial<FormValues>): Query => {
  return {
    ...(p.name && { name: p.name }),
    ...(p.date && { date: DateTime.fromISO(p.date).toFormat(QUERY_DATE_FORMAT) }),
    ...(p.time && { time: DateTime.fromFormat(p.time, FORM_TIME_FORMAT).toFormat(QUERY_TIME_FORMAT) }),
    ...(p.zone && { zone: p.zone }),
    ...(p.timeUnknown && { time: QUERY_TIME_UNKNOWN }),
    ...(p.lat && { lat: p.lat.toString() }),
    ...(p.lon && { lon: p.lon.toString() }),
  }
}

export default { fromQuery, toQuery }
