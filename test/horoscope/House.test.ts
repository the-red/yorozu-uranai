import { describe, it, expect } from 'vitest'
import { House } from '../../src/horoscope/models/House'
import type { Houses } from '../../src/astronomy/types'

const toHouse = (cusps: number[]) => new House({ house: cusps, ascendant: cusps[0], mc: cusps[9] } as Houses)

describe('惑星のハウス', () => {
  // 1987-09-08 08:53 札幌生まれのカスプ（test/horoscope/Horoscope.test.ts と同じ）
  // 5ハウス（337.2度 〜 5.25度）が、黄経0度をまたぐ
  const house = toHouse([
    207.908591, 235.781911, 268.307258, 303.803709, 337.205891, 5.251311, 27.908591, 55.781911, 88.307258, 123.803709,
    157.205891, 185.251311,
  ])

  it.each([
    [1, 220],
    [2, 250],
    [3, 280],
    [4, 320],
    [5, 350],
    [6, 15],
    [7, 40],
    [8, 70],
    [9, 100],
    [10, 140],
    [11, 170],
    [12, 200],
  ])('%iハウス: 黄経 %f 度', (expected, longitude) => {
    expect(house.where(longitude)).toEqual(expected)
  })

  describe('黄経0度をまたぐハウス', () => {
    it('0度より手前', () => {
      expect(house.where(348.062352)).toEqual(5)
      expect(house.where(359.999999)).toEqual(5)
    })
    it('ちょうど0度', () => {
      expect(house.where(0)).toEqual(5)
    })
    it('0度より後ろ', () => {
      expect(house.where(0.000001)).toEqual(5)
      expect(house.where(3)).toEqual(5)
    })
    it('次のハウス', () => {
      expect(house.where(5.3)).toEqual(6)
    })
  })

  describe('カスプとちょうど同じ黄経', () => {
    // サインの境界（Position.sign）と同じく、そこから始まる側に入れる
    it('そこから始まるハウスに入る', () => {
      expect(house.where(235.781911)).toEqual(2)
      expect(house.where(5.251311)).toEqual(6)
    })
    it('すぐ手前は、前のハウス', () => {
      expect(house.where(235.78191)).toEqual(1)
      expect(house.where(5.25131)).toEqual(5)
    })
    it('アセンダントは1ハウス', () => {
      expect(house.where(207.908591)).toEqual(1)
      expect(house.where(207.90859)).toEqual(12)
    })
  })

  describe('カスプがちょうど0度にある', () => {
    // 330度から、30度ずつ
    const house = toHouse([330, 0, 30, 60, 90, 120, 150, 180, 210, 240, 270, 300])

    it('0度の手前のハウス', () => {
      expect(house.where(330)).toEqual(1)
      expect(house.where(345)).toEqual(1)
      expect(house.where(359.999999)).toEqual(1)
    })
    it('0度から始まるハウス', () => {
      expect(house.where(0)).toEqual(2)
      expect(house.where(15)).toEqual(2)
      expect(house.where(30)).toEqual(3)
    })
    it('最後のハウス', () => {
      expect(house.where(300)).toEqual(12)
      expect(house.where(315)).toEqual(12)
      expect(house.where(329.999999)).toEqual(12)
    })
  })

  describe('1ハウスが0度をまたぐ', () => {
    const house = toHouse([350, 20, 50, 80, 110, 140, 170, 200, 230, 260, 290, 320])

    it.each([
      [1, 355],
      [1, 10],
      [2, 35],
      [12, 335],
      [12, 349.999999],
      [1, 350],
    ])('%iハウス: 黄経 %f 度', (expected, longitude) => {
      expect(house.where(longitude)).toEqual(expected)
    })
  })

  it('どの黄経でも、1〜12のどれかのハウスに入る', () => {
    for (let longitude = 0; longitude < 360; longitude += 0.5) {
      expect(house.where(longitude), `黄経 ${longitude} 度`).toBeGreaterThanOrEqual(1)
      expect(house.where(longitude), `黄経 ${longitude} 度`).toBeLessThanOrEqual(12)
    }
  })

  it('カスプが無ければ、ハウスは求まらない', () => {
    expect(toHouse([]).where(100)).toBeUndefined()
  })
})
