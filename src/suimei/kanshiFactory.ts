import { DateTime } from 'luxon'
import { getEclipticLongitude } from '../astronomy'
import { sekki, 節 } from './Sekki'
import { Kanshi } from './Kanshi'

export const getSekki = async (date: Date): Promise<節> => {
  const longitude = await getEclipticLongitude(date)
  return sekki(longitude)
}

export const getKanshiInstance = async (date: Date) => {
  const dateTime = DateTime.fromJSDate(date)

  return new Kanshi(dateTime, {
    today: await getSekki(date),
    endOfMonth: await getSekki(dateTime.endOf('month').toJSDate()),
  })
}
