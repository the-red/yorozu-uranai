import { DateTime } from 'luxon'
import { getEclipticLongitude, longitudeToDate } from '../../astronomy'
import { adjustment, interval, sekki, sekkiIndex, 節, 節list } from './Sekki'
import { SekkiPair } from './Kanshi'

const getSekkiIndex = async (date: Date): Promise<number> => {
  const longitude = await getEclipticLongitude(date)
  return sekkiIndex(longitude)
}
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

export const getSetsuIri = async (
  baseDate: Date, // この日付に一番近い日付を探す
  forward: boolean = true // 順行ならtrue、逆行ならfalse
) => {
  const baseIndex = await getSekkiIndex(baseDate)
  const index = forward ? (baseIndex + 1) % 12 : baseIndex
  const sekki = 節list[index]
  const longitudeOfNextSekki = (節list.indexOf(sekki) * interval - adjustment + 360) % 360
  const date = await longitudeToDate(longitudeOfNextSekki, baseDate, forward)
  return { sekki, date }
}
