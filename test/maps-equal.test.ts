import { describe, it, expect, beforeAll, afterAll } from 'vitest'
import { deepCompareEqualsForMaps } from '../src/lib/maps-equal'

// google.maps.LatLng の代わり（緯度経度を持ち、equalsで比較できる）
class LatLng {
  private readonly _lat: number
  private readonly _lng: number
  constructor(value: LatLng | { lat: number; lng: number }) {
    this._lat = value instanceof LatLng ? value.lat() : value.lat
    this._lng = value instanceof LatLng ? value.lng() : value.lng
  }
  lat() {
    return this._lat
  }
  lng() {
    return this._lng
  }
  equals(other: LatLng) {
    return this.lat() === other.lat() && this.lng() === other.lng()
  }
}

describe('deepCompareEqualsForMaps', () => {
  beforeAll(() => {
    // @ts-expect-error テスト用の代替
    globalThis.google = { maps: { LatLng } }
  })
  afterAll(() => {
    // @ts-expect-error テスト用の代替
    delete globalThis.google
  })

  const tokyo = { lat: 35.6812362, lng: 139.7671248 }
  const sapporo = { lat: 43.0666667, lng: 141.35 }

  describe('緯度経度', () => {
    it('同じ位置なら等しい', () => {
      expect(deepCompareEqualsForMaps(tokyo, { ...tokyo })).toBe(true)
    })
    it('違う位置なら等しくない', () => {
      expect(deepCompareEqualsForMaps(tokyo, sapporo)).toBe(false)
    })
    it('LatLngのインスタンスと { lat, lng } でも、同じ位置なら等しい', () => {
      expect(deepCompareEqualsForMaps(new LatLng(tokyo), tokyo)).toBe(true)
      expect(deepCompareEqualsForMaps(tokyo, new LatLng(tokyo))).toBe(true)
    })
    it('LatLngのインスタンスと { lat, lng } で、違う位置なら等しくない', () => {
      expect(deepCompareEqualsForMaps(new LatLng(tokyo), sapporo)).toBe(false)
    })
  })

  describe('地図のオプション', () => {
    it('中身が同じなら、別のオブジェクトでも等しい', () => {
      expect(deepCompareEqualsForMaps({ center: tokyo, zoom: 12 }, { center: { ...tokyo }, zoom: 12 })).toBe(true)
    })
    it('中心が違えば等しくない', () => {
      expect(deepCompareEqualsForMaps({ center: tokyo, zoom: 12 }, { center: sapporo, zoom: 12 })).toBe(false)
    })
    it('ズームが違えば等しくない', () => {
      expect(deepCompareEqualsForMaps({ center: tokyo, zoom: 12 }, { center: tokyo, zoom: 13 })).toBe(false)
    })
    it('入れ子の中でも、LatLngのインスタンスと { lat, lng } は同じ位置なら等しい', () => {
      expect(deepCompareEqualsForMaps({ center: new LatLng(tokyo), zoom: 12 }, { center: tokyo, zoom: 12 })).toBe(true)
    })
  })

  describe('初回の比較', () => {
    it('undefinedとは等しくない', () => {
      expect(deepCompareEqualsForMaps({ center: tokyo, zoom: 12 }, undefined)).toBe(false)
    })
  })
})
