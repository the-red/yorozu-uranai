import { DateTime } from 'luxon'
import { getEclipticLongitude } from '../../astronomy'
import { sekki, 節, 節list } from './Sekki'
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
