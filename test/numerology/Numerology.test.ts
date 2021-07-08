import { Numerology } from '../../src/numerology/Numerology'

describe('Numerology', () => {
  const numerology = new Numerology({ birthDate: new Date('1970-10-31'), firstName: 'SUHI', lastName: 'KAZUYA' })
  it('life path number', () => {
    expect(numerology.lifePathNumber()).toEqual(22)
  })
  it('destiny number', () => {
    expect(numerology.destinyNumber()).toEqual(7)
  })
  it('soul number', () => {
    expect(numerology.soulNumber()).toEqual(8)
  })
  it('personality number', () => {
    expect(numerology.personalityNumber()).toEqual(8)
  })
  it('maturity number', () => {
    expect(numerology.maturityNumber()).toEqual(29)
  })
  it('birthday number', () => {
    expect(numerology.birthdayNumber()).toEqual(4)
  })
})
