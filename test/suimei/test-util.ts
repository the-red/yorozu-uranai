import { DateTime } from 'luxon'
import { Kanshi } from '../../src/suimei/models/Kanshi'
import { getSekkiPair } from '../../src/suimei/models/SekkiUtil'
import { Gender, generateDaiun } from '../../src/suimei/models/Daiun'

// テストケースは日本生まれを想定しているので、実行環境に依らず日本時間で扱う
const ZONE = 'Asia/Tokyo'

export const getKanshiInstance = async (date: Date) => {
  const dateTime = DateTime.fromJSDate(date, { zone: ZONE })
  const sekkiPair = await getSekkiPair(dateTime)
  return new Kanshi(dateTime, sekkiPair)
}

export const getDaiun = async (date: Date, dateTime: DateTime, gender: Gender, thisYear: number) => {
  const sekkiPair = await getSekkiPair(dateTime)
  return await generateDaiun(date, dateTime, gender, sekkiPair, thisYear)
}
