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
      expect(planet.fullDegrees).toEqual(61.89)
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
        const sign10 = new Planet(10)
        const sign10_2 = new Planet(10)
        expect(sign10.majorAspect(sign10_2, orb)).toEqual('conjunction')
      })
      it('0より小さい、許容範囲内', () => {
        const sign10 = new Planet(10)
        const sign4 = new Planet(4)
        expect(sign10.majorAspect(sign4, orb)).toEqual('conjunction')
      })
      it('0より小さい、許容範囲外', () => {
        const sign10 = new Planet(10)
        const sign3 = new Planet(3)
        expect(sign10.majorAspect(sign3, orb)).toEqual(null)
      })
      it('0より大きい、許容範囲内', () => {
        const sign10 = new Planet(10)
        const sign16 = new Planet(16)
        expect(sign10.majorAspect(sign16, orb)).toEqual('conjunction')
      })
      it('0より大きい、許容範囲外', () => {
        const sign10 = new Planet(10)
        const sign17 = new Planet(17)
        expect(sign10.majorAspect(sign17, orb)).toEqual(null)
      })
    })
    describe('60度：セクスタイル', () => {
      it('ちょうど60', () => {
        const sign0 = new Planet(0)
        const sign60 = new Planet(60)
        expect(sign0.majorAspect(sign60, orb)).toEqual('sextile')
      })
      it('60より小さい、許容範囲内', () => {
        const sign0 = new Planet(0)
        const sign54 = new Planet(54)
        expect(sign0.majorAspect(sign54, orb)).toEqual('sextile')
      })
      it('60より小さい、許容範囲外', () => {
        const sign0 = new Planet(0)
        const sign53 = new Planet(53)
        expect(sign0.majorAspect(sign53, orb)).toEqual(null)
      })
      it('60より大きい、許容範囲内', () => {
        const sign0 = new Planet(0)
        const sign66 = new Planet(66)
        expect(sign0.majorAspect(sign66, orb)).toEqual('sextile')
      })
      it('60より大きい、許容範囲外', () => {
        const sign0 = new Planet(0)
        const sign67 = new Planet(67)
        expect(sign0.majorAspect(sign67, orb)).toEqual(null)
      })
    })
    describe('90度：スクエア', () => {
      it('ちょうど90', () => {
        const sign0 = new Planet(0)
        const sign90 = new Planet(90)
        expect(sign0.majorAspect(sign90, orb)).toEqual('square')
      })
      it('90より小さい、許容範囲内', () => {
        const sign0 = new Planet(0)
        const sign84 = new Planet(84)
        expect(sign0.majorAspect(sign84, orb)).toEqual('square')
      })
      it('90より小さい、許容範囲外', () => {
        const sign0 = new Planet(0)
        const sign83 = new Planet(83)
        expect(sign0.majorAspect(sign83, orb)).toEqual(null)
      })
      it('90より大きい、許容範囲内', () => {
        const sign0 = new Planet(0)
        const sign96 = new Planet(96)
        expect(sign0.majorAspect(sign96, orb)).toEqual('square')
      })
      it('90より大きい、許容範囲外', () => {
        const sign0 = new Planet(0)
        const sign97 = new Planet(97)
        expect(sign0.majorAspect(sign97, orb)).toEqual(null)
      })
    })
    describe('120度：トライン', () => {
      it('ちょうど120', () => {
        const sign0 = new Planet(0)
        const sign120 = new Planet(120)
        expect(sign0.majorAspect(sign120, orb)).toEqual('trine')
      })
      it('120より小さい、許容範囲内', () => {
        const sign0 = new Planet(0)
        const sign114 = new Planet(114)
        expect(sign0.majorAspect(sign114, orb)).toEqual('trine')
      })
      it('120より小さい、許容範囲外', () => {
        const sign0 = new Planet(0)
        const sign113 = new Planet(113)
        expect(sign0.majorAspect(sign113, orb)).toEqual(null)
      })
      it('120より大きい、許容範囲内', () => {
        const sign0 = new Planet(0)
        const sign126 = new Planet(126)
        expect(sign0.majorAspect(sign126, orb)).toEqual('trine')
      })
      it('120より大きい、許容範囲外', () => {
        const sign0 = new Planet(0)
        const sign127 = new Planet(127)
        expect(sign0.majorAspect(sign127, orb)).toEqual(null)
      })
    })
    describe('180度：オポジション', () => {
      it('ちょうど180', () => {
        const sign0 = new Planet(0)
        const sign180 = new Planet(180)
        expect(sign0.majorAspect(sign180, orb)).toEqual('opposition')
      })
      it('180より小さい、許容範囲内', () => {
        const sign0 = new Planet(0)
        const sign174 = new Planet(174)
        expect(sign0.majorAspect(sign174, orb)).toEqual('opposition')
      })
      it('180より小さい、許容範囲外', () => {
        const sign0 = new Planet(0)
        const sign173 = new Planet(173)
        expect(sign0.majorAspect(sign173, orb)).toEqual(null)
      })
      it('180より大きい、許容範囲内', () => {
        const sign0 = new Planet(0)
        const sign186 = new Planet(186)
        expect(sign0.majorAspect(sign186, orb)).toEqual('opposition')
      })
      it('180より大きい、許容範囲外', () => {
        const sign0 = new Planet(0)
        const sign187 = new Planet(187)
        expect(sign0.majorAspect(sign187, orb)).toEqual(null)
      })
    })
  })

  describe('マイナーアスペクト', () => {
    const orb = 2
    describe('30度：セミセクスタイル', () => {
      it('ちょうど30', () => {
        const sign0 = new Planet(0)
        const sign30 = new Planet(30)
        expect(sign0.minorAspect(sign30, orb)).toEqual('semi-sextile')
      })
      it('135より小さい、許容範囲内', () => {
        const sign0 = new Planet(0)
        const sign28 = new Planet(28)
        expect(sign0.minorAspect(sign28, orb)).toEqual('semi-sextile')
      })
      it('135より小さい、許容範囲外', () => {
        const sign0 = new Planet(0)
        const sign27 = new Planet(27)
        expect(sign0.minorAspect(sign27, orb)).toEqual(null)
      })
      it('135より大きい、許容範囲内', () => {
        const sign0 = new Planet(0)
        const sign32 = new Planet(32)
        expect(sign0.minorAspect(sign32, orb)).toEqual('semi-sextile')
      })
      it('30より大きい、許容範囲外', () => {
        const sign0 = new Planet(0)
        const sign33 = new Planet(33)
        expect(sign0.minorAspect(sign33, orb)).toEqual(null)
      })
    })
    describe('45度：セミスクエア', () => {
      it('ちょうど45', () => {
        const sign0 = new Planet(0)
        const sign45 = new Planet(45)
        expect(sign0.minorAspect(sign45, orb)).toEqual('semi-square')
      })
      it('45より小さい、許容範囲内', () => {
        const sign0 = new Planet(0)
        const sign43 = new Planet(43)
        expect(sign0.minorAspect(sign43, orb)).toEqual('semi-square')
      })
      it('45より小さい、許容範囲外', () => {
        const sign0 = new Planet(0)
        const sign42 = new Planet(42)
        expect(sign0.minorAspect(sign42, orb)).toEqual(null)
      })
      it('45より大きい、許容範囲内', () => {
        const sign0 = new Planet(0)
        const sign47 = new Planet(47)
        expect(sign0.minorAspect(sign47, orb)).toEqual('semi-square')
      })
      it('45より大きい、許容範囲外', () => {
        const sign0 = new Planet(0)
        const sign48 = new Planet(48)
        expect(sign0.minorAspect(sign48, orb)).toEqual(null)
      })
    })
    describe('72度：クィンタイル', () => {
      it('ちょうど72', () => {
        const sign0 = new Planet(0)
        const sign72 = new Planet(72)
        expect(sign0.minorAspect(sign72, orb)).toEqual('quintile')
      })
      it('72より小さい、許容範囲内', () => {
        const sign0 = new Planet(0)
        const sign70 = new Planet(70)
        expect(sign0.minorAspect(sign70, orb)).toEqual('quintile')
      })
      it('72より小さい、許容範囲外', () => {
        const sign0 = new Planet(0)
        const sign69 = new Planet(69)
        expect(sign0.minorAspect(sign69, orb)).toEqual(null)
      })
      it('72より大きい、許容範囲内', () => {
        const sign0 = new Planet(0)
        const sign74 = new Planet(74)
        expect(sign0.minorAspect(sign74, orb)).toEqual('quintile')
      })
      it('72より大きい、許容範囲外', () => {
        const sign0 = new Planet(0)
        const sign75 = new Planet(75)
        expect(sign0.minorAspect(sign75, orb)).toEqual(null)
      })
    })
    describe('135度：セスキコードレート', () => {
      it('ちょうど135', () => {
        const sign0 = new Planet(0)
        const sign135 = new Planet(135)
        expect(sign0.minorAspect(sign135, orb)).toEqual('sesquiquadrate')
      })
      it('135より小さい、許容範囲内', () => {
        const sign0 = new Planet(0)
        const sign133 = new Planet(133)
        expect(sign0.minorAspect(sign133, orb)).toEqual('sesquiquadrate')
      })
      it('135より小さい、許容範囲外', () => {
        const sign0 = new Planet(132)
        const sign132 = new Planet(27)
        expect(sign0.minorAspect(sign132, orb)).toEqual(null)
      })
      it('135より大きい、許容範囲内', () => {
        const sign0 = new Planet(0)
        const sign137 = new Planet(137)
        expect(sign0.minorAspect(sign137, orb)).toEqual('sesquiquadrate')
      })
      it('135より大きい、許容範囲外', () => {
        const sign0 = new Planet(0)
        const sign138 = new Planet(138)
        expect(sign0.minorAspect(sign138, orb)).toEqual(null)
      })
    })
    describe('144度：バイクインタイル', () => {
      it('ちょうど144', () => {
        const sign0 = new Planet(0)
        const sign144 = new Planet(144)
        expect(sign0.minorAspect(sign144, orb)).toEqual('biquintile')
      })
      it('144より小さい、許容範囲内', () => {
        const sign0 = new Planet(0)
        const sign142 = new Planet(142)
        expect(sign0.minorAspect(sign142, orb)).toEqual('biquintile')
      })
      it('144より小さい、許容範囲外', () => {
        const sign0 = new Planet(0)
        const sign141 = new Planet(141)
        expect(sign0.minorAspect(sign141, orb)).toEqual(null)
      })
      it('144より大きい、許容範囲内', () => {
        const sign0 = new Planet(0)
        const sign146 = new Planet(146)
        expect(sign0.minorAspect(sign146, orb)).toEqual('biquintile')
      })
      it('144より大きい、許容範囲外', () => {
        const sign0 = new Planet(0)
        const sign147 = new Planet(147)
        expect(sign0.minorAspect(sign147, orb)).toEqual(null)
      })
    })
    describe('150度：クインカンクス', () => {
      it('ちょうど150', () => {
        const sign0 = new Planet(0)
        const sign150 = new Planet(150)
        expect(sign0.minorAspect(sign150, orb)).toEqual('quincunx')
      })
      it('150より小さい、許容範囲内', () => {
        const sign0 = new Planet(0)
        const sign148 = new Planet(148)
        expect(sign0.minorAspect(sign148, orb)).toEqual('quincunx')
      })
      it('150より小さい、許容範囲外', () => {
        const sign0 = new Planet(0)
        const sign147 = new Planet(147)
        expect(sign0.minorAspect(sign147, orb)).toEqual(null)
      })
      it('150より大きい、許容範囲内', () => {
        const sign0 = new Planet(0)
        const sign152 = new Planet(152)
        expect(sign0.minorAspect(sign152, orb)).toEqual('quincunx')
      })
      it('150より大きい、許容範囲外', () => {
        const sign0 = new Planet(0)
        const sign153 = new Planet(153)
        expect(sign0.minorAspect(sign153, orb)).toEqual(null)
      })
    })
  })
})
