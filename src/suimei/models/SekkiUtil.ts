import { DateTime } from 'luxon'
import { getEclipticLongitude } from '../../astronomy'
import { sekki, sekkiIndex, 節, 節list } from './Sekki'
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

export const daysToNextSekki = async (date: Date, forward: boolean = true): Promise<number> => {
  const currentSekki = await getSekki(date)
  const index = 節list.indexOf(currentSekki)

  if (forward) {
    // 順行
    const nextIndex = (index + 1) % 12
    const nextSekki = 節list.at(nextIndex)
    for (let days = 1; days <= 32; days++) {
      const nextDate = DateTime.fromJSDate(date).plus({ days }).toJSDate()
      const sekki = await getSekki(nextDate)
      if (sekki === nextSekki) {
        return days
      }
    }
  } else {
    // 逆行
    const prevIndex = (index - 1) % 12
    const prevSekki = 節list.at(prevIndex)
    for (let days = 1; days <= 32; days++) {
      const prevDate = DateTime.fromJSDate(date).minus({ days }).toJSDate()
      const sekki = await getSekki(prevDate)
      if (sekki === prevSekki) {
        return days
      }
    }
  }

  throw new Error('節入りできません！') // ここには来ないはず
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