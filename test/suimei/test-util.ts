import { DateTime } from 'luxon'
import { Kanshi } from '../../src/suimei/models/Kanshi'
import { getSekkiPair } from '../../src/suimei/models/SekkiUtil'
import { Gender, generateDaiun } from '../../src/suimei/models/Daiun'

export const getKanshiInstance = async (date: Date) => {
  const sekkiPair = await getSekkiPair(date)
  return new Kanshi(DateTime.fromJSDate(date), sekkiPair)
}

export const getDaiun = async (date: Date, dateTime: DateTime, gender: Gender) => {
  const sekkiPair = await getSekkiPair(date)
  return await generateDaiun(date, dateTime, gender, sekkiPair)
}
