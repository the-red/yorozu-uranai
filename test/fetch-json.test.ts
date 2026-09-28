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

    const { address: _, lat, ...suimei } = formValues
    expect(parseSuimeiQuery(toQuery(toJsonUrl('/suimei', formValues, { thisYear: '2026' })))).toEqual({
      ok: true,
      input: { ...suimei, thisYear: 2026 },
    })
  })
})

describe('エラーの案内', () => {
  it('日時のパラメータ', () => {
    const e = new JsonApiError({ code: 'invalid_query', message: 'date is invalid', params: ['date'] })
    expect(toErrorGuide(e)).toEqual('date is invalid\n生年月日を修正してください。')
  })
  it('緯度と経度', () => {
    const e = new JsonApiError({ code: 'invalid_query', message: 'lat is invalid', params: ['lat'] })
    expect(toErrorGuide(e)).toEqual('lat is invalid\n出生場所を修正してください。')
  })
  it('両方', () => {
    const e = new JsonApiError({
      code: 'invalid_query',
      message: 'date is invalid, lng is required',
      params: ['date', 'lng'],
    })
    expect(toErrorGuide(e)).toEqual(
      'date is invalid, lng is required\n生年月日を修正してください。\n出生場所を修正してください。'
    )
  })
  it('計算できない', () => {
    const e = new JsonApiError({ code: 'calculation_failed', message: `Can't calculate houses.`, params: [] })
    expect(toErrorGuide(e)).toEqual(`Can't calculate houses.\n生年月日か出生場所を修正してください。`)
  })
  it('JSONでない応答', () => {
    expect(toErrorGuide(new Error('Internal Server Error'))).toEqual('Internal Server Error')
  })
})
