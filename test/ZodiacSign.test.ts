import { CZodiacSign } from '../src/ZodiacSign'

describe('ZodiacSign', () => {
  it('0.0: 魚座', () => {
    const zodiacSign = new CZodiacSign(0)
    expect(zodiacSign.sign).toEqual('魚座')
    expect(zodiacSign.degrees).toEqual(0)
  })
  it('0.5: 牡羊座', () => {
    const zodiacSign = new CZodiacSign(0.5)
    expect(zodiacSign.sign).toEqual('牡羊座')
    expect(zodiacSign.degrees).toEqual(0.5)
  })
  it('60.0: 牡牛座', () => {
    const zodiacSign = new CZodiacSign(60)
    expect(zodiacSign.sign).toEqual('牡牛座')
    expect(zodiacSign.degrees).toEqual(0)
  })
  it('61.89: 双子座', () => {
    const zodiacSign = new CZodiacSign(61.89)
    expect(zodiacSign.fullDegrees).toEqual(61.89)
    expect(zodiacSign.sign).toEqual('双子座')
    expect(zodiacSign.degrees).toEqual(1.8900000000000006)
  })
})
