import { HOUSE_SYSTEMS } from '../src/horoscope/models'
import { describe, it, expect, beforeEach, afterEach } from 'vitest'
import { Settings } from 'luxon'
import { queryToFormValues, formValuesToQuery } from '../src/lib/params'

describe('クエリ → フォームの値', () => {
  describe('性別', () => {
    it('男性', () => {
      expect(queryToFormValues({ gender: 'man' }).gender).toEqual('man')
    })
    it('女性', () => {
      expect(queryToFormValues({ gender: 'woman' }).gender).toEqual('woman')
    })
    it('指定が無ければ、未設定のまま', () => {
      expect(queryToFormValues({}).gender).toBeUndefined()
    })
    it('以前のURLに含まれる on は、女性として扱う', () => {
      // 以前は「女性」のラジオボタンに値が無く、URLが gender=on になっていた
      expect(queryToFormValues({ gender: 'on' }).gender).toEqual('woman')
    })
    it('男性・女性以外の値は、女性として扱う', () => {
      // 計算は「男性でなければ女性」として扱っているので、それに合わせる
      expect(queryToFormValues({ gender: 'unknown' }).gender).toEqual('woman')
    })
  })

  it('日付と時刻は、フォームの形式に変換する', () => {
    expect(
      queryToFormValues({ date: '19870908', time: '0853', zone: 'Asia/Tokyo', lat: '43.06', lng: '141.35' })
    ).toEqual({
      name: undefined,
      date: '1987-09-08',
      time: '08:53',
      zone: 'Asia/Tokyo',
      timeUnknown: false,
      lat: 43.06,
      lng: 141.35,
      gender: undefined,
      house: undefined,
    })
  })
})

describe('ハウスシステム', () => {
  it('クエリから読み取る', () => {
    expect(queryToFormValues({ house: 'koch' }).house).toEqual('koch')
    expect(queryToFormValues({ house: 'equal' }).house).toEqual('equal')
    expect(queryToFormValues({ house: ['campanus', 'koch'] }).house).toEqual('campanus')
  })
  it('無ければ、undefined（ページが、プラシーダスを補う）', () => {
    expect(queryToFormValues({}).house).toBeUndefined()
  })
  it.each(['K', 'Koch', 'whole', ''])('読み取れない値（%j）は、無視する', (house) => {
    expect(queryToFormValues({ house }).house).toBeUndefined()
  })
  it('最初の状態（プラシーダス）は、クエリに入れない', () => {
    expect(formValuesToQuery({ timeUnknown: false, house: 'placidus' })).toEqual({})
    expect(formValuesToQuery({ timeUnknown: false })).toEqual({})
    expect(formValuesToQuery({ timeUnknown: false, house: 'koch' })).toEqual({ house: 'koch' })
  })
  it('クエリにして、読み取ると、元に戻る', () => {
    for (const house of HOUSE_SYSTEMS) {
      const restored = queryToFormValues(formValuesToQuery({ timeUnknown: false, house })).house
      expect(restored ?? 'placidus').toEqual(house)
    }
  })
})

describe('フォームの値 → クエリ', () => {
  it('性別はそのまま渡す', () => {
    expect(formValuesToQuery({ timeUnknown: false, gender: 'woman' })).toEqual({ gender: 'woman' })
    expect(formValuesToQuery({ timeUnknown: false, gender: 'man' })).toEqual({ gender: 'man' })
  })
})

describe('日付と時刻は、閲覧者のタイムゾーンと今日の日付に依らない', () => {
  // 閲覧者はニューヨークにいて、今日は夏時間に切り替わる日（02:00 が 03:00 になる）
  beforeEach(() => {
    Settings.defaultZone = 'America/New_York'
    Settings.now = () => new Date('2027-03-14T15:00:00Z').getTime()
  })
  afterEach(() => {
    Settings.defaultZone = 'system'
    Settings.now = () => Date.now()
  })

  it('切り替わりで飛ばされる時刻も、そのまま変換する', () => {
    expect(queryToFormValues({ time: '0230' }).time).toEqual('02:30')
    expect(formValuesToQuery({ time: '02:30', timeUnknown: false }).time).toEqual('0230')
  })
  it('切り替わりの前後の時刻', () => {
    expect(queryToFormValues({ time: '0159' }).time).toEqual('01:59')
    expect(queryToFormValues({ time: '0300' }).time).toEqual('03:00')
    expect(formValuesToQuery({ time: '01:59', timeUnknown: false }).time).toEqual('0159')
    expect(formValuesToQuery({ time: '03:00', timeUnknown: false }).time).toEqual('0300')
  })
  it('日付', () => {
    expect(queryToFormValues({ date: '20270314' }).date).toEqual('2027-03-14')
    expect(formValuesToQuery({ date: '2027-03-14', timeUnknown: false }).date).toEqual('20270314')
  })
  it('時刻不明', () => {
    expect(queryToFormValues({ time: 'unknown' })).toMatchObject({ time: undefined, timeUnknown: true })
    expect(formValuesToQuery({ time: '12:00', timeUnknown: true }).time).toEqual('unknown')
  })
})
