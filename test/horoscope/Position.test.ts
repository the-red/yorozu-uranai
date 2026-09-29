import { describe, it, expect } from 'vitest'
import { Position } from '../../src/horoscope/models'

describe('Position', () => {
  describe('度と分', () => {
    it.each([
      // 1987-09-08 08:53 札幌生まれの、太陽・水星・木星
      [164.817337, 14, 49, '14°49′'],
      [180.67738, 0, 41, ' 0°41′'],
      [29.125698, 29, 8, '29°08′'],
      // 分が 0
      [100, 10, 0, '10°00′'],
    ])('黄経 %d度', (longitude, degrees, minutes, formatted) => {
      const position = new Position(longitude)
      expect(position.degreesInt).toEqual(degrees)
      expect(position.minutes).toEqual(minutes)
      expect(position.formattedDegrees).toEqual(formatted)
    })
  })
})
