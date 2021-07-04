import { Numerology } from '../../src/numerology/Numerology'

describe('Numerology', () => {
  const numerology = new Numerology({ birthDate: new Date('1970-10-31'), firstName: 'SUHI', lastName: 'KAZUYA' })
  it('life path number', () => {
    expect(numerology.lifePathNumber()).toEqual(22)
  })
  it('destiny number', () => {
    expect(numerology.destinyNumber()).toEqual(7)
  })
})
