import { DateTime } from 'luxon'

// 今年が何年かを、生年月日と同じタイムゾーンで判定する
// NOTE: サーバーやブラウザのタイムゾーンで判定すると、年末年始に「現在」の行がずれるので
export const getThisYear = (birthday: DateTime): number => DateTime.now().setZone(birthday.zone).year
