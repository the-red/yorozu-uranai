import { ZodiacSign } from '../src/ZodiacSign'

describe('ZodiacSign', () => {
  describe('星座と角度', () => {
    it('0.0: 魚座', () => {
      const zodiacSign = new ZodiacSign(0)
      expect(zodiacSign.sign).toEqual('魚座')
      expect(zodiacSign.degrees).toEqual(0)
    })
    it('0.5: 牡羊座', () => {
      const zodiacSign = new ZodiacSign(0.5)
      expect(zodiacSign.sign).toEqual('牡羊座')
      expect(zodiacSign.degrees).toEqual(0.5)
    })
    it('60.0: 牡牛座', () => {
      const zodiacSign = new ZodiacSign(60)
      expect(zodiacSign.sign).toEqual('牡牛座')
      expect(zodiacSign.degrees).toEqual(0)
    })
    it('61.89: 双子座', () => {
      const zodiacSign = new ZodiacSign(61.89)
      expect(zodiacSign.fullDegrees).toEqual(61.89)
      expect(zodiacSign.sign).toEqual('双子座')
      expect(zodiacSign.degrees).toEqual(1.8900000000000006)
    })
  })

  describe('アスペクト', () => {
    it('ちょうど180', () => {
      const sign0 = new ZodiacSign(0)
      const sign180 = new ZodiacSign(180)
      expect(sign0.aspect(sign180)).toEqual('opposition')
    })
    it('180より小さい、許容範囲内', () => {
      const sign0 = new ZodiacSign(0)
      const sign179 = new ZodiacSign(179)
      expect(sign0.aspect(sign179)).toEqual('opposition')
    })
    it('180より小さい、許容範囲外', () => {
      const sign0 = new ZodiacSign(0)
      const sign178 = new ZodiacSign(178)
      expect(sign0.aspect(sign178)).toEqual(null)
    })
    it('180より大きい、許容範囲内', () => {
      const sign0 = new ZodiacSign(0)
      const sign181 = new ZodiacSign(181)
      expect(sign0.aspect(sign181)).toEqual('opposition')
    })
    it('180より大きい、許容範囲外', () => {
      const sign0 = new ZodiacSign(0)
      const sign182 = new ZodiacSign(182)
      expect(sign0.aspect(sign182)).toEqual(null)
    })
  })
})
