import type { Numerology } from './Numerology'

export type NumerologyResult = {
  lifePathNumber: number
  destinyNumber: number
  soulNumber: number
  personalityNumber: number
  maturityNumber: number
  birthdayNumber: number
}

export const toNumerologyResult = (numerology: Numerology): NumerologyResult => ({
  lifePathNumber: numerology.lifePathNumber,
  destinyNumber: numerology.destinyNumber,
  soulNumber: numerology.soulNumber,
  personalityNumber: numerology.personalityNumber,
  maturityNumber: numerology.maturityNumber,
  birthdayNumber: numerology.birthdayNumber,
})
