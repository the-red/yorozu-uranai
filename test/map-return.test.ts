import { describe, it, expect } from 'vitest'
import { buildMapQuery, buildReturnUrl } from '../src/lib/map-return'
import type { FormValues } from '../src/hooks/useYorozuUranaiForm'

describe('地図ページに渡すクエリ', () => {
  it('戻り先と、入力中のフォームの内容を含める', () => {
    // フォームの値には、クエリに含めない項目（住所）もある
    const formValues: FormValues = {
      date: '1987-09-08',
      time: '08:53',
      zone: 'Asia/Tokyo',
      timeUnknown: false,
      lat: 43.0617713,
      lng: 141.3544506,
      gender: 'woman',
      address: '日本、北海道札幌市',
    }
    expect(buildMapQuery('suimei', formValues)).toEqual({
      returnTo: 'suimei',
      date: '19870908',
      time: '0853',
      zone: 'Asia/Tokyo',
      lat: '43.0617713',
      lng: '141.3544506',
      gender: 'woman',
    })
  })
  it('時刻不明の場合', () => {
    const formValues: FormValues = {
      date: '1987-09-08',
      time: '12:00',
      zone: 'Asia/Tokyo',
      timeUnknown: true,
      lat: 35.6812362,
      lng: 139.7671248,
      gender: 'woman',
      address: '',
    }
    expect(buildMapQuery('horoscope', formValues)).toMatchObject({
      returnTo: 'horoscope',
      date: '19870908',
      time: 'unknown',
    })
  })
})

describe('地図ページから元のページに戻るURL', () => {
  const pinned = { lat: 26.2124013, lng: 127.6809317 }

  it('地図で選んだ緯度経度に差し替えて、元のページに戻る', () => {
    const url = buildReturnUrl(
      {
        returnTo: 'suimei',
        date: '19870908',
        time: '0853',
        zone: 'Asia/Tokyo',
        lat: '43.0617713',
        lng: '141.3544506',
        gender: 'woman',
      },
      pinned
    )
    expect(url).toEqual({
      pathname: '/suimei',
      query: {
        date: '19870908',
        time: '0853',
        zone: 'Asia/Tokyo',
        lat: '26.2124013',
        lng: '127.6809317',
        gender: 'woman',
      },
    })
  })
  it('ホロスコープに戻る', () => {
    expect(buildReturnUrl({ returnTo: 'horoscope', date: '19870908' }, pinned)).toEqual({
      pathname: '/horoscope',
      query: { date: '19870908', lat: '26.2124013', lng: '127.6809317' },
    })
  })
  it('戻り先が無ければ、戻れない', () => {
    expect(buildReturnUrl({ lat: '43.0617713', lng: '141.3544506' }, pinned)).toBeUndefined()
  })
  it('決められたページ以外には戻らない', () => {
    expect(buildReturnUrl({ returnTo: 'https://example.com/' }, pinned)).toBeUndefined()
    expect(buildReturnUrl({ returnTo: '/example.com' }, pinned)).toBeUndefined()
    expect(buildReturnUrl({ returnTo: 'map' }, pinned)).toBeUndefined()
    expect(buildReturnUrl({ returnTo: ['suimei', 'horoscope'] }, pinned)).toBeUndefined()
  })
})
