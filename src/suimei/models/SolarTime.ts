import { DateTime } from 'luxon'

export type SolarTime = {
  // 真太陽時（視太陽時）。年月日・時分秒を出生地の暦として読む
  // NOTE: 補正後の時刻をそのまま持たせるためにUTCのDateTimeを使っている。絶対時刻としての意味は無い
  dateTime: DateTime
  longitudeDiff: number // 地方時差（分）
  equationOfTime: number // 均時差（分）
}

// 経度1度あたりの時差（24時間 ÷ 360度）
const MINUTES_PER_DEGREE = 4

// 時計の時刻（標準時）を真太陽時に変換
export const toSolarTime = (
  dateTime: DateTime, // 出生地のタイムゾーンで渡す
  lng: number,
  equationOfTime: number // 均時差（分）
): SolarTime => {
  // 出生地の経度での平均太陽時と、時計の時刻との差。サマータイムはoffsetに含まれている
  const longitudeDiff = lng * MINUTES_PER_DEGREE - dateTime.offset

  const milliseconds = Math.round((lng * MINUTES_PER_DEGREE + equationOfTime) * 60 * 1000)

  return {
    dateTime: dateTime.toUTC().plus({ milliseconds }),
    longitudeDiff,
    equationOfTime,
  }
}

// 分単位の差を符号付きで表示
const formatMinutes = (minutes: number) => {
  const rounded = Math.round(minutes)
  if (rounded === 0) {
    return '±0分'
  }
  return `${rounded > 0 ? '+' : '-'}${Math.abs(rounded)}分`
}

// 画面表示用の文字列に変換
export const formatSolarTime = (solarTime: SolarTime) => ({
  dateTime: solarTime.dateTime.toFormat('yyyy/MM/dd HH:mm'),
  longitudeDiff: formatMinutes(solarTime.longitudeDiff),
  equationOfTime: formatMinutes(solarTime.equationOfTime),
})
