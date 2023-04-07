import { DateTime } from 'luxon'
import { Kanshi } from '../../src/suimei/Kanshi'
import { getSekkiPair } from '../../src/suimei/kanshiFactory'

export const getKanshiInstance = async (date: Date) => {
  const sekkiPair = await getSekkiPair(date)
  return new Kanshi(DateTime.fromJSDate(date), sekkiPair)
}
