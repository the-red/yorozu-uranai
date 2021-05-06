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

  describe('メジャーアスペクト', () => {
    const orb = 6
    describe('0度：コンジャクション', () => {
      it('ちょうど0', () => {
        const sign10 = new ZodiacSign(10)
        const sign10_2 = new ZodiacSign(10)
        expect(sign10.majorAspect(sign10_2, orb)).toEqual('conjunction')
      })
      it('0より小さい、許容範囲内', () => {
        const sign10 = new ZodiacSign(10)
        const sign4 = new ZodiacSign(4)
        expect(sign10.majorAspect(sign4, orb)).toEqual('conjunction')
      })
      it('0より小さい、許容範囲外', () => {
        const sign10 = new ZodiacSign(10)
        const sign3 = new ZodiacSign(3)
        expect(sign10.majorAspect(sign3, orb)).toEqual(null)
      })
      it('0より大きい、許容範囲内', () => {
        const sign10 = new ZodiacSign(10)
        const sign16 = new ZodiacSign(16)
        expect(sign10.majorAspect(sign16, orb)).toEqual('conjunction')
      })
      it('0より大きい、許容範囲外', () => {
        const sign10 = new ZodiacSign(10)
        const sign17 = new ZodiacSign(17)
        expect(sign10.majorAspect(sign17, orb)).toEqual(null)
      })
    })
    describe('60度：セクスタイル', () => {
      it('ちょうど60', () => {
        const sign0 = new ZodiacSign(0)
        const sign60 = new ZodiacSign(60)
        expect(sign0.majorAspect(sign60, orb)).toEqual('sextile')
      })
      it('60より小さい、許容範囲内', () => {
        const sign0 = new ZodiacSign(0)
        const sign54 = new ZodiacSign(54)
        expect(sign0.majorAspect(sign54, orb)).toEqual('sextile')
      })
      it('60より小さい、許容範囲外', () => {
        const sign0 = new ZodiacSign(0)
        const sign53 = new ZodiacSign(53)
        expect(sign0.majorAspect(sign53, orb)).toEqual(null)
      })
      it('60より大きい、許容範囲内', () => {
        const sign0 = new ZodiacSign(0)
        const sign66 = new ZodiacSign(66)
        expect(sign0.majorAspect(sign66, orb)).toEqual('sextile')
      })
      it('60より大きい、許容範囲外', () => {
        const sign0 = new ZodiacSign(0)
        const sign67 = new ZodiacSign(67)
        expect(sign0.majorAspect(sign67, orb)).toEqual(null)
      })
    })
    describe('90度：スクエア', () => {
      it('ちょうど90', () => {
        const sign0 = new ZodiacSign(0)
        const sign90 = new ZodiacSign(90)
        expect(sign0.majorAspect(sign90, orb)).toEqual('square')
      })
      it('90より小さい、許容範囲内', () => {
        const sign0 = new ZodiacSign(0)
        const sign84 = new ZodiacSign(84)
        expect(sign0.majorAspect(sign84, orb)).toEqual('square')
      })
      it('90より小さい、許容範囲外', () => {
        const sign0 = new ZodiacSign(0)
        const sign83 = new ZodiacSign(83)
        expect(sign0.majorAspect(sign83, orb)).toEqual(null)
      })
      it('90より大きい、許容範囲内', () => {
        const sign0 = new ZodiacSign(0)
        const sign96 = new ZodiacSign(96)
        expect(sign0.majorAspect(sign96, orb)).toEqual('square')
      })
      it('90より大きい、許容範囲外', () => {
        const sign0 = new ZodiacSign(0)
        const sign97 = new ZodiacSign(97)
        expect(sign0.majorAspect(sign97, orb)).toEqual(null)
      })
    })
    describe('120度：トライン', () => {
      it('ちょうど120', () => {
        const sign0 = new ZodiacSign(0)
        const sign120 = new ZodiacSign(120)
        expect(sign0.majorAspect(sign120, orb)).toEqual('trine')
      })
      it('120より小さい、許容範囲内', () => {
        const sign0 = new ZodiacSign(0)
        const sign114 = new ZodiacSign(114)
        expect(sign0.majorAspect(sign114, orb)).toEqual('trine')
      })
      it('120より小さい、許容範囲外', () => {
        const sign0 = new ZodiacSign(0)
        const sign113 = new ZodiacSign(113)
        expect(sign0.majorAspect(sign113, orb)).toEqual(null)
      })
      it('120より大きい、許容範囲内', () => {
        const sign0 = new ZodiacSign(0)
        const sign126 = new ZodiacSign(126)
        expect(sign0.majorAspect(sign126, orb)).toEqual('trine')
      })
      it('120より大きい、許容範囲外', () => {
        const sign0 = new ZodiacSign(0)
        const sign127 = new ZodiacSign(127)
        expect(sign0.majorAspect(sign127, orb)).toEqual(null)
      })
    })
    describe('180度：オポジション', () => {
      it('ちょうど180', () => {
        const sign0 = new ZodiacSign(0)
        const sign180 = new ZodiacSign(180)
        expect(sign0.majorAspect(sign180, orb)).toEqual('opposition')
      })
      it('180より小さい、許容範囲内', () => {
        const sign0 = new ZodiacSign(0)
        const sign174 = new ZodiacSign(174)
        expect(sign0.majorAspect(sign174, orb)).toEqual('opposition')
      })
      it('180より小さい、許容範囲外', () => {
        const sign0 = new ZodiacSign(0)
        const sign173 = new ZodiacSign(173)
        expect(sign0.majorAspect(sign173, orb)).toEqual(null)
      })
      it('180より大きい、許容範囲内', () => {
        const sign0 = new ZodiacSign(0)
        const sign186 = new ZodiacSign(186)
        expect(sign0.majorAspect(sign186, orb)).toEqual('opposition')
      })
      it('180より大きい、許容範囲外', () => {
        const sign0 = new ZodiacSign(0)
        const sign187 = new ZodiacSign(187)
        expect(sign0.majorAspect(sign187, orb)).toEqual(null)
      })
    })
  })

  describe('マイナーアスペクト', () => {
    const orb = 2
    describe('30度：セミセクスタイル', () => {
      it('ちょうど30', () => {
        const sign0 = new ZodiacSign(0)
        const sign30 = new ZodiacSign(30)
        expect(sign0.minorAspect(sign30, orb)).toEqual('semi-sextile')
      })
      it('30より小さい、許容範囲内', () => {
        const sign0 = new ZodiacSign(0)
        const sign28 = new ZodiacSign(28)
        expect(sign0.minorAspect(sign28, orb)).toEqual('semi-sextile')
      })
      it('30より小さい、許容範囲外', () => {
        const sign0 = new ZodiacSign(0)
        const sign27 = new ZodiacSign(27)
        expect(sign0.minorAspect(sign27, orb)).toEqual(null)
      })
      it('30より大きい、許容範囲内', () => {
        const sign0 = new ZodiacSign(0)
        const sign32 = new ZodiacSign(32)
        expect(sign0.minorAspect(sign32, orb)).toEqual('semi-sextile')
      })
      it('30より大きい、許容範囲外', () => {
        const sign0 = new ZodiacSign(0)
        const sign33 = new ZodiacSign(33)
        expect(sign0.minorAspect(sign33, orb)).toEqual(null)
      })
    })
  })
})
