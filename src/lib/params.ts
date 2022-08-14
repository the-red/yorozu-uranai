import { DateTime } from 'luxon'

type QueryValue = string | string[] | undefined
type Query = Partial<{
  name: QueryValue
  date: QueryValue
  time: QueryValue
  zone: QueryValue
  lat: QueryValue
  lon: QueryValue
}>

type Params = {
  name?: string
  dateTime?: DateTime
  zone?: string
  timeUnknown: boolean
  lat: number
  lon: number
}

const QUERY_DATE_FORMAT = 'yyyyMMdd' as const
const QUERY_TIME_FORMAT = 'HHmm' as const
const QUERY_TIME_UNKNOWN = 'unknown' as const

const fromQuery = (q: Query): Params => {
  const singleValue = (value: string | string[] | undefined) => (Array.isArray(value) ? value[0] : value)

  const name = singleValue(q.name)

  const date = singleValue(q.date)
  const _time = singleValue(q.time)
  const timeUnknown = _time === QUERY_TIME_UNKNOWN
  const time = timeUnknown ? '1200' : _time
  const zone = singleValue(q.zone)
  const dateTime =
    date && time ? DateTime.fromFormat(date + time, QUERY_DATE_FORMAT + QUERY_TIME_FORMAT, { zone }) : undefined

  const lat = singleValue(q.lat)
  const lon = singleValue(q.lon)

  return {
    name,
    dateTime,
    zone,
    timeUnknown,
    lat: lat ? Number(lat) : 35.604839,
    lon: lon ? Number(lon) : 139.667717,
  }
}

const toQuery = (p: Partial<Params>): Query => {
  return {
    ...(p.name && { name: p.name }),
    ...(p.dateTime && {
      date: p.dateTime.toFormat(QUERY_DATE_FORMAT),
      time: p.dateTime.toFormat(QUERY_TIME_FORMAT),
      zone: p.dateTime.zoneName,
    }),
    ...(p.timeUnknown && { time: QUERY_TIME_UNKNOWN }),
    ...(p.lat && { lat: p.lat.toString() }),
    ...(p.lon && { lon: p.lon.toString() }),
  }
}

export default { fromQuery, toQuery }
