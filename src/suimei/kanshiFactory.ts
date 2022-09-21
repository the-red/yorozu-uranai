import { DateTime } from 'luxon'
import { getEclipticLongitude } from '../astronomy'
import { sekki, 節 } from './Sekki'
import { SekkiPair } from './Kanshi'

const getSekki = async (date: Date): Promise<節> => {
  const longitude = await getEclipticLongitude(date)
  return sekki(longitude)
}

export const getSekkiPair = async (date: Date): Promise<SekkiPair> => {
  const dateTime = DateTime.fromJSDate(date)

  return {
    today: await getSekki(date),
    endOfMonth: await getSekki(dateTime.endOf('month').toJSDate()),
  }
}
