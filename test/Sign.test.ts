import { Sign } from '../src/Sign'

describe('Sign', () => {
  const sign = new Sign({ sun: '牡羊座', moon: '牡牛座' })
  it('火', () => {
    expect(sign.fire()).toEqual(['sun'])
  })
})
