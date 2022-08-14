import { DateTime } from 'luxon'

type QueryValue = string | string[] | undefined
type Query = Partial<{
  name: QueryValue
  date: QueryValue
  time: QueryValue
  zone: QueryValue
  timeUnknown: QueryValue
  lat: QueryValue
  lon: QueryValue
}>

type Params = {
  name: string
  dateTime: DateTime
  zone: string
  timeUnknown: boolean
  lat: number
  lon: number
}

const QUERY_DATE_FORMAT = 'yyyyMMdd' as const
const QUERY_TIME_FORMAT = 'HHmm' as const

const fromQuery = (q: Query): Params => {
  const singleValue = (value: string | string[] | undefined) => (Array.isArray(value) ? value[0] : value)

  const name = singleValue(q.name)

  const date = singleValue(q.date)
  const _timeUnknown = singleValue(q.timeUnknown)
  const timeUnknown = !_timeUnknown || _timeUnknown === 'false' ? false : true
  const time = timeUnknown ? '1200' : singleValue(q.time)
  const zone = singleValue(q.zone)
  const dateTime =
    date && time
      ? DateTime.fromFormat(date + time, QUERY_DATE_FORMAT + QUERY_TIME_FORMAT, { zone })
      : DateTime.local({ zone })

  const lat = singleValue(q.lat)
  const lon = singleValue(q.lon)

  return {
    name: name ?? '',
    dateTime: dateTime,
    zone: dateTime.zoneName,
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
    ...(p.timeUnknown !== undefined && { timeUnknown: p.timeUnknown.toString() }),
    ...(p.lat && { lat: p.lat.toString() }),
    ...(p.lon && { lon: p.lon.toString() }),
  }
}

export default { fromQuery, toQuery }
