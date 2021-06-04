import { Planet } from '../../src/horoscope/Planet'

describe('Planet', () => {
  describe('星座と角度', () => {
    const orb = 1
    it('0.0: 魚座', () => {
      const planet = new Planet(0)
      expect(planet.sign).toEqual('魚座')
      expect(planet.degrees).toEqual(0)
    })
    it('0.5: 牡羊座', () => {
      const planet = new Planet(0.5)
      expect(planet.sign).toEqual('牡羊座')
      expect(planet.degrees).toEqual(0.5)
    })
    it('60.0: 牡牛座', () => {
      const planet = new Planet(60)
      expect(planet.sign).toEqual('牡牛座')
      expect(planet.degrees).toEqual(0)
    })
    it('61.89: 双子座', () => {
      const planet = new Planet(61.89)
      expect(planet.longitude).toEqual(61.89)
      expect(planet.sign).toEqual('双子座')
      expect(planet.degrees).toEqual(1.8900000000000006)
    })
  })

  describe('Element', () => {
    it('牡羊座：火', () => {
      const planet = new Planet(0.5) // 牡羊座
      expect(planet.element).toEqual('fire')
    })
    it('牡牛座：地', () => {
      const planet = new Planet(30.5) // 牡牛座
      expect(planet.element).toEqual('earth')
    })
    it('双子座：風', () => {
      const planet = new Planet(60.5) // 双子座
      expect(planet.element).toEqual('air')
    })
    it('蟹座：水', () => {
      const planet = new Planet(90.5) // 蟹座
      expect(planet.element).toEqual('water')
    })
    it('獅子座：火', () => {
      const planet = new Planet(120.5) // 獅子座
      expect(planet.element).toEqual('fire')
    })
    it('乙女座：地', () => {
      const planet = new Planet(150.5) // 乙女座
      expect(planet.element).toEqual('earth')
    })
    it('天秤座：風', () => {
      const planet = new Planet(180.5) // 天秤座
      expect(planet.element).toEqual('air')
    })
    it('蠍座：水', () => {
      const planet = new Planet(210.5) // 蠍座
      expect(planet.element).toEqual('water')
    })
    it('射手座：火', () => {
      const planet = new Planet(240.5) // 射手座
      expect(planet.element).toEqual('fire')
    })
    it('山羊座：地', () => {
      const planet = new Planet(270.5) // 山羊座
      expect(planet.element).toEqual('earth')
    })
    it('水瓶座：風', () => {
      const planet = new Planet(300.5) // 水瓶座
      expect(planet.element).toEqual('air')
    })
    it('魚座：水', () => {
      const planet = new Planet(330.5) // 魚座
      expect(planet.element).toEqual('water')
    })
  })

  describe('Quality', () => {
    it('牡羊座：活動宮', () => {
      const planet = new Planet(0.5) // 牡羊座
      expect(planet.quality).toEqual('cardinal')
    })
    it('牡牛座：不動宮', () => {
      const planet = new Planet(30.5) // 牡牛座
      expect(planet.quality).toEqual('fixed')
    })
    it('双子座：柔軟宮', () => {
      const planet = new Planet(60.5) // 双子座
      expect(planet.quality).toEqual('mutable')
    })
    it('蟹座：活動宮', () => {
      const planet = new Planet(90.5) // 蟹座
      expect(planet.quality).toEqual('cardinal')
    })
    it('獅子座：不動宮', () => {
      const planet = new Planet(120.5) // 獅子座
      expect(planet.quality).toEqual('fixed')
    })
    it('乙女座：柔軟宮', () => {
      const planet = new Planet(150.5) // 乙女座
      expect(planet.quality).toEqual('mutable')
    })
    it('天秤座：活動宮', () => {
      const planet = new Planet(180.5) // 天秤座
      expect(planet.quality).toEqual('cardinal')
    })
    it('蠍座：不動宮', () => {
      const planet = new Planet(210.5) // 蠍座
      expect(planet.quality).toEqual('fixed')
    })
    it('射手座：柔軟宮', () => {
      const planet = new Planet(240.5) // 射手座
      expect(planet.quality).toEqual('mutable')
    })
    it('山羊座：活動宮', () => {
      const planet = new Planet(270.5) // 山羊座
      expect(planet.quality).toEqual('cardinal')
    })
    it('水瓶座：不動宮', () => {
      const planet = new Planet(300.5) // 水瓶座
      expect(planet.quality).toEqual('fixed')
    })
    it('魚座：柔軟宮', () => {
      const planet = new Planet(330.5) // 魚座
      expect(planet.quality).toEqual('mutable')
    })
  })

  describe('Polarity', () => {
    it('牡羊座：男性', () => {
      const planet = new Planet(0.5) // 牡羊座
      expect(planet.polarity).toEqual('masculine')
    })
    it('牡牛座：女性', () => {
      const planet = new Planet(30.5) // 牡牛座
      expect(planet.polarity).toEqual('feminine')
    })
    it('双子座：男性', () => {
      const planet = new Planet(60.5) // 双子座
      expect(planet.polarity).toEqual('masculine')
    })
    it('蟹座：女性', () => {
      const planet = new Planet(90.5) // 蟹座
      expect(planet.polarity).toEqual('feminine')
    })
    it('獅子座：男性', () => {
      const planet = new Planet(120.5) // 獅子座
      expect(planet.polarity).toEqual('masculine')
    })
    it('乙女座：女性', () => {
      const planet = new Planet(150.5) // 乙女座
      expect(planet.polarity).toEqual('feminine')
    })
    it('天秤座：男性', () => {
      const planet = new Planet(180.5) // 天秤座
      expect(planet.polarity).toEqual('masculine')
    })
    it('蠍座：女性', () => {
      const planet = new Planet(210.5) // 蠍座
      expect(planet.polarity).toEqual('feminine')
    })
    it('射手座：男性', () => {
      const planet = new Planet(240.5) // 射手座
      expect(planet.polarity).toEqual('masculine')
    })
    it('山羊座：女性', () => {
      const planet = new Planet(270.5) // 山羊座
      expect(planet.polarity).toEqual('feminine')
    })
    it('水瓶座：男性', () => {
      const planet = new Planet(300.5) // 水瓶座
      expect(planet.polarity).toEqual('masculine')
    })
    it('魚座：女性', () => {
      const planet = new Planet(330.5) // 魚座
      expect(planet.polarity).toEqual('feminine')
    })
  })

  describe('メジャーアスペクト', () => {
    const orb = 6
    describe('0度：コンジャクション', () => {
      it('ちょうど基準値', () => {
        const planet1 = new Planet(10)
        const planet2 = new Planet(10)
        expect(planet1.majorAspect(planet2, orb)).toEqual('conjunction')
      })
      it('基準値より小さい、許容範囲内1', () => {
        const planet1 = new Planet(10)
        const planet2 = new Planet(4)
        expect(planet1.majorAspect(planet2, orb)).toEqual('conjunction')
      })
      it('基準値より小さい、許容範囲内2', () => {
        const planet1 = new Planet(4)
        const planet2 = new Planet(10)
        expect(planet1.majorAspect(planet2, orb)).toEqual('conjunction')
      })
      it('基準値より小さい、許容範囲外1', () => {
        const planet1 = new Planet(10)
        const planet2 = new Planet(3)
        expect(planet1.majorAspect(planet2, orb)).toEqual(undefined)
      })
      it('基準値より小さい、許容範囲外2', () => {
        const planet1 = new Planet(3)
        const planet2 = new Planet(10)
        expect(planet1.majorAspect(planet2, orb)).toEqual(undefined)
      })
      it('基準値より大きい、許容範囲内1', () => {
        const planet1 = new Planet(10)
        const planet2 = new Planet(16)
        expect(planet1.majorAspect(planet2, orb)).toEqual('conjunction')
      })
      it('基準値より大きい、許容範囲内2', () => {
        const planet1 = new Planet(16)
        const planet2 = new Planet(10)
        expect(planet1.majorAspect(planet2, orb)).toEqual('conjunction')
      })
      it('基準値より大きい、許容範囲外1', () => {
        const planet1 = new Planet(10)
        const planet2 = new Planet(17)
        expect(planet1.majorAspect(planet2, orb)).toEqual(undefined)
      })
      it('基準値より大きい、許容範囲外2', () => {
        const planet1 = new Planet(17)
        const planet2 = new Planet(10)
        expect(planet1.majorAspect(planet2, orb)).toEqual(undefined)
      })
    })
    describe('60度：セクスタイル', () => {
      it('ちょうど基準値1', () => {
        const planet1 = new Planet(10)
        const planet2 = new Planet(70)
        expect(planet1.majorAspect(planet2, orb)).toEqual('sextile')
      })
      it('ちょうど基準値2', () => {
        const planet1 = new Planet(70)
        const planet2 = new Planet(10)
        expect(planet1.majorAspect(planet2, orb)).toEqual('sextile')
      })
      it('基準値より小さい、許容範囲内1', () => {
        const planet1 = new Planet(10)
        const planet2 = new Planet(64)
        expect(planet1.majorAspect(planet2, orb)).toEqual('sextile')
      })
      it('基準値より小さい、許容範囲内2', () => {
        const planet1 = new Planet(64)
        const planet2 = new Planet(10)
        expect(planet1.majorAspect(planet2, orb)).toEqual('sextile')
      })
      it('基準値より小さい、許容範囲外1', () => {
        const planet1 = new Planet(10)
        const planet2 = new Planet(63)
        expect(planet1.majorAspect(planet2, orb)).toEqual(undefined)
      })
      it('基準値より小さい、許容範囲外2', () => {
        const planet1 = new Planet(63)
        const planet2 = new Planet(10)
        expect(planet1.majorAspect(planet2, orb)).toEqual(undefined)
      })
      it('基準値より大きい、許容範囲内1', () => {
        const planet1 = new Planet(10)
        const planet2 = new Planet(76)
        expect(planet1.majorAspect(planet2, orb)).toEqual('sextile')
      })
      it('基準値より大きい、許容範囲内2', () => {
        const planet1 = new Planet(76)
        const planet2 = new Planet(10)
        expect(planet1.majorAspect(planet2, orb)).toEqual('sextile')
      })
      it('基準値より大きい、許容範囲外1', () => {
        const planet1 = new Planet(10)
        const planet2 = new Planet(77)
        expect(planet1.majorAspect(planet2, orb)).toEqual(undefined)
      })
      it('基準値より大きい、許容範囲外2', () => {
        const planet1 = new Planet(77)
        const planet2 = new Planet(10)
        expect(planet1.majorAspect(planet2, orb)).toEqual(undefined)
      })
    })
    describe('90度：スクエア', () => {
      it('ちょうど基準値1', () => {
        const planet1 = new Planet(10)
        const planet2 = new Planet(100)
        expect(planet1.majorAspect(planet2, orb)).toEqual('square')
      })
      it('ちょうど基準値2', () => {
        const planet1 = new Planet(100)
        const planet2 = new Planet(10)
        expect(planet1.majorAspect(planet2, orb)).toEqual('square')
      })
      it('基準値より小さい、許容範囲内1', () => {
        const planet1 = new Planet(10)
        const planet2 = new Planet(94)
        expect(planet1.majorAspect(planet2, orb)).toEqual('square')
      })
      it('基準値より小さい、許容範囲内2', () => {
        const planet1 = new Planet(94)
        const planet2 = new Planet(10)
        expect(planet1.majorAspect(planet2, orb)).toEqual('square')
      })
      it('基準値より小さい、許容範囲外1', () => {
        const planet1 = new Planet(10)
        const planet2 = new Planet(93)
        expect(planet1.majorAspect(planet2, orb)).toEqual(undefined)
      })
      it('基準値より小さい、許容範囲外2', () => {
        const planet1 = new Planet(93)
        const planet2 = new Planet(10)
        expect(planet1.majorAspect(planet2, orb)).toEqual(undefined)
      })
      it('基準値より大きい、許容範囲内1', () => {
        const planet1 = new Planet(10)
        const planet2 = new Planet(106)
        expect(planet1.majorAspect(planet2, orb)).toEqual('square')
      })
      it('基準値より大きい、許容範囲内2', () => {
        const planet1 = new Planet(106)
        const planet2 = new Planet(10)
        expect(planet1.majorAspect(planet2, orb)).toEqual('square')
      })
      it('基準値より大きい、許容範囲外1', () => {
        const planet1 = new Planet(10)
        const planet2 = new Planet(107)
        expect(planet1.majorAspect(planet2, orb)).toEqual(undefined)
      })
      it('基準値より大きい、許容範囲外2', () => {
        const planet1 = new Planet(107)
        const planet2 = new Planet(10)
        expect(planet1.majorAspect(planet2, orb)).toEqual(undefined)
      })
    })
    describe('120度：トライン', () => {
      it('ちょうど基準値1', () => {
        const planet1 = new Planet(10)
        const planet2 = new Planet(130)
        expect(planet1.majorAspect(planet2, orb)).toEqual('trine')
      })
      it('ちょうど基準値2', () => {
        const planet1 = new Planet(130)
        const planet2 = new Planet(10)
        expect(planet1.majorAspect(planet2, orb)).toEqual('trine')
      })
      it('基準値より小さい、許容範囲内1', () => {
        const planet1 = new Planet(10)
        const planet2 = new Planet(124)
        expect(planet1.majorAspect(planet2, orb)).toEqual('trine')
      })
      it('基準値より小さい、許容範囲内2', () => {
        const planet1 = new Planet(124)
        const planet2 = new Planet(10)
        expect(planet1.majorAspect(planet2, orb)).toEqual('trine')
      })
      it('基準値より小さい、許容範囲外1', () => {
        const planet1 = new Planet(10)
        const planet2 = new Planet(123)
        expect(planet1.majorAspect(planet2, orb)).toEqual(undefined)
      })
      it('基準値より小さい、許容範囲外2', () => {
        const planet1 = new Planet(123)
        const planet2 = new Planet(10)
        expect(planet1.majorAspect(planet2, orb)).toEqual(undefined)
      })
      it('基準値より大きい、許容範囲内1', () => {
        const planet1 = new Planet(10)
        const planet2 = new Planet(136)
        expect(planet1.majorAspect(planet2, orb)).toEqual('trine')
      })
      it('基準値より大きい、許容範囲内2', () => {
        const planet1 = new Planet(136)
        const planet2 = new Planet(10)
        expect(planet1.majorAspect(planet2, orb)).toEqual('trine')
      })
      it('基準値より大きい、許容範囲外1', () => {
        const planet1 = new Planet(10)
        const planet2 = new Planet(137)
        expect(planet1.majorAspect(planet2, orb)).toEqual(undefined)
      })
      it('基準値より大きい、許容範囲外2', () => {
        const planet1 = new Planet(137)
        const planet2 = new Planet(10)
        expect(planet1.majorAspect(planet2, orb)).toEqual(undefined)
      })
    })
    describe('180度：オポジション', () => {
      it('ちょうど基準値1', () => {
        const planet1 = new Planet(10)
        const planet2 = new Planet(190)
        expect(planet1.majorAspect(planet2, orb)).toEqual('opposition')
      })
      it('ちょうど基準値2', () => {
        const planet1 = new Planet(190)
        const planet2 = new Planet(10)
        expect(planet1.majorAspect(planet2, orb)).toEqual('opposition')
      })
      it('基準値より小さい、許容範囲内1', () => {
        const planet1 = new Planet(10)
        const planet2 = new Planet(184)
        expect(planet1.majorAspect(planet2, orb)).toEqual('opposition')
      })
      it('基準値より小さい、許容範囲内2', () => {
        const planet1 = new Planet(184)
        const planet2 = new Planet(10)
        expect(planet1.majorAspect(planet2, orb)).toEqual('opposition')
      })
      it('基準値より小さい、許容範囲外1', () => {
        const planet1 = new Planet(10)
        const planet2 = new Planet(183)
        expect(planet1.majorAspect(planet2, orb)).toEqual(undefined)
      })
      it('基準値より小さい、許容範囲外2', () => {
        const planet1 = new Planet(183)
        const planet2 = new Planet(10)
        expect(planet1.majorAspect(planet2, orb)).toEqual(undefined)
      })
      it('基準値より大きい、許容範囲内1', () => {
        const planet1 = new Planet(10)
        const planet2 = new Planet(196)
        expect(planet1.majorAspect(planet2, orb)).toEqual('opposition')
      })
      it('基準値より大きい、許容範囲内2', () => {
        const planet1 = new Planet(196)
        const planet2 = new Planet(10)
        expect(planet1.majorAspect(planet2, orb)).toEqual('opposition')
      })
      it('基準値より大きい、許容範囲外1', () => {
        const planet1 = new Planet(10)
        const planet2 = new Planet(197)
        expect(planet1.majorAspect(planet2, orb)).toEqual(undefined)
      })
      it('基準値より大きい、許容範囲外2', () => {
        const planet1 = new Planet(197)
        const planet2 = new Planet(10)
        expect(planet1.majorAspect(planet2, orb)).toEqual(undefined)
      })
    })
  })

  describe('マイナーアスペクト', () => {
    const orb = 2
    describe('30度：セミセクスタイル', () => {
      it('ちょうど基準値1', () => {
        const planet1 = new Planet(10)
        const planet2 = new Planet(40)
        expect(planet1.minorAspect(planet2, orb)).toEqual('semi-sextile')
      })
      it('ちょうど基準値2', () => {
        const planet1 = new Planet(40)
        const planet2 = new Planet(10)
        expect(planet1.minorAspect(planet2, orb)).toEqual('semi-sextile')
      })
      it('基準値より小さい、許容範囲内1', () => {
        const planet1 = new Planet(10)
        const planet2 = new Planet(38)
        expect(planet1.minorAspect(planet2, orb)).toEqual('semi-sextile')
      })
      it('基準値より小さい、許容範囲内2', () => {
        const planet1 = new Planet(38)
        const planet2 = new Planet(10)
        expect(planet1.minorAspect(planet2, orb)).toEqual('semi-sextile')
      })
      it('基準値より小さい、許容範囲外1', () => {
        const planet1 = new Planet(10)
        const planet2 = new Planet(37)
        expect(planet1.minorAspect(planet2, orb)).toEqual(undefined)
      })
      it('基準値より小さい、許容範囲外2', () => {
        const planet1 = new Planet(37)
        const planet2 = new Planet(10)
        expect(planet1.minorAspect(planet2, orb)).toEqual(undefined)
      })
      it('基準値より大きい、許容範囲内1', () => {
        const planet1 = new Planet(10)
        const planet2 = new Planet(42)
        expect(planet1.minorAspect(planet2, orb)).toEqual('semi-sextile')
      })
      it('基準値より大きい、許容範囲内2', () => {
        const planet1 = new Planet(42)
        const planet2 = new Planet(10)
        expect(planet1.minorAspect(planet2, orb)).toEqual('semi-sextile')
      })
      it('基準値より大きい、許容範囲外1', () => {
        const planet1 = new Planet(10)
        const planet2 = new Planet(43)
        expect(planet1.minorAspect(planet2, orb)).toEqual(undefined)
      })
      it('基準値より大きい、許容範囲外2', () => {
        const planet1 = new Planet(43)
        const planet2 = new Planet(10)
        expect(planet1.minorAspect(planet2, orb)).toEqual(undefined)
      })
    })
    describe('45度：セミスクエア', () => {
      it('ちょうど基準値1', () => {
        const planet1 = new Planet(10)
        const planet2 = new Planet(55)
        expect(planet1.minorAspect(planet2, orb)).toEqual('semi-square')
      })
      it('ちょうど基準値2', () => {
        const planet1 = new Planet(55)
        const planet2 = new Planet(10)
        expect(planet1.minorAspect(planet2, orb)).toEqual('semi-square')
      })
      it('基準値より小さい、許容範囲内1', () => {
        const planet1 = new Planet(10)
        const planet2 = new Planet(53)
        expect(planet1.minorAspect(planet2, orb)).toEqual('semi-square')
      })
      it('基準値より小さい、許容範囲内2', () => {
        const planet1 = new Planet(53)
        const planet2 = new Planet(10)
        expect(planet1.minorAspect(planet2, orb)).toEqual('semi-square')
      })
      it('基準値より小さい、許容範囲外1', () => {
        const planet1 = new Planet(10)
        const planet2 = new Planet(52)
        expect(planet1.minorAspect(planet2, orb)).toEqual(undefined)
      })
      it('基準値より小さい、許容範囲外2', () => {
        const planet1 = new Planet(52)
        const planet2 = new Planet(10)
        expect(planet1.minorAspect(planet2, orb)).toEqual(undefined)
      })
      it('基準値より大きい、許容範囲内1', () => {
        const planet1 = new Planet(10)
        const planet2 = new Planet(57)
        expect(planet1.minorAspect(planet2, orb)).toEqual('semi-square')
      })
      it('基準値より大きい、許容範囲内2', () => {
        const planet1 = new Planet(57)
        const planet2 = new Planet(10)
        expect(planet1.minorAspect(planet2, orb)).toEqual('semi-square')
      })
      it('基準値より大きい、許容範囲外1', () => {
        const planet1 = new Planet(10)
        const planet2 = new Planet(58)
        expect(planet1.minorAspect(planet2, orb)).toEqual(undefined)
      })
      it('基準値より大きい、許容範囲外2', () => {
        const planet1 = new Planet(58)
        const planet2 = new Planet(10)
        expect(planet1.minorAspect(planet2, orb)).toEqual(undefined)
      })
    })
    describe('72度：クィンタイル', () => {
      it('ちょうど基準値1', () => {
        const planet1 = new Planet(10)
        const planet2 = new Planet(82)
        expect(planet1.minorAspect(planet2, orb)).toEqual('quintile')
      })
      it('ちょうど基準値2', () => {
        const planet1 = new Planet(82)
        const planet2 = new Planet(10)
        expect(planet1.minorAspect(planet2, orb)).toEqual('quintile')
      })
      it('基準値より小さい、許容範囲内1', () => {
        const planet1 = new Planet(10)
        const planet2 = new Planet(80)
        expect(planet1.minorAspect(planet2, orb)).toEqual('quintile')
      })
      it('基準値より小さい、許容範囲内2', () => {
        const planet1 = new Planet(80)
        const planet2 = new Planet(10)
        expect(planet1.minorAspect(planet2, orb)).toEqual('quintile')
      })
      it('基準値より小さい、許容範囲外1', () => {
        const planet1 = new Planet(10)
        const planet2 = new Planet(79)
        expect(planet1.minorAspect(planet2, orb)).toEqual(undefined)
      })
      it('基準値より小さい、許容範囲外2', () => {
        const planet1 = new Planet(79)
        const planet2 = new Planet(10)
        expect(planet1.minorAspect(planet2, orb)).toEqual(undefined)
      })
      it('基準値より大きい、許容範囲内1', () => {
        const planet1 = new Planet(10)
        const planet2 = new Planet(84)
        expect(planet1.minorAspect(planet2, orb)).toEqual('quintile')
      })
      it('基準値より大きい、許容範囲内2', () => {
        const planet1 = new Planet(84)
        const planet2 = new Planet(10)
        expect(planet1.minorAspect(planet2, orb)).toEqual('quintile')
      })
      it('基準値より大きい、許容範囲外1', () => {
        const planet1 = new Planet(10)
        const planet2 = new Planet(85)
        expect(planet1.minorAspect(planet2, orb)).toEqual(undefined)
      })
      it('基準値より大きい、許容範囲外2', () => {
        const planet1 = new Planet(85)
        const planet2 = new Planet(10)
        expect(planet1.minorAspect(planet2, orb)).toEqual(undefined)
      })
    })
    describe('135度：セスキコードレート', () => {
      it('ちょうど基準値1', () => {
        const planet1 = new Planet(10)
        const planet2 = new Planet(145)
        expect(planet1.minorAspect(planet2, orb)).toEqual('sesquiquadrate')
      })
      it('ちょうど基準値2', () => {
        const planet1 = new Planet(145)
        const planet2 = new Planet(10)
        expect(planet1.minorAspect(planet2, orb)).toEqual('sesquiquadrate')
      })
      it('基準値より小さい、許容範囲内1', () => {
        const planet1 = new Planet(10)
        const planet2 = new Planet(143)
        expect(planet1.minorAspect(planet2, orb)).toEqual('sesquiquadrate')
      })
      it('基準値より小さい、許容範囲内2', () => {
        const planet1 = new Planet(143)
        const planet2 = new Planet(10)
        expect(planet1.minorAspect(planet2, orb)).toEqual('sesquiquadrate')
      })
      it('基準値より小さい、許容範囲外1', () => {
        const planet1 = new Planet(10)
        const planet2 = new Planet(142)
        expect(planet1.minorAspect(planet2, orb)).toEqual(undefined)
      })
      it('基準値より小さい、許容範囲外2', () => {
        const planet1 = new Planet(142)
        const planet2 = new Planet(10)
        expect(planet1.minorAspect(planet2, orb)).toEqual(undefined)
      })
      it('基準値より大きい、許容範囲内1', () => {
        const planet1 = new Planet(10)
        const planet2 = new Planet(147)
        expect(planet1.minorAspect(planet2, orb)).toEqual('sesquiquadrate')
      })
      it('基準値より大きい、許容範囲内2', () => {
        const planet1 = new Planet(147)
        const planet2 = new Planet(10)
        expect(planet1.minorAspect(planet2, orb)).toEqual('sesquiquadrate')
      })
      it('基準値より大きい、許容範囲外1', () => {
        const planet1 = new Planet(10)
        const planet2 = new Planet(148)
        expect(planet1.minorAspect(planet2, orb)).toEqual(undefined)
      })
      it('基準値より大きい、許容範囲外2', () => {
        const planet1 = new Planet(148)
        const planet2 = new Planet(10)
        expect(planet1.minorAspect(planet2, orb)).toEqual(undefined)
      })
    })
    describe('144度：バイクインタイル', () => {
      it('ちょうど基準値1', () => {
        const planet1 = new Planet(10)
        const planet2 = new Planet(154)
        expect(planet1.minorAspect(planet2, orb)).toEqual('biquintile')
      })
      it('ちょうど基準値2', () => {
        const planet1 = new Planet(154)
        const planet2 = new Planet(10)
        expect(planet1.minorAspect(planet2, orb)).toEqual('biquintile')
      })
      it('基準値より小さい、許容範囲内1', () => {
        const planet1 = new Planet(10)
        const planet2 = new Planet(152)
        expect(planet1.minorAspect(planet2, orb)).toEqual('biquintile')
      })
      it('基準値より小さい、許容範囲内2', () => {
        const planet1 = new Planet(152)
        const planet2 = new Planet(10)
        expect(planet1.minorAspect(planet2, orb)).toEqual('biquintile')
      })
      it('基準値より小さい、許容範囲外1', () => {
        const planet1 = new Planet(10)
        const planet2 = new Planet(151)
        expect(planet1.minorAspect(planet2, orb)).toEqual(undefined)
      })
      it('基準値より小さい、許容範囲外2', () => {
        const planet1 = new Planet(151)
        const planet2 = new Planet(10)
        expect(planet1.minorAspect(planet2, orb)).toEqual(undefined)
      })
      it('基準値より大きい、許容範囲内1', () => {
        const planet1 = new Planet(10)
        const planet2 = new Planet(156)
        expect(planet1.minorAspect(planet2, orb)).toEqual('biquintile')
      })
      it('基準値より大きい、許容範囲内2', () => {
        const planet1 = new Planet(156)
        const planet2 = new Planet(10)
        expect(planet1.minorAspect(planet2, orb)).toEqual('biquintile')
      })
      it('基準値より大きい、許容範囲外1', () => {
        const planet1 = new Planet(10)
        const planet2 = new Planet(157)
        expect(planet1.minorAspect(planet2, orb)).toEqual(undefined)
      })
      it('基準値より大きい、許容範囲外2', () => {
        const planet1 = new Planet(157)
        const planet2 = new Planet(10)
        expect(planet1.minorAspect(planet2, orb)).toEqual(undefined)
      })
    })
    describe('150度：クインカンクス', () => {
      it('ちょうど基準値1', () => {
        const planet1 = new Planet(10)
        const sign150 = new Planet(160)
        expect(planet1.minorAspect(sign150, orb)).toEqual('quincunx')
      })
      it('ちょうど基準値2', () => {
        const planet1 = new Planet(160)
        const sign150 = new Planet(10)
        expect(planet1.minorAspect(sign150, orb)).toEqual('quincunx')
      })
      it('基準値より小さい、許容範囲内1', () => {
        const planet1 = new Planet(10)
        const planet2 = new Planet(158)
        expect(planet1.minorAspect(planet2, orb)).toEqual('quincunx')
      })
      it('基準値より小さい、許容範囲内2', () => {
        const planet1 = new Planet(158)
        const planet2 = new Planet(10)
        expect(planet1.minorAspect(planet2, orb)).toEqual('quincunx')
      })
      it('基準値より小さい、許容範囲外1', () => {
        const planet1 = new Planet(10)
        const planet2 = new Planet(157)
        expect(planet1.minorAspect(planet2, orb)).toEqual(undefined)
      })
      it('基準値より小さい、許容範囲外2', () => {
        const planet1 = new Planet(157)
        const planet2 = new Planet(10)
        expect(planet1.minorAspect(planet2, orb)).toEqual(undefined)
      })
      it('基準値より大きい、許容範囲内1', () => {
        const planet1 = new Planet(10)
        const planet2 = new Planet(162)
        expect(planet1.minorAspect(planet2, orb)).toEqual('quincunx')
      })
      it('基準値より大きい、許容範囲内2', () => {
        const planet1 = new Planet(162)
        const planet2 = new Planet(10)
        expect(planet1.minorAspect(planet2, orb)).toEqual('quincunx')
      })
      it('基準値より大きい、許容範囲外1', () => {
        const planet1 = new Planet(10)
        const planet2 = new Planet(163)
        expect(planet1.minorAspect(planet2, orb)).toEqual(undefined)
      })
      it('基準値より大きい、許容範囲外2', () => {
        const planet1 = new Planet(163)
        const planet2 = new Planet(10)
        expect(planet1.minorAspect(planet2, orb)).toEqual(undefined)
      })
    })
  })
})
