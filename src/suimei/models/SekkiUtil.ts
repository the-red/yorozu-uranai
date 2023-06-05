import { DateTime } from 'luxon'
import { getEclipticLongitude } from '../../astronomy'
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

export const longitudeToDate = async (
  targetLongitude: number,
  nearbyDate: Date, // この日付に一番近い日付を探す
  forward: boolean = true, // 順行ならtrue、逆行ならfalse
  count: number = 0
): Promise<Date> => {
  const secondsOfYear = 365.2422 / 24 / 60 / 60
  const longitudesOfSeconds = secondsOfYear / 360 // 1秒で黄経が進む度数

  const currentLongitude = await getEclipticLongitude(nearbyDate)
  const sign = forward ? 1 : -1

  let longitudeDiff = targetLongitude - currentLongitude
  if (count === 0 && sign * longitudeDiff < 0) {
    longitudeDiff += sign * 360
  }
  const diffSeconds = longitudeDiff / longitudesOfSeconds
  const diffSecondsInt = Math.trunc(diffSeconds)

  if (diffSecondsInt === 0) {
    return nearbyDate
  }

  if (count > 10) {
    // 無限再帰の防止
    return nearbyDate
  }

  const newDate = new Date(nearbyDate.getTime() + diffSecondsInt * 1000)
  return longitudeToDate(targetLongitude, newDate, forward, count + 1)
}

export const getSetsuIri = async (baseDate: Date, forward: boolean = true) => {
  const baseIndex = await getSekkiIndex(baseDate)
  const index = forward ? (baseIndex + 1) % 12 : baseIndex
  const sekki = 節list[index]
  const longitudeOfNextSekki = (節list.indexOf(sekki) * interval - adjustment + 360) % 360
  const date = await longitudeToDate(longitudeOfNextSekki, baseDate, forward)
  return { sekki, date }
}
