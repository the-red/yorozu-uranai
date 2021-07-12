import { Planet } from '../../src/horoscope/Planet'

describe('Planet', () => {
  describe('星座と角度', () => {
    const orb = 1
    it('0.0: 魚座', () => {
      const planet = new Planet(0, 'sun')
      expect(planet.sign).toEqual('魚座')
      expect(planet.degrees).toEqual(0)
    })
    it('0.5: 牡羊座', () => {
      const planet = new Planet(0.5, 'sun')
      expect(planet.sign).toEqual('牡羊座')
      expect(planet.degrees).toEqual(0.5)
    })
    it('60.0: 牡牛座', () => {
      const planet = new Planet(60, 'sun')
      expect(planet.sign).toEqual('牡牛座')
      expect(planet.degrees).toEqual(0)
    })
    it('61.89: 双子座', () => {
      const planet = new Planet(61.89, 'sun')
      expect(planet.longitude).toEqual(61.89)
      expect(planet.sign).toEqual('双子座')
      expect(planet.degrees).toEqual(1.8900000000000006)
    })
  })

  describe('Element', () => {
    it('牡羊座：火', () => {
      const planet = new Planet(0.5, 'sun') // 牡羊座
      expect(planet.element).toEqual('fire')
    })
    it('牡牛座：地', () => {
      const planet = new Planet(30.5, 'sun') // 牡牛座
      expect(planet.element).toEqual('earth')
    })
    it('双子座：風', () => {
      const planet = new Planet(60.5, 'sun') // 双子座
      expect(planet.element).toEqual('air')
    })
    it('蟹座：水', () => {
      const planet = new Planet(90.5, 'sun') // 蟹座
      expect(planet.element).toEqual('water')
    })
    it('獅子座：火', () => {
      const planet = new Planet(120.5, 'sun') // 獅子座
      expect(planet.element).toEqual('fire')
    })
    it('乙女座：地', () => {
      const planet = new Planet(150.5, 'sun') // 乙女座
      expect(planet.element).toEqual('earth')
    })
    it('天秤座：風', () => {
      const planet = new Planet(180.5, 'sun') // 天秤座
      expect(planet.element).toEqual('air')
    })
    it('蠍座：水', () => {
      const planet = new Planet(210.5, 'sun') // 蠍座
      expect(planet.element).toEqual('water')
    })
    it('射手座：火', () => {
      const planet = new Planet(240.5, 'sun') // 射手座
      expect(planet.element).toEqual('fire')
    })
    it('山羊座：地', () => {
      const planet = new Planet(270.5, 'sun') // 山羊座
      expect(planet.element).toEqual('earth')
    })
    it('水瓶座：風', () => {
      const planet = new Planet(300.5, 'sun') // 水瓶座
      expect(planet.element).toEqual('air')
    })
    it('魚座：水', () => {
      const planet = new Planet(330.5, 'sun') // 魚座
      expect(planet.element).toEqual('water')
    })
  })

  describe('Quality', () => {
    it('牡羊座：活動宮', () => {
      const planet = new Planet(0.5, 'sun') // 牡羊座
      expect(planet.quality).toEqual('cardinal')
    })
    it('牡牛座：不動宮', () => {
      const planet = new Planet(30.5, 'sun') // 牡牛座
      expect(planet.quality).toEqual('fixed')
    })
    it('双子座：柔軟宮', () => {
      const planet = new Planet(60.5, 'sun') // 双子座
      expect(planet.quality).toEqual('mutable')
    })
    it('蟹座：活動宮', () => {
      const planet = new Planet(90.5, 'sun') // 蟹座
      expect(planet.quality).toEqual('cardinal')
    })
    it('獅子座：不動宮', () => {
      const planet = new Planet(120.5, 'sun') // 獅子座
      expect(planet.quality).toEqual('fixed')
    })
    it('乙女座：柔軟宮', () => {
      const planet = new Planet(150.5, 'sun') // 乙女座
      expect(planet.quality).toEqual('mutable')
    })
    it('天秤座：活動宮', () => {
      const planet = new Planet(180.5, 'sun') // 天秤座
      expect(planet.quality).toEqual('cardinal')
    })
    it('蠍座：不動宮', () => {
      const planet = new Planet(210.5, 'sun') // 蠍座
      expect(planet.quality).toEqual('fixed')
    })
    it('射手座：柔軟宮', () => {
      const planet = new Planet(240.5, 'sun') // 射手座
      expect(planet.quality).toEqual('mutable')
    })
    it('山羊座：活動宮', () => {
      const planet = new Planet(270.5, 'sun') // 山羊座
      expect(planet.quality).toEqual('cardinal')
    })
    it('水瓶座：不動宮', () => {
      const planet = new Planet(300.5, 'sun') // 水瓶座
      expect(planet.quality).toEqual('fixed')
    })
    it('魚座：柔軟宮', () => {
      const planet = new Planet(330.5, 'sun') // 魚座
      expect(planet.quality).toEqual('mutable')
    })
  })

  describe('Polarity', () => {
    it('牡羊座：男性', () => {
      const planet = new Planet(0.5, 'sun') // 牡羊座
      expect(planet.polarity).toEqual('masculine')
    })
    it('牡牛座：女性', () => {
      const planet = new Planet(30.5, 'sun') // 牡牛座
      expect(planet.polarity).toEqual('feminine')
    })
    it('双子座：男性', () => {
      const planet = new Planet(60.5, 'sun') // 双子座
      expect(planet.polarity).toEqual('masculine')
    })
    it('蟹座：女性', () => {
      const planet = new Planet(90.5, 'sun') // 蟹座
      expect(planet.polarity).toEqual('feminine')
    })
    it('獅子座：男性', () => {
      const planet = new Planet(120.5, 'sun') // 獅子座
      expect(planet.polarity).toEqual('masculine')
    })
    it('乙女座：女性', () => {
      const planet = new Planet(150.5, 'sun') // 乙女座
      expect(planet.polarity).toEqual('feminine')
    })
    it('天秤座：男性', () => {
      const planet = new Planet(180.5, 'sun') // 天秤座
      expect(planet.polarity).toEqual('masculine')
    })
    it('蠍座：女性', () => {
      const planet = new Planet(210.5, 'sun') // 蠍座
      expect(planet.polarity).toEqual('feminine')
    })
    it('射手座：男性', () => {
      const planet = new Planet(240.5, 'sun') // 射手座
      expect(planet.polarity).toEqual('masculine')
    })
    it('山羊座：女性', () => {
      const planet = new Planet(270.5, 'sun') // 山羊座
      expect(planet.polarity).toEqual('feminine')
    })
    it('水瓶座：男性', () => {
      const planet = new Planet(300.5, 'sun') // 水瓶座
      expect(planet.polarity).toEqual('masculine')
    })
    it('魚座：女性', () => {
      const planet = new Planet(330.5, 'sun') // 魚座
      expect(planet.polarity).toEqual('feminine')
    })
  })

  describe('メジャーアスペクト', () => {
    const orb = 6
    describe('0度：コンジャクション', () => {
      it('ちょうど基準値', () => {
        const planet1 = new Planet(10, 'sun')
        const planet2 = new Planet(10, 'sun')
        expect(planet1.majorAspect(planet2, orb)).toEqual('conjunction')
      })
      it('基準値より小さい、許容範囲内1', () => {
        const planet1 = new Planet(10, 'sun')
        const planet2 = new Planet(4, 'sun')
        expect(planet1.majorAspect(planet2, orb)).toEqual('conjunction')
      })
      it('基準値より小さい、許容範囲内2', () => {
        const planet1 = new Planet(4, 'sun')
        const planet2 = new Planet(10, 'sun')
        expect(planet1.majorAspect(planet2, orb)).toEqual('conjunction')
      })
      it('基準値より小さい、許容範囲外1', () => {
        const planet1 = new Planet(10, 'sun')
        const planet2 = new Planet(3, 'sun')
        expect(planet1.majorAspect(planet2, orb)).toEqual(undefined)
      })
      it('基準値より小さい、許容範囲外2', () => {
        const planet1 = new Planet(3, 'sun')
        const planet2 = new Planet(10, 'sun')
        expect(planet1.majorAspect(planet2, orb)).toEqual(undefined)
      })
      it('基準値より大きい、許容範囲内1', () => {
        const planet1 = new Planet(10, 'sun')
        const planet2 = new Planet(16, 'sun')
        expect(planet1.majorAspect(planet2, orb)).toEqual('conjunction')
      })
      it('基準値より大きい、許容範囲内2', () => {
        const planet1 = new Planet(16, 'sun')
        const planet2 = new Planet(10, 'sun')
        expect(planet1.majorAspect(planet2, orb)).toEqual('conjunction')
      })
      it('基準値より大きい、許容範囲外1', () => {
        const planet1 = new Planet(10, 'sun')
        const planet2 = new Planet(17, 'sun')
        expect(planet1.majorAspect(planet2, orb)).toEqual(undefined)
      })
      it('基準値より大きい、許容範囲外2', () => {
        const planet1 = new Planet(17, 'sun')
        const planet2 = new Planet(10, 'sun')
        expect(planet1.majorAspect(planet2, orb)).toEqual(undefined)
      })
    })
    describe('60度：セクスタイル', () => {
      it('ちょうど基準値1', () => {
        const planet1 = new Planet(10, 'sun')
        const planet2 = new Planet(70, 'sun')
        expect(planet1.majorAspect(planet2, orb)).toEqual('sextile')
      })
      it('ちょうど基準値2', () => {
        const planet1 = new Planet(70, 'sun')
        const planet2 = new Planet(10, 'sun')
        expect(planet1.majorAspect(planet2, orb)).toEqual('sextile')
      })
      it('基準値より小さい、許容範囲内1', () => {
        const planet1 = new Planet(10, 'sun')
        const planet2 = new Planet(64, 'sun')
        expect(planet1.majorAspect(planet2, orb)).toEqual('sextile')
      })
      it('基準値より小さい、許容範囲内2', () => {
        const planet1 = new Planet(64, 'sun')
        const planet2 = new Planet(10, 'sun')
        expect(planet1.majorAspect(planet2, orb)).toEqual('sextile')
      })
      it('基準値より小さい、許容範囲外1', () => {
        const planet1 = new Planet(10, 'sun')
        const planet2 = new Planet(63, 'sun')
        expect(planet1.majorAspect(planet2, orb)).toEqual(undefined)
      })
      it('基準値より小さい、許容範囲外2', () => {
        const planet1 = new Planet(63, 'sun')
        const planet2 = new Planet(10, 'sun')
        expect(planet1.majorAspect(planet2, orb)).toEqual(undefined)
      })
      it('基準値より大きい、許容範囲内1', () => {
        const planet1 = new Planet(10, 'sun')
        const planet2 = new Planet(76, 'sun')
        expect(planet1.majorAspect(planet2, orb)).toEqual('sextile')
      })
      it('基準値より大きい、許容範囲内2', () => {
        const planet1 = new Planet(76, 'sun')
        const planet2 = new Planet(10, 'sun')
        expect(planet1.majorAspect(planet2, orb)).toEqual('sextile')
      })
      it('基準値より大きい、許容範囲外1', () => {
        const planet1 = new Planet(10, 'sun')
        const planet2 = new Planet(77, 'sun')
        expect(planet1.majorAspect(planet2, orb)).toEqual(undefined)
      })
      it('基準値より大きい、許容範囲外2', () => {
        const planet1 = new Planet(77, 'sun')
        const planet2 = new Planet(10, 'sun')
        expect(planet1.majorAspect(planet2, orb)).toEqual(undefined)
      })
    })
    describe('90度：スクエア', () => {
      it('ちょうど基準値1', () => {
        const planet1 = new Planet(10, 'sun')
        const planet2 = new Planet(100, 'sun')
        expect(planet1.majorAspect(planet2, orb)).toEqual('square')
      })
      it('ちょうど基準値2', () => {
        const planet1 = new Planet(100, 'sun')
        const planet2 = new Planet(10, 'sun')
        expect(planet1.majorAspect(planet2, orb)).toEqual('square')
      })
      it('基準値より小さい、許容範囲内1', () => {
        const planet1 = new Planet(10, 'sun')
        const planet2 = new Planet(94, 'sun')
        expect(planet1.majorAspect(planet2, orb)).toEqual('square')
      })
      it('基準値より小さい、許容範囲内2', () => {
        const planet1 = new Planet(94, 'sun')
        const planet2 = new Planet(10, 'sun')
        expect(planet1.majorAspect(planet2, orb)).toEqual('square')
      })
      it('基準値より小さい、許容範囲外1', () => {
        const planet1 = new Planet(10, 'sun')
        const planet2 = new Planet(93, 'sun')
        expect(planet1.majorAspect(planet2, orb)).toEqual(undefined)
      })
      it('基準値より小さい、許容範囲外2', () => {
        const planet1 = new Planet(93, 'sun')
        const planet2 = new Planet(10, 'sun')
        expect(planet1.majorAspect(planet2, orb)).toEqual(undefined)
      })
      it('基準値より大きい、許容範囲内1', () => {
        const planet1 = new Planet(10, 'sun')
        const planet2 = new Planet(106, 'sun')
        expect(planet1.majorAspect(planet2, orb)).toEqual('square')
      })
      it('基準値より大きい、許容範囲内2', () => {
        const planet1 = new Planet(106, 'sun')
        const planet2 = new Planet(10, 'sun')
        expect(planet1.majorAspect(planet2, orb)).toEqual('square')
      })
      it('基準値より大きい、許容範囲外1', () => {
        const planet1 = new Planet(10, 'sun')
        const planet2 = new Planet(107, 'sun')
        expect(planet1.majorAspect(planet2, orb)).toEqual(undefined)
      })
      it('基準値より大きい、許容範囲外2', () => {
        const planet1 = new Planet(107, 'sun')
        const planet2 = new Planet(10, 'sun')
        expect(planet1.majorAspect(planet2, orb)).toEqual(undefined)
      })
    })
    describe('120度：トライン', () => {
      it('ちょうど基準値1', () => {
        const planet1 = new Planet(10, 'sun')
        const planet2 = new Planet(130, 'sun')
        expect(planet1.majorAspect(planet2, orb)).toEqual('trine')
      })
      it('ちょうど基準値2', () => {
        const planet1 = new Planet(130, 'sun')
        const planet2 = new Planet(10, 'sun')
        expect(planet1.majorAspect(planet2, orb)).toEqual('trine')
      })
      it('基準値より小さい、許容範囲内1', () => {
        const planet1 = new Planet(10, 'sun')
        const planet2 = new Planet(124, 'sun')
        expect(planet1.majorAspect(planet2, orb)).toEqual('trine')
      })
      it('基準値より小さい、許容範囲内2', () => {
        const planet1 = new Planet(124, 'sun')
        const planet2 = new Planet(10, 'sun')
        expect(planet1.majorAspect(planet2, orb)).toEqual('trine')
      })
      it('基準値より小さい、許容範囲外1', () => {
        const planet1 = new Planet(10, 'sun')
        const planet2 = new Planet(123, 'sun')
        expect(planet1.majorAspect(planet2, orb)).toEqual(undefined)
      })
      it('基準値より小さい、許容範囲外2', () => {
        const planet1 = new Planet(123, 'sun')
        const planet2 = new Planet(10, 'sun')
        expect(planet1.majorAspect(planet2, orb)).toEqual(undefined)
      })
      it('基準値より大きい、許容範囲内1', () => {
        const planet1 = new Planet(10, 'sun')
        const planet2 = new Planet(136, 'sun')
        expect(planet1.majorAspect(planet2, orb)).toEqual('trine')
      })
      it('基準値より大きい、許容範囲内2', () => {
        const planet1 = new Planet(136, 'sun')
        const planet2 = new Planet(10, 'sun')
        expect(planet1.majorAspect(planet2, orb)).toEqual('trine')
      })
      it('基準値より大きい、許容範囲外1', () => {
        const planet1 = new Planet(10, 'sun')
        const planet2 = new Planet(137, 'sun')
        expect(planet1.majorAspect(planet2, orb)).toEqual(undefined)
      })
      it('基準値より大きい、許容範囲外2', () => {
        const planet1 = new Planet(137, 'sun')
        const planet2 = new Planet(10, 'sun')
        expect(planet1.majorAspect(planet2, orb)).toEqual(undefined)
      })
    })
    describe('180度：オポジション', () => {
      it('ちょうど基準値1', () => {
        const planet1 = new Planet(10, 'sun')
        const planet2 = new Planet(190, 'sun')
        expect(planet1.majorAspect(planet2, orb)).toEqual('opposition')
      })
      it('ちょうど基準値2', () => {
        const planet1 = new Planet(190, 'sun')
        const planet2 = new Planet(10, 'sun')
        expect(planet1.majorAspect(planet2, orb)).toEqual('opposition')
      })
      it('基準値より小さい、許容範囲内1', () => {
        const planet1 = new Planet(10, 'sun')
        const planet2 = new Planet(184, 'sun')
        expect(planet1.majorAspect(planet2, orb)).toEqual('opposition')
      })
      it('基準値より小さい、許容範囲内2', () => {
        const planet1 = new Planet(184, 'sun')
        const planet2 = new Planet(10, 'sun')
        expect(planet1.majorAspect(planet2, orb)).toEqual('opposition')
      })
      it('基準値より小さい、許容範囲外1', () => {
        const planet1 = new Planet(10, 'sun')
        const planet2 = new Planet(183, 'sun')
        expect(planet1.majorAspect(planet2, orb)).toEqual(undefined)
      })
      it('基準値より小さい、許容範囲外2', () => {
        const planet1 = new Planet(183, 'sun')
        const planet2 = new Planet(10, 'sun')
        expect(planet1.majorAspect(planet2, orb)).toEqual(undefined)
      })
      it('基準値より大きい、許容範囲内1', () => {
        const planet1 = new Planet(10, 'sun')
        const planet2 = new Planet(196, 'sun')
        expect(planet1.majorAspect(planet2, orb)).toEqual('opposition')
      })
      it('基準値より大きい、許容範囲内2', () => {
        const planet1 = new Planet(196, 'sun')
        const planet2 = new Planet(10, 'sun')
        expect(planet1.majorAspect(planet2, orb)).toEqual('opposition')
      })
      it('基準値より大きい、許容範囲外1', () => {
        const planet1 = new Planet(10, 'sun')
        const planet2 = new Planet(197, 'sun')
        expect(planet1.majorAspect(planet2, orb)).toEqual(undefined)
      })
      it('基準値より大きい、許容範囲外2', () => {
        const planet1 = new Planet(197, 'sun')
        const planet2 = new Planet(10, 'sun')
        expect(planet1.majorAspect(planet2, orb)).toEqual(undefined)
      })
    })
  })

  describe('マイナーアスペクト', () => {
    const orb = 2
    describe('30度：セミセクスタイル', () => {
      it('ちょうど基準値1', () => {
        const planet1 = new Planet(10, 'sun')
        const planet2 = new Planet(40, 'sun')
        expect(planet1.minorAspect(planet2, orb)).toEqual('semi-sextile')
      })
      it('ちょうど基準値2', () => {
        const planet1 = new Planet(40, 'sun')
        const planet2 = new Planet(10, 'sun')
        expect(planet1.minorAspect(planet2, orb)).toEqual('semi-sextile')
      })
      it('基準値より小さい、許容範囲内1', () => {
        const planet1 = new Planet(10, 'sun')
        const planet2 = new Planet(38, 'sun')
        expect(planet1.minorAspect(planet2, orb)).toEqual('semi-sextile')
      })
      it('基準値より小さい、許容範囲内2', () => {
        const planet1 = new Planet(38, 'sun')
        const planet2 = new Planet(10, 'sun')
        expect(planet1.minorAspect(planet2, orb)).toEqual('semi-sextile')
      })
      it('基準値より小さい、許容範囲外1', () => {
        const planet1 = new Planet(10, 'sun')
        const planet2 = new Planet(37, 'sun')
        expect(planet1.minorAspect(planet2, orb)).toEqual(undefined)
      })
      it('基準値より小さい、許容範囲外2', () => {
        const planet1 = new Planet(37, 'sun')
        const planet2 = new Planet(10, 'sun')
        expect(planet1.minorAspect(planet2, orb)).toEqual(undefined)
      })
      it('基準値より大きい、許容範囲内1', () => {
        const planet1 = new Planet(10, 'sun')
        const planet2 = new Planet(42, 'sun')
        expect(planet1.minorAspect(planet2, orb)).toEqual('semi-sextile')
      })
      it('基準値より大きい、許容範囲内2', () => {
        const planet1 = new Planet(42, 'sun')
        const planet2 = new Planet(10, 'sun')
        expect(planet1.minorAspect(planet2, orb)).toEqual('semi-sextile')
      })
      it('基準値より大きい、許容範囲外1', () => {
        const planet1 = new Planet(10, 'sun')
        const planet2 = new Planet(43, 'sun')
        expect(planet1.minorAspect(planet2, orb)).toEqual(undefined)
      })
      it('基準値より大きい、許容範囲外2', () => {
        const planet1 = new Planet(43, 'sun')
        const planet2 = new Planet(10, 'sun')
        expect(planet1.minorAspect(planet2, orb)).toEqual(undefined)
      })
    })
    describe('45度：セミスクエア', () => {
      it('ちょうど基準値1', () => {
        const planet1 = new Planet(10, 'sun')
        const planet2 = new Planet(55, 'sun')
        expect(planet1.minorAspect(planet2, orb)).toEqual('semi-square')
      })
      it('ちょうど基準値2', () => {
        const planet1 = new Planet(55, 'sun')
        const planet2 = new Planet(10, 'sun')
        expect(planet1.minorAspect(planet2, orb)).toEqual('semi-square')
      })
      it('基準値より小さい、許容範囲内1', () => {
        const planet1 = new Planet(10, 'sun')
        const planet2 = new Planet(53, 'sun')
        expect(planet1.minorAspect(planet2, orb)).toEqual('semi-square')
      })
      it('基準値より小さい、許容範囲内2', () => {
        const planet1 = new Planet(53, 'sun')
        const planet2 = new Planet(10, 'sun')
        expect(planet1.minorAspect(planet2, orb)).toEqual('semi-square')
      })
      it('基準値より小さい、許容範囲外1', () => {
        const planet1 = new Planet(10, 'sun')
        const planet2 = new Planet(52, 'sun')
        expect(planet1.minorAspect(planet2, orb)).toEqual(undefined)
      })
      it('基準値より小さい、許容範囲外2', () => {
        const planet1 = new Planet(52, 'sun')
        const planet2 = new Planet(10, 'sun')
        expect(planet1.minorAspect(planet2, orb)).toEqual(undefined)
      })
      it('基準値より大きい、許容範囲内1', () => {
        const planet1 = new Planet(10, 'sun')
        const planet2 = new Planet(57, 'sun')
        expect(planet1.minorAspect(planet2, orb)).toEqual('semi-square')
      })
      it('基準値より大きい、許容範囲内2', () => {
        const planet1 = new Planet(57, 'sun')
        const planet2 = new Planet(10, 'sun')
        expect(planet1.minorAspect(planet2, orb)).toEqual('semi-square')
      })
      it('基準値より大きい、許容範囲外1', () => {
        const planet1 = new Planet(10, 'sun')
        const planet2 = new Planet(58, 'sun')
        expect(planet1.minorAspect(planet2, orb)).toEqual(undefined)
      })
      it('基準値より大きい、許容範囲外2', () => {
        const planet1 = new Planet(58, 'sun')
        const planet2 = new Planet(10, 'sun')
        expect(planet1.minorAspect(planet2, orb)).toEqual(undefined)
      })
    })
    describe('72度：クィンタイル', () => {
      it('ちょうど基準値1', () => {
        const planet1 = new Planet(10, 'sun')
        const planet2 = new Planet(82, 'sun')
        expect(planet1.minorAspect(planet2, orb)).toEqual('quintile')
      })
      it('ちょうど基準値2', () => {
        const planet1 = new Planet(82, 'sun')
        const planet2 = new Planet(10, 'sun')
        expect(planet1.minorAspect(planet2, orb)).toEqual('quintile')
      })
      it('基準値より小さい、許容範囲内1', () => {
        const planet1 = new Planet(10, 'sun')
        const planet2 = new Planet(80, 'sun')
        expect(planet1.minorAspect(planet2, orb)).toEqual('quintile')
      })
      it('基準値より小さい、許容範囲内2', () => {
        const planet1 = new Planet(80, 'sun')
        const planet2 = new Planet(10, 'sun')
        expect(planet1.minorAspect(planet2, orb)).toEqual('quintile')
      })
      it('基準値より小さい、許容範囲外1', () => {
        const planet1 = new Planet(10, 'sun')
        const planet2 = new Planet(79, 'sun')
        expect(planet1.minorAspect(planet2, orb)).toEqual(undefined)
      })
      it('基準値より小さい、許容範囲外2', () => {
        const planet1 = new Planet(79, 'sun')
        const planet2 = new Planet(10, 'sun')
        expect(planet1.minorAspect(planet2, orb)).toEqual(undefined)
      })
      it('基準値より大きい、許容範囲内1', () => {
        const planet1 = new Planet(10, 'sun')
        const planet2 = new Planet(84, 'sun')
        expect(planet1.minorAspect(planet2, orb)).toEqual('quintile')
      })
      it('基準値より大きい、許容範囲内2', () => {
        const planet1 = new Planet(84, 'sun')
        const planet2 = new Planet(10, 'sun')
        expect(planet1.minorAspect(planet2, orb)).toEqual('quintile')
      })
      it('基準値より大きい、許容範囲外1', () => {
        const planet1 = new Planet(10, 'sun')
        const planet2 = new Planet(85, 'sun')
        expect(planet1.minorAspect(planet2, orb)).toEqual(undefined)
      })
      it('基準値より大きい、許容範囲外2', () => {
        const planet1 = new Planet(85, 'sun')
        const planet2 = new Planet(10, 'sun')
        expect(planet1.minorAspect(planet2, orb)).toEqual(undefined)
      })
    })
    describe('135度：セスキコードレート', () => {
      it('ちょうど基準値1', () => {
        const planet1 = new Planet(10, 'sun')
        const planet2 = new Planet(145, 'sun')
        expect(planet1.minorAspect(planet2, orb)).toEqual('sesquiquadrate')
      })
      it('ちょうど基準値2', () => {
        const planet1 = new Planet(145, 'sun')
        const planet2 = new Planet(10, 'sun')
        expect(planet1.minorAspect(planet2, orb)).toEqual('sesquiquadrate')
      })
      it('基準値より小さい、許容範囲内1', () => {
        const planet1 = new Planet(10, 'sun')
        const planet2 = new Planet(143, 'sun')
        expect(planet1.minorAspect(planet2, orb)).toEqual('sesquiquadrate')
      })
      it('基準値より小さい、許容範囲内2', () => {
        const planet1 = new Planet(143, 'sun')
        const planet2 = new Planet(10, 'sun')
        expect(planet1.minorAspect(planet2, orb)).toEqual('sesquiquadrate')
      })
      it('基準値より小さい、許容範囲外1', () => {
        const planet1 = new Planet(10, 'sun')
        const planet2 = new Planet(142, 'sun')
        expect(planet1.minorAspect(planet2, orb)).toEqual(undefined)
      })
      it('基準値より小さい、許容範囲外2', () => {
        const planet1 = new Planet(142, 'sun')
        const planet2 = new Planet(10, 'sun')
        expect(planet1.minorAspect(planet2, orb)).toEqual(undefined)
      })
      it('基準値より大きい、許容範囲内1', () => {
        const planet1 = new Planet(10, 'sun')
        const planet2 = new Planet(147, 'sun')
        expect(planet1.minorAspect(planet2, orb)).toEqual('sesquiquadrate')
      })
      it('基準値より大きい、許容範囲内2', () => {
        const planet1 = new Planet(147, 'sun')
        const planet2 = new Planet(10, 'sun')
        expect(planet1.minorAspect(planet2, orb)).toEqual('sesquiquadrate')
      })
      it('基準値より大きい、許容範囲外1', () => {
        const planet1 = new Planet(10, 'sun')
        const planet2 = new Planet(148, 'sun')
        expect(planet1.minorAspect(planet2, orb)).toEqual(undefined)
      })
      it('基準値より大きい、許容範囲外2', () => {
        const planet1 = new Planet(148, 'sun')
        const planet2 = new Planet(10, 'sun')
        expect(planet1.minorAspect(planet2, orb)).toEqual(undefined)
      })
    })
    describe('144度：バイクインタイル', () => {
      it('ちょうど基準値1', () => {
        const planet1 = new Planet(10, 'sun')
        const planet2 = new Planet(154, 'sun')
        expect(planet1.minorAspect(planet2, orb)).toEqual('biquintile')
      })
      it('ちょうど基準値2', () => {
        const planet1 = new Planet(154, 'sun')
        const planet2 = new Planet(10, 'sun')
        expect(planet1.minorAspect(planet2, orb)).toEqual('biquintile')
      })
      it('基準値より小さい、許容範囲内1', () => {
        const planet1 = new Planet(10, 'sun')
        const planet2 = new Planet(152, 'sun')
        expect(planet1.minorAspect(planet2, orb)).toEqual('biquintile')
      })
      it('基準値より小さい、許容範囲内2', () => {
        const planet1 = new Planet(152, 'sun')
        const planet2 = new Planet(10, 'sun')
        expect(planet1.minorAspect(planet2, orb)).toEqual('biquintile')
      })
      it('基準値より小さい、許容範囲外1', () => {
        const planet1 = new Planet(10, 'sun')
        const planet2 = new Planet(151, 'sun')
        expect(planet1.minorAspect(planet2, orb)).toEqual(undefined)
      })
      it('基準値より小さい、許容範囲外2', () => {
        const planet1 = new Planet(151, 'sun')
        const planet2 = new Planet(10, 'sun')
        expect(planet1.minorAspect(planet2, orb)).toEqual(undefined)
      })
      it('基準値より大きい、許容範囲内1', () => {
        const planet1 = new Planet(10, 'sun')
        const planet2 = new Planet(156, 'sun')
        expect(planet1.minorAspect(planet2, orb)).toEqual('biquintile')
      })
      it('基準値より大きい、許容範囲内2', () => {
        const planet1 = new Planet(156, 'sun')
        const planet2 = new Planet(10, 'sun')
        expect(planet1.minorAspect(planet2, orb)).toEqual('biquintile')
      })
      it('基準値より大きい、許容範囲外1', () => {
        const planet1 = new Planet(10, 'sun')
        const planet2 = new Planet(157, 'sun')
        expect(planet1.minorAspect(planet2, orb)).toEqual(undefined)
      })
      it('基準値より大きい、許容範囲外2', () => {
        const planet1 = new Planet(157, 'sun')
        const planet2 = new Planet(10, 'sun')
        expect(planet1.minorAspect(planet2, orb)).toEqual(undefined)
      })
    })
    describe('150度：クインカンクス', () => {
      it('ちょうど基準値1', () => {
        const planet1 = new Planet(10, 'sun')
        const sign150 = new Planet(160, 'sun')
        expect(planet1.minorAspect(sign150, orb)).toEqual('quincunx')
      })
      it('ちょうど基準値2', () => {
        const planet1 = new Planet(160, 'sun')
        const sign150 = new Planet(10, 'sun')
        expect(planet1.minorAspect(sign150, orb)).toEqual('quincunx')
      })
      it('基準値より小さい、許容範囲内1', () => {
        const planet1 = new Planet(10, 'sun')
        const planet2 = new Planet(158, 'sun')
        expect(planet1.minorAspect(planet2, orb)).toEqual('quincunx')
      })
      it('基準値より小さい、許容範囲内2', () => {
        const planet1 = new Planet(158, 'sun')
        const planet2 = new Planet(10, 'sun')
        expect(planet1.minorAspect(planet2, orb)).toEqual('quincunx')
      })
      it('基準値より小さい、許容範囲外1', () => {
        const planet1 = new Planet(10, 'sun')
        const planet2 = new Planet(157, 'sun')
        expect(planet1.minorAspect(planet2, orb)).toEqual(undefined)
      })
      it('基準値より小さい、許容範囲外2', () => {
        const planet1 = new Planet(157, 'sun')
        const planet2 = new Planet(10, 'sun')
        expect(planet1.minorAspect(planet2, orb)).toEqual(undefined)
      })
      it('基準値より大きい、許容範囲内1', () => {
        const planet1 = new Planet(10, 'sun')
        const planet2 = new Planet(162, 'sun')
        expect(planet1.minorAspect(planet2, orb)).toEqual('quincunx')
      })
      it('基準値より大きい、許容範囲内2', () => {
        const planet1 = new Planet(162, 'sun')
        const planet2 = new Planet(10, 'sun')
        expect(planet1.minorAspect(planet2, orb)).toEqual('quincunx')
      })
      it('基準値より大きい、許容範囲外1', () => {
        const planet1 = new Planet(10, 'sun')
        const planet2 = new Planet(163, 'sun')
        expect(planet1.minorAspect(planet2, orb)).toEqual(undefined)
      })
      it('基準値より大きい、許容範囲外2', () => {
        const planet1 = new Planet(163, 'sun')
        const planet2 = new Planet(10, 'sun')
        expect(planet1.minorAspect(planet2, orb)).toEqual(undefined)
      })
    })
  })
})
