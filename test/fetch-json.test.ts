import { describe, it, expect } from 'vitest'
import { JsonApiError, toErrorGuide, toJsonUrl } from '../src/lib/fetch-json'
import { parseHoroscopeQuery, parseSuimeiQuery } from '../src/lib/json-query'
import type { FormValues } from '../src/hooks/useYorozuUranaiForm'

const formValues: FormValues = {
  date: '1987-09-08',
  time: '08:53',
  zone: 'Asia/Tokyo',
  timeUnknown: false,
  lat: 43.06,
  lng: 141.35,
  gender: 'woman',
  address: '北海道札幌市',
}

const toQuery = (url: string) => Object.fromEntries(new URL(url, 'https://yorozu-uranai.com').searchParams)

describe('フォームの値 → JSONのURL', () => {
  it('ページと同じ形式のクエリにする', () => {
    expect(toJsonUrl('/horoscope', formValues)).toEqual(
      '/horoscope.json?date=19870908&time=0853&zone=Asia%2FTokyo&lat=43.06&lng=141.35&gender=woman'
    )
  })
  it('住所は付けない', () => {
    expect(toJsonUrl('/horoscope', formValues)).not.toContain('address')
  })
  it('現在の年を付ける', () => {
    expect(toQuery(toJsonUrl('/suimei', formValues, { thisYear: '2026' })).thisYear).toEqual('2026')
  })
  it('時刻不明', () => {
    const url = toJsonUrl('/suimei', { ...formValues, time: '12:00', timeUnknown: true })
    expect(toQuery(url).time).toEqual('unknown')
  })
  it('緯度と経度が 0 でも付ける', () => {
    const query = toQuery(toJsonUrl('/horoscope', { ...formValues, lat: 0, lng: 0 }))
    expect(query).toMatchObject({ lat: '0', lng: '0' })
  })
  it('APIが解釈すると、フォームの値に戻る', () => {
    const { address, gender, ...rest } = formValues
    expect(parseHoroscopeQuery(toQuery(toJsonUrl('/horoscope', formValues)))).toEqual({ ok: true, input: rest })

    const { address: _, ...suimei } = formValues
    expect(parseSuimeiQuery(toQuery(toJsonUrl('/suimei', formValues, { thisYear: '2026' })))).toEqual({
      ok: true,
      input: { ...suimei, thisYear: 2026 },
    })
  })
})

describe('エラーの案内', () => {
  const error = (code: 'invalid_query' | 'calculation_failed', params: string[]) =>
    new JsonApiError({ code, message: 'message in English', params })

  it.each([['date'], ['time'], ['zone']])('%s なら、生年月日', (param) => {
    expect(toErrorGuide(error('invalid_query', [param]))).toEqual('生年月日を修正してください。')
  })
  it.each([['lat'], ['lng']])('%s なら、出生場所', (param) => {
    expect(toErrorGuide(error('invalid_query', [param]))).toEqual('出生場所を修正してください。')
  })
  it('性別', () => {
    expect(toErrorGuide(error('invalid_query', ['gender']))).toEqual('性別を選択してください。')
  })
  it('複数あれば、すべて案内する', () => {
    expect(toErrorGuide(error('invalid_query', ['date', 'time', 'lng', 'gender']))).toEqual(
      '生年月日を修正してください。\n出生場所を修正してください。\n性別を選択してください。'
    )
  })
  it('計算できないときも、原因のパラメータで案内する', () => {
    expect(toErrorGuide(error('calculation_failed', ['lat']))).toEqual('出生場所を修正してください。')
    expect(toErrorGuide(error('calculation_failed', ['date']))).toEqual('生年月日を修正してください。')
  })
  it('フォームに無いパラメータ', () => {
    expect(toErrorGuide(error('invalid_query', ['thisYear']))).toEqual('入力を確認してください。')
    expect(toErrorGuide(error('calculation_failed', []))).toEqual('入力を確認してください。')
  })
  it('APIの英語のメッセージは出さない', () => {
    expect(toErrorGuide(error('invalid_query', ['date']))).not.toContain('English')
  })
  it('通信の失敗や、サーバーの障害', () => {
    expect(toErrorGuide(new Error('Internal Server Error'))).toEqual('時間をおいて、もう一度お試しください。')
    expect(toErrorGuide(new TypeError('Failed to fetch'))).toEqual('時間をおいて、もう一度お試しください。')
    expect(toErrorGuide('unknown')).toEqual('時間をおいて、もう一度お試しください。')
  })
})
