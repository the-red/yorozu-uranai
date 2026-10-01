import { describe, it, expect } from 'vitest'
import { toUrl } from '../src/lib/url'

describe('URLを組み立てる', () => {
  it('クエリとハッシュを付ける', () => {
    expect(toUrl('/horoscope', { date: '19870908', orb: '8' }, 'show=chiron')).toEqual(
      '/horoscope?date=19870908&orb=8#show=chiron'
    )
  })
  it('クエリもハッシュも無ければ、パスだけ', () => {
    expect(toUrl('/horoscope', {})).toEqual('/horoscope')
    expect(toUrl('/horoscope', {}, '')).toEqual('/horoscope')
  })
  it('片方だけ', () => {
    expect(toUrl('/horoscope', { orb: '8' })).toEqual('/horoscope?orb=8')
    expect(toUrl('/horoscope', {}, 'show=none')).toEqual('/horoscope#show=none')
  })
  it('カンマは、そのまま入れる（%2C にしない）。ほかの記号は、エンコードする', () => {
    expect(toUrl('/horoscope', { zone: 'Asia/Tokyo', minor: '30,150', name: 'a b&c=d' }, 'show=ascMc,chiron')).toEqual(
      '/horoscope?zone=Asia%2FTokyo&minor=30,150&name=a+b%26c%3Dd#show=ascMc,chiron'
    )
  })
  it('値の無い項目は、入れない。値が複数あれば、すべて入れる', () => {
    expect(toUrl('/horoscope', { date: undefined, orb: ['4', '8'] })).toEqual('/horoscope?orb=4&orb=8')
  })
})
