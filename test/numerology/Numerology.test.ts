import { Numerology } from '../../src/numerology/Numerology'

describe('Numerology', () => {
  const numerology = new Numerology({ birthDate: new Date('1970-10-31'), fullName: 'SUHI KAZUYA' })
  it('life path number', () => {
    expect(numerology.lifePathNumber).toEqual(22)
  })
  it('destiny number', () => {
    expect(numerology.destinyNumber).toEqual(7)
  })
  it('soul number', () => {
    expect(numerology.soulNumber).toEqual(8)
  })
  it('personality number', () => {
    expect(numerology.personalityNumber).toEqual(8)
  })
  it('maturity number', () => {
    expect(numerology.maturityNumber).toEqual(29)
  })
  it('birthday number', () => {
    expect(numerology.birthdayNumber).toEqual(4)
  }),
    describe('sumOfDigits', () => {
      const one = 'A'
      const ten = 'AI'
      const hundred = ten.repeat(10)
      it('2桁', () => {
        expect(new Numerology({ birthDate: new Date(), fullName: one + ten }).destinyNumber).toEqual(11)
      })
      it('3桁', () => {
        expect(new Numerology({ birthDate: new Date(), fullName: one + ten + hundred }).destinyNumber).toEqual(111)
      })
    })
})
