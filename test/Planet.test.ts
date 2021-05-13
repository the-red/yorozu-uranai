import { Planet } from '../src/Planet'

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
      it('ちょうど0', () => {
        const planet1 = new Planet(10)
        const planet2 = new Planet(10)
        expect(planet1.majorAspect(planet2, orb)).toEqual('conjunction')
      })
      it('0より小さい、許容範囲内', () => {
        const planet1 = new Planet(10)
        const planet2 = new Planet(4)
        expect(planet1.majorAspect(planet2, orb)).toEqual('conjunction')
      })
      it('0より小さい、許容範囲外', () => {
        const planet1 = new Planet(10)
        const planet2 = new Planet(3)
        expect(planet1.majorAspect(planet2, orb)).toEqual(undefined)
      })
      it('0より大きい、許容範囲内', () => {
        const planet1 = new Planet(10)
        const planet2 = new Planet(16)
        expect(planet1.majorAspect(planet2, orb)).toEqual('conjunction')
      })
      it('0より大きい、許容範囲外', () => {
        const planet1 = new Planet(10)
        const planet2 = new Planet(17)
        expect(planet1.majorAspect(planet2, orb)).toEqual(undefined)
      })
    })
    describe('60度：セクスタイル', () => {
      it('ちょうど60', () => {
        const planet1 = new Planet(0)
        const planet2 = new Planet(60)
        expect(planet1.majorAspect(planet2, orb)).toEqual('sextile')
      })
      it('60より小さい、許容範囲内', () => {
        const planet1 = new Planet(0)
        const planet2 = new Planet(54)
        expect(planet1.majorAspect(planet2, orb)).toEqual('sextile')
      })
      it('60より小さい、許容範囲外', () => {
        const planet1 = new Planet(0)
        const planet2 = new Planet(53)
        expect(planet1.majorAspect(planet2, orb)).toEqual(undefined)
      })
      it('60より大きい、許容範囲内', () => {
        const planet1 = new Planet(0)
        const planet2 = new Planet(66)
        expect(planet1.majorAspect(planet2, orb)).toEqual('sextile')
      })
      it('60より大きい、許容範囲外', () => {
        const planet1 = new Planet(0)
        const planet2 = new Planet(67)
        expect(planet1.majorAspect(planet2, orb)).toEqual(undefined)
      })
    })
    describe('90度：スクエア', () => {
      it('ちょうど90', () => {
        const planet1 = new Planet(0)
        const planet2 = new Planet(90)
        expect(planet1.majorAspect(planet2, orb)).toEqual('square')
      })
      it('90より小さい、許容範囲内', () => {
        const planet1 = new Planet(0)
        const planet2 = new Planet(84)
        expect(planet1.majorAspect(planet2, orb)).toEqual('square')
      })
      it('90より小さい、許容範囲外', () => {
        const planet1 = new Planet(0)
        const planet2 = new Planet(83)
        expect(planet1.majorAspect(planet2, orb)).toEqual(undefined)
      })
      it('90より大きい、許容範囲内', () => {
        const planet1 = new Planet(0)
        const planet2 = new Planet(96)
        expect(planet1.majorAspect(planet2, orb)).toEqual('square')
      })
      it('90より大きい、許容範囲外', () => {
        const planet1 = new Planet(0)
        const planet2 = new Planet(97)
        expect(planet1.majorAspect(planet2, orb)).toEqual(undefined)
      })
    })
    describe('120度：トライン', () => {
      it('ちょうど120', () => {
        const planet1 = new Planet(0)
        const planet2 = new Planet(120)
        expect(planet1.majorAspect(planet2, orb)).toEqual('trine')
      })
      it('120より小さい、許容範囲内', () => {
        const planet1 = new Planet(0)
        const planet2 = new Planet(114)
        expect(planet1.majorAspect(planet2, orb)).toEqual('trine')
      })
      it('120より小さい、許容範囲外', () => {
        const planet1 = new Planet(0)
        const planet2 = new Planet(113)
        expect(planet1.majorAspect(planet2, orb)).toEqual(undefined)
      })
      it('120より大きい、許容範囲内', () => {
        const planet1 = new Planet(0)
        const planet2 = new Planet(126)
        expect(planet1.majorAspect(planet2, orb)).toEqual('trine')
      })
      it('120より大きい、許容範囲外', () => {
        const planet1 = new Planet(0)
        const planet2 = new Planet(127)
        expect(planet1.majorAspect(planet2, orb)).toEqual(undefined)
      })
    })
    describe('180度：オポジション', () => {
      it('ちょうど180', () => {
        const planet1 = new Planet(0)
        const planet2 = new Planet(180)
        expect(planet1.majorAspect(planet2, orb)).toEqual('opposition')
      })
      it('180より小さい、許容範囲内', () => {
        const planet1 = new Planet(0)
        const planet2 = new Planet(174)
        expect(planet1.majorAspect(planet2, orb)).toEqual('opposition')
      })
      it('180より小さい、許容範囲外', () => {
        const planet1 = new Planet(0)
        const planet2 = new Planet(173)
        expect(planet1.majorAspect(planet2, orb)).toEqual(undefined)
      })
      it('180より大きい、許容範囲内', () => {
        const planet1 = new Planet(0)
        const planet2 = new Planet(186)
        expect(planet1.majorAspect(planet2, orb)).toEqual('opposition')
      })
      it('180より大きい、許容範囲外', () => {
        const planet1 = new Planet(0)
        const planet2 = new Planet(187)
        expect(planet1.majorAspect(planet2, orb)).toEqual(undefined)
      })
    })
  })

  describe('マイナーアスペクト', () => {
    const orb = 2
    describe('30度：セミセクスタイル', () => {
      it('ちょうど30', () => {
        const planet1 = new Planet(0)
        const planet2 = new Planet(30)
        expect(planet1.minorAspect(planet2, orb)).toEqual('semi-sextile')
      })
      it('135より小さい、許容範囲内', () => {
        const planet1 = new Planet(0)
        const planet2 = new Planet(28)
        expect(planet1.minorAspect(planet2, orb)).toEqual('semi-sextile')
      })
      it('135より小さい、許容範囲外', () => {
        const planet1 = new Planet(0)
        const planet2 = new Planet(27)
        expect(planet1.minorAspect(planet2, orb)).toEqual(null)
      })
      it('135より大きい、許容範囲内', () => {
        const planet1 = new Planet(0)
        const planet2 = new Planet(32)
        expect(planet1.minorAspect(planet2, orb)).toEqual('semi-sextile')
      })
      it('30より大きい、許容範囲外', () => {
        const planet1 = new Planet(0)
        const planet2 = new Planet(33)
        expect(planet1.minorAspect(planet2, orb)).toEqual(null)
      })
    })
    describe('45度：セミスクエア', () => {
      it('ちょうど45', () => {
        const planet1 = new Planet(0)
        const planet2 = new Planet(45)
        expect(planet1.minorAspect(planet2, orb)).toEqual('semi-square')
      })
      it('45より小さい、許容範囲内', () => {
        const planet1 = new Planet(0)
        const planet2 = new Planet(43)
        expect(planet1.minorAspect(planet2, orb)).toEqual('semi-square')
      })
      it('45より小さい、許容範囲外', () => {
        const planet1 = new Planet(0)
        const planet2 = new Planet(42)
        expect(planet1.minorAspect(planet2, orb)).toEqual(null)
      })
      it('45より大きい、許容範囲内', () => {
        const planet1 = new Planet(0)
        const planet2 = new Planet(47)
        expect(planet1.minorAspect(planet2, orb)).toEqual('semi-square')
      })
      it('45より大きい、許容範囲外', () => {
        const planet1 = new Planet(0)
        const planet2 = new Planet(48)
        expect(planet1.minorAspect(planet2, orb)).toEqual(null)
      })
    })
    describe('72度：クィンタイル', () => {
      it('ちょうど72', () => {
        const planet1 = new Planet(0)
        const planet2 = new Planet(72)
        expect(planet1.minorAspect(planet2, orb)).toEqual('quintile')
      })
      it('72より小さい、許容範囲内', () => {
        const planet1 = new Planet(0)
        const planet2 = new Planet(70)
        expect(planet1.minorAspect(planet2, orb)).toEqual('quintile')
      })
      it('72より小さい、許容範囲外', () => {
        const planet1 = new Planet(0)
        const planet2 = new Planet(69)
        expect(planet1.minorAspect(planet2, orb)).toEqual(null)
      })
      it('72より大きい、許容範囲内', () => {
        const planet1 = new Planet(0)
        const planet2 = new Planet(74)
        expect(planet1.minorAspect(planet2, orb)).toEqual('quintile')
      })
      it('72より大きい、許容範囲外', () => {
        const planet1 = new Planet(0)
        const planet2 = new Planet(75)
        expect(planet1.minorAspect(planet2, orb)).toEqual(null)
      })
    })
    describe('135度：セスキコードレート', () => {
      it('ちょうど135', () => {
        const planet1 = new Planet(0)
        const planet2 = new Planet(135)
        expect(planet1.minorAspect(planet2, orb)).toEqual('sesquiquadrate')
      })
      it('135より小さい、許容範囲内', () => {
        const planet1 = new Planet(0)
        const planet2 = new Planet(133)
        expect(planet1.minorAspect(planet2, orb)).toEqual('sesquiquadrate')
      })
      it('135より小さい、許容範囲外', () => {
        const planet1 = new Planet(132)
        const planet2 = new Planet(27)
        expect(planet1.minorAspect(planet2, orb)).toEqual(null)
      })
      it('135より大きい、許容範囲内', () => {
        const planet1 = new Planet(0)
        const planet2 = new Planet(137)
        expect(planet1.minorAspect(planet2, orb)).toEqual('sesquiquadrate')
      })
      it('135より大きい、許容範囲外', () => {
        const planet1 = new Planet(0)
        const planet2 = new Planet(138)
        expect(planet1.minorAspect(planet2, orb)).toEqual(null)
      })
    })
    describe('144度：バイクインタイル', () => {
      it('ちょうど144', () => {
        const planet1 = new Planet(0)
        const planet2 = new Planet(144)
        expect(planet1.minorAspect(planet2, orb)).toEqual('biquintile')
      })
      it('144より小さい、許容範囲内', () => {
        const planet1 = new Planet(0)
        const planet2 = new Planet(142)
        expect(planet1.minorAspect(planet2, orb)).toEqual('biquintile')
      })
      it('144より小さい、許容範囲外', () => {
        const planet1 = new Planet(0)
        const planet2 = new Planet(141)
        expect(planet1.minorAspect(planet2, orb)).toEqual(null)
      })
      it('144より大きい、許容範囲内', () => {
        const planet1 = new Planet(0)
        const planet2 = new Planet(146)
        expect(planet1.minorAspect(planet2, orb)).toEqual('biquintile')
      })
      it('144より大きい、許容範囲外', () => {
        const planet1 = new Planet(0)
        const planet2 = new Planet(147)
        expect(planet1.minorAspect(planet2, orb)).toEqual(null)
      })
    })
    describe('150度：クインカンクス', () => {
      it('ちょうど150', () => {
        const planet1 = new Planet(0)
        const sign150 = new Planet(150)
        expect(planet1.minorAspect(sign150, orb)).toEqual('quincunx')
      })
      it('150より小さい、許容範囲内', () => {
        const planet1 = new Planet(0)
        const planet2 = new Planet(148)
        expect(planet1.minorAspect(planet2, orb)).toEqual('quincunx')
      })
      it('150より小さい、許容範囲外', () => {
        const planet1 = new Planet(0)
        const planet2 = new Planet(147)
        expect(planet1.minorAspect(planet2, orb)).toEqual(null)
      })
      it('150より大きい、許容範囲内', () => {
        const planet1 = new Planet(0)
        const planet2 = new Planet(152)
        expect(planet1.minorAspect(planet2, orb)).toEqual('quincunx')
      })
      it('150より大きい、許容範囲外', () => {
        const planet1 = new Planet(0)
        const planet2 = new Planet(153)
        expect(planet1.minorAspect(planet2, orb)).toEqual(null)
      })
    })
  })
})
