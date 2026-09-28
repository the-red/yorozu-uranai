import { describe, it, expect } from 'vitest'
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
    })
  })
})

describe('フォームの値 → クエリ', () => {
  it('性別はそのまま渡す', () => {
    expect(formValuesToQuery({ timeUnknown: false, gender: 'woman' })).toEqual({ gender: 'woman' })
    expect(formValuesToQuery({ timeUnknown: false, gender: 'man' })).toEqual({ gender: 'man' })
  })
})
