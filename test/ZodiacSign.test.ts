import { CZodiacSign } from '../src/ZodiacSign'

describe('ZodiacSign', () => {
  it('60', () => {
    const zodiacSign = new CZodiacSign(60)
    expect(zodiacSign.sign).toEqual('牡牛座')
    expect(zodiacSign.degrees).toEqual(0)
  })
  it('61', () => {
    const zodiacSign = new CZodiacSign(61.89)
    expect(zodiacSign.sign).toEqual('双子座')
    expect(zodiacSign.degrees).toEqual(1.8900000000000006)
  })
})
