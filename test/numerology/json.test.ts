import { describe, it, expect } from 'vitest'
import { DateTime } from 'luxon'
import { Numerology } from '../../src/numerology/models/Numerology'
import { toNumerologyResult } from '../../src/numerology/models/json'

describe('数秘術 → JSON', () => {
  it('6つのコアナンバー', () => {
    const numerology = new Numerology({
      birthDate: DateTime.fromISO('1970-10-31', { zone: 'utc' }),
      fullName: 'SUHI KAZUYA',
      maxSameNumber: 22,
    })
    expect(toNumerologyResult(numerology)).toEqual({
      lifePathNumber: 22,
      destinyNumber: 7,
      soulNumber: 8,
      personalityNumber: 8,
      maturityNumber: 29,
      birthdayNumber: 4,
    })
  })
})
