import { DateTime, Settings } from 'luxon'
import { getThisYear } from '../../src/suimei/models/ThisYear'

describe('今年', () => {
  afterEach(() => {
    Settings.now = () => Date.now()
  })

  // 日本時間の 2028-01-01 03:00（UTCやニューヨークでは、まだ2027年の大晦日）
  const setNow = () => {
    Settings.now = () => new Date('2028-01-01T03:00:00+09:00').getTime()
  }

  it('日本生まれ: 日本時間で年が明けていれば新年', () => {
    setNow()
    const birthday = DateTime.fromISO('1987-09-08T08:53:00', { zone: 'Asia/Tokyo' })
    expect(getThisYear(birthday)).toEqual(2028)
  })
  it('オフセットだけを持つ日時でも同じ', () => {
    setNow()
    const birthday = DateTime.fromISO('1987-09-08T08:53:00.000+09:00', { setZone: true })
    expect(getThisYear(birthday)).toEqual(2028)
  })
  it('海外生まれ: 現地で年が明けていなければ前年', () => {
    setNow()
    const birthday = DateTime.fromISO('1987-09-08T20:00:00', { zone: 'America/New_York' })
    expect(getThisYear(birthday)).toEqual(2027)
  })
})
