import { describe, it, expect } from 'vitest'
import { DateTime } from 'luxon'
import { toSolarTime, formatSolarTime } from '../../src/suimei/models/SolarTime'
import { NUM_DIGITS } from '../test-util'

const FORMAT = 'yyyy-MM-dd HH:mm'

describe('真太陽時', () => {
  it('札幌: 明石より東なので進む', () => {
    // 地方時差 (141.35 - 135) × 4分 = 25.4分、均時差 2.05分
    const dateTime = DateTime.fromISO('1987-09-08T08:53:00', { zone: 'Asia/Tokyo' })
    const solarTime = toSolarTime(dateTime, 141.35, 2.05)
    expect(solarTime.longitudeDiff).toBeCloseTo(25.4, NUM_DIGITS)
    expect(solarTime.equationOfTime).toBeCloseTo(2.05, NUM_DIGITS)
    expect(solarTime.dateTime.toFormat(FORMAT)).toEqual('1987-09-08 09:20')
  })
  it('那覇: 明石より西なので遅れる', () => {
    // 地方時差 (127.68 - 135) × 4分 = -29.28分、均時差 2.05分
    const dateTime = DateTime.fromISO('1987-09-08T08:53:00', { zone: 'Asia/Tokyo' })
    const solarTime = toSolarTime(dateTime, 127.68, 2.05)
    expect(solarTime.longitudeDiff).toBeCloseTo(-29.28, NUM_DIGITS)
    expect(solarTime.dateTime.toFormat(FORMAT)).toEqual('1987-09-08 08:25')
  })
  it('明石: 均時差が0なら時計の時刻と同じ', () => {
    const dateTime = DateTime.fromISO('1987-09-08T08:53:00', { zone: 'Asia/Tokyo' })
    const solarTime = toSolarTime(dateTime, 135, 0)
    expect(solarTime.longitudeDiff).toBeCloseTo(0, NUM_DIGITS)
    expect(solarTime.dateTime.toFormat(FORMAT)).toEqual('1987-09-08 08:53')
  })
  it('日付をまたぐ', () => {
    const dateTime = DateTime.fromISO('1987-09-08T23:50:00', { zone: 'Asia/Tokyo' })
    const solarTime = toSolarTime(dateTime, 141.35, 2.05)
    expect(solarTime.dateTime.toFormat(FORMAT)).toEqual('1987-09-09 00:17')
  })
  it('ニューヨーク（サマータイム中）: 標準時の基準（西経75度）より東だが、サマータイムの1時間ぶん遅れる', () => {
    // 地方時差 (-74.006 - (-75)) × 4分 - 60分 = -56.024分、均時差 2.2分
    const dateTime = DateTime.fromISO('1987-09-08T20:00:00', { zone: 'America/New_York' })
    const solarTime = toSolarTime(dateTime, -74.006, 2.2)
    expect(solarTime.longitudeDiff).toBeCloseTo(-56.024, NUM_DIGITS)
    expect(solarTime.dateTime.toFormat(FORMAT)).toEqual('1987-09-08 19:06')
  })
})

describe('真太陽時の表示', () => {
  it('進む場合', () => {
    const dateTime = DateTime.fromISO('1987-09-08T08:53:00', { zone: 'Asia/Tokyo' })
    expect(formatSolarTime(toSolarTime(dateTime, 141.35, 2.05))).toEqual({
      dateTime: '1987/09/08 09:20',
      longitudeDiff: '+25分',
      equationOfTime: '+2分',
    })
  })
  it('遅れる場合', () => {
    const dateTime = DateTime.fromISO('1987-02-11T08:53:00', { zone: 'Asia/Tokyo' })
    expect(formatSolarTime(toSolarTime(dateTime, 127.68, -14.2))).toEqual({
      dateTime: '1987/02/11 08:09',
      longitudeDiff: '-29分',
      equationOfTime: '-14分',
    })
  })
  it('差が無い場合', () => {
    const dateTime = DateTime.fromISO('1987-09-08T08:53:00', { zone: 'Asia/Tokyo' })
    expect(formatSolarTime(toSolarTime(dateTime, 135, 0.2))).toEqual({
      dateTime: '1987/09/08 08:53',
      longitudeDiff: '±0分',
      equationOfTime: '±0分',
    })
  })
})
