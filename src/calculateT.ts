import { DateTime } from 'luxon'

export const calculateT = (_birthday: Date) => {
  const birthday = DateTime.fromJSDate(_birthday)
  const hour = birthday.hour
  const minute = birthday.minute
  const T = hour + minute / 60
  return Math.round(T * 1000) / 1000
}
