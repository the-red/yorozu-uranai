import { ZodiacSign } from '../src/ZodiacSign'

describe('ZodiacSign', () => {
  describe('星座と角度', () => {
    const orb = 1
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

  describe('Element', () => {
    it('牡羊座:火', () => {
      const zodiacSign = new ZodiacSign(0.5) // 牡羊座
      expect(zodiacSign.element).toEqual('fire')
    })
  })

  describe('アスペクト', () => {
    const orb = 6
    describe('0度：コンジャクション', () => {
      it('ちょうど0', () => {
        const sign10 = new ZodiacSign(10)
        const sign10_2 = new ZodiacSign(10)
        expect(sign10.aspect(sign10_2, orb)).toEqual('conjunction')
      })
      it('0より小さい、許容範囲内', () => {
        const sign10 = new ZodiacSign(10)
        const sign4 = new ZodiacSign(4)
        expect(sign10.aspect(sign4, orb)).toEqual('conjunction')
      })
      it('0より小さい、許容範囲外', () => {
        const sign10 = new ZodiacSign(10)
        const sign3 = new ZodiacSign(3)
        expect(sign10.aspect(sign3, orb)).toEqual(null)
      })
      it('0より大きい、許容範囲内', () => {
        const sign10 = new ZodiacSign(10)
        const sign16 = new ZodiacSign(16)
        expect(sign10.aspect(sign16, orb)).toEqual('conjunction')
      })
      it('0より大きい、許容範囲外', () => {
        const sign10 = new ZodiacSign(10)
        const sign17 = new ZodiacSign(17)
        expect(sign10.aspect(sign17, orb)).toEqual(null)
      })
    })
    describe('180度：オポジション', () => {
      it('ちょうど180', () => {
        const sign0 = new ZodiacSign(0)
        const sign180 = new ZodiacSign(180)
        expect(sign0.aspect(sign180, orb)).toEqual('opposition')
      })
      it('180より小さい、許容範囲内', () => {
        const sign0 = new ZodiacSign(0)
        const sign174 = new ZodiacSign(174)
        expect(sign0.aspect(sign174, orb)).toEqual('opposition')
      })
      it('180より小さい、許容範囲外', () => {
        const sign0 = new ZodiacSign(0)
        const sign173 = new ZodiacSign(173)
        expect(sign0.aspect(sign173, orb)).toEqual(null)
      })
      it('180より大きい、許容範囲内', () => {
        const sign0 = new ZodiacSign(0)
        const sign186 = new ZodiacSign(186)
        expect(sign0.aspect(sign186, orb)).toEqual('opposition')
      })
      it('180より大きい、許容範囲外', () => {
        const sign0 = new ZodiacSign(0)
        const sign187 = new ZodiacSign(187)
        expect(sign0.aspect(sign187, orb)).toEqual(null)
      })
    })
  })
})
