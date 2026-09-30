import { describe, it, expect } from 'vitest'
import { FROM_MAP, NOT_SELECTED, PREFECTURES, toLatLng, toPlace } from '../src/lib/prefectures'
import { IMPERIAL_PALACE } from '../src/lib/location'
import { formValuesToQuery, queryToFormValues } from '../src/lib/params'

// 出典の形式（度:分:秒）を、度に直す
const toDegrees = (dms: string) => {
  const [d, m, s] = dms.split(':').map(Number)
  return d + m / 60 + s / 3600
}

describe('都道府県庁の位置', () => {
  it('47都道府県が、北海道から沖縄県の順に並ぶ', () => {
    expect(PREFECTURES).toHaveLength(47)
    expect(new Set(PREFECTURES.map((_) => _.name)).size).toBe(47)
    expect(PREFECTURES[0].name).toBe('北海道')
    expect(PREFECTURES[12].name).toBe('東京都')
    expect(PREFECTURES[46].name).toBe('沖縄県')
  })
  it.each([
    // 出典の値
    ['北海道', '43:03:51', '141:20:48'],
    ['東京都', '35:41:21', '139:41:30'],
    ['大阪府', '34:41:11', '135:31:12'],
    ['沖縄県', '26:12:44', '127:40:51'],
  ])('%s', (name, lat, lng) => {
    const prefecture = PREFECTURES.find((_) => _.name === name)!
    expect(prefecture.lat).toBeCloseTo(toDegrees(lat), 4)
    expect(prefecture.lng).toBeCloseTo(toDegrees(lng), 4)
  })
  it('どれも、日本の範囲にある', () => {
    for (const { lat, lng } of PREFECTURES) {
      expect(lat).toBeGreaterThan(26)
      expect(lat).toBeLessThan(44)
      expect(lng).toBeGreaterThan(127)
      expect(lng).toBeLessThan(142)
    }
  })
  it('同じ位置のものは無い', () => {
    const positions = [IMPERIAL_PALACE, ...PREFECTURES].map((_) => `${_.lat},${_.lng}`)
    expect(new Set(positions).size).toBe(48)
  })
})

describe('選択欄の値', () => {
  it('皇居は、選んでいない状態', () => {
    expect(toPlace(IMPERIAL_PALACE)).toBe(NOT_SELECTED)
    expect(toLatLng(NOT_SELECTED)).toEqual(IMPERIAL_PALACE)
  })
  it('都道府県庁は、その都道府県', () => {
    for (const { name, lat, lng } of PREFECTURES) {
      expect(toPlace({ lat, lng })).toBe(name)
      expect(toLatLng(name)).toEqual({ lat, lng })
    }
  })
  it('東京都は、皇居とは別の場所', () => {
    expect(toLatLng('東京都')).toEqual({ lat: 35.6892, lng: 139.6917 })
    expect(toLatLng('東京都')).not.toEqual(IMPERIAL_PALACE)
  })
  it('それ以外の場所は、地図で選んだもの', () => {
    // 東京駅
    expect(toPlace({ lat: 35.6812362, lng: 139.7671248 })).toBe(FROM_MAP)
    // 緯度だけが、都庁と同じ
    expect(toPlace({ lat: 35.6892, lng: 139.7 })).toBe(FROM_MAP)
    expect(toLatLng(FROM_MAP)).toBeUndefined()
    expect(toLatLng('日本')).toBeUndefined()
  })
  it('URLのクエリを通しても、同じ都道府県になる', () => {
    for (const { name, lat, lng } of PREFECTURES) {
      const f = queryToFormValues(formValuesToQuery({ timeUnknown: false, lat, lng }))
      expect(toPlace({ lat: f.lat!, lng: f.lng! })).toBe(name)
    }
  })
})
