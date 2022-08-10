import { Planet } from '../../src/horoscope/Planet'
import { House } from '../../src/horoscope/House'
import { Position } from '../../src/horoscope/Position'

describe('Planet', () => {
  const house = new House({
    house: [0, 30, 60, 90, 120, 150, 180, 210, 240, 270, 300, 330],
    ascendant: 0,
    mc: 0,
    armc: 0,
    vertex: 0,
    equatorialAscendant: 0,
    kochCoAscendant: 0,
    munkaseyCoAscendant: 0,
    munkaseyPolarAscendant: 0,
  })

  describe('星座と角度', () => {
    const orb = 1
    it('0.0: 魚座', () => {
      const planet = new Planet(new Position(0), 'sun', false, house)
      expect(planet.sign).toEqual('魚座')
    })
    it('0.5: 牡羊座', () => {
      const planet = new Planet(new Position(0.5), 'sun', false, house)
      expect(planet.sign).toEqual('牡羊座')
      expect(planet.position.degrees).toEqual(0.5)
    })
    it('60.0: 牡牛座', () => {
      const planet = new Planet(new Position(60), 'sun', false, house)
      expect(planet.sign).toEqual('牡牛座')
      expect(planet.position.degrees).toEqual(0)
    })
    it('61.89: 双子座', () => {
      const planet = new Planet(new Position(61.89), 'sun', false, house)
      expect(planet.longitude).toEqual(61.89)
      expect(planet.sign).toEqual('双子座')
      expect(planet.position.degrees).toEqual(1.8900000000000006)
    })
    it('120.0: 蟹座', () => {
      const planet = new Planet(new Position(120), 'sun', false, house)
      expect(planet.sign).toEqual('蟹座')
    })
    it('150.0: 獅子座', () => {
      const planet = new Planet(new Position(150), 'sun', false, house)
      expect(planet.sign).toEqual('獅子座')
    })
    it('180.0: 乙女座', () => {
      const planet = new Planet(new Position(180), 'sun', false, house)
      expect(planet.sign).toEqual('乙女座')
    })
    it('210.0: 天秤座', () => {
      const planet = new Planet(new Position(210), 'sun', false, house)
      expect(planet.sign).toEqual('天秤座')
    })
    it('240.0: 蠍座', () => {
      const planet = new Planet(new Position(240), 'sun', false, house)
      expect(planet.sign).toEqual('蠍座')
    })
    it('270.0: 射手座', () => {
      const planet = new Planet(new Position(270), 'sun', false, house)
      expect(planet.sign).toEqual('射手座')
    })
    it('300.0: 山羊座', () => {
      const planet = new Planet(new Position(300), 'sun', false, house)
      expect(planet.sign).toEqual('山羊座')
    })
    it('330.0: 水瓶座', () => {
      const planet = new Planet(new Position(330), 'sun', false, house)
      expect(planet.sign).toEqual('水瓶座')
    })
    it('360.0: 魚座', () => {
      const planet = new Planet(new Position(360), 'sun', false, house)
      expect(planet.sign).toEqual('魚座')
      expect(planet.position.degrees).toEqual(0)
    })
    it('360.5: 牡羊座', () => {
      const planet = new Planet(new Position(360.5), 'sun', false, house)
      expect(planet.sign).toEqual('牡羊座')
      expect(planet.position.degrees).toEqual(0.5)
    })
    it('3600270.0: 射手座', () => {
      const planet = new Planet(new Position(3600270), 'sun', false, house)
      expect(planet.sign).toEqual('射手座')
      expect(planet.position.degrees).toEqual(0)
    })
  })

  describe('Element', () => {
    it('牡羊座：火', () => {
      const planet = new Planet(new Position(0.5), 'sun', false, house) // 牡羊座
      expect(planet.element).toEqual('fire')
    })
    it('牡牛座：地', () => {
      const planet = new Planet(new Position(30.5), 'sun', false, house) // 牡牛座
      expect(planet.element).toEqual('earth')
    })
    it('双子座：風', () => {
      const planet = new Planet(new Position(60.5), 'sun', false, house) // 双子座
      expect(planet.element).toEqual('air')
    })
    it('蟹座：水', () => {
      const planet = new Planet(new Position(90.5), 'sun', false, house) // 蟹座
      expect(planet.element).toEqual('water')
    })
    it('獅子座：火', () => {
      const planet = new Planet(new Position(120.5), 'sun', false, house) // 獅子座
      expect(planet.element).toEqual('fire')
    })
    it('乙女座：地', () => {
      const planet = new Planet(new Position(150.5), 'sun', false, house) // 乙女座
      expect(planet.element).toEqual('earth')
    })
    it('天秤座：風', () => {
      const planet = new Planet(new Position(180.5), 'sun', false, house) // 天秤座
      expect(planet.element).toEqual('air')
    })
    it('蠍座：水', () => {
      const planet = new Planet(new Position(210.5), 'sun', false, house) // 蠍座
      expect(planet.element).toEqual('water')
    })
    it('射手座：火', () => {
      const planet = new Planet(new Position(240.5), 'sun', false, house) // 射手座
      expect(planet.element).toEqual('fire')
    })
    it('山羊座：地', () => {
      const planet = new Planet(new Position(270.5), 'sun', false, house) // 山羊座
      expect(planet.element).toEqual('earth')
    })
    it('水瓶座：風', () => {
      const planet = new Planet(new Position(300.5), 'sun', false, house) // 水瓶座
      expect(planet.element).toEqual('air')
    })
    it('魚座：水', () => {
      const planet = new Planet(new Position(330.5), 'sun', false, house) // 魚座
      expect(planet.element).toEqual('water')
    })
  })

  describe('Quality', () => {
    it('牡羊座：活動宮', () => {
      const planet = new Planet(new Position(0.5), 'sun', false, house) // 牡羊座
      expect(planet.quality).toEqual('cardinal')
    })
    it('牡牛座：不動宮', () => {
      const planet = new Planet(new Position(30.5), 'sun', false, house) // 牡牛座
      expect(planet.quality).toEqual('fixed')
    })
    it('双子座：柔軟宮', () => {
      const planet = new Planet(new Position(60.5), 'sun', false, house) // 双子座
      expect(planet.quality).toEqual('mutable')
    })
    it('蟹座：活動宮', () => {
      const planet = new Planet(new Position(90.5), 'sun', false, house) // 蟹座
      expect(planet.quality).toEqual('cardinal')
    })
    it('獅子座：不動宮', () => {
      const planet = new Planet(new Position(120.5), 'sun', false, house) // 獅子座
      expect(planet.quality).toEqual('fixed')
    })
    it('乙女座：柔軟宮', () => {
      const planet = new Planet(new Position(150.5), 'sun', false, house) // 乙女座
      expect(planet.quality).toEqual('mutable')
    })
    it('天秤座：活動宮', () => {
      const planet = new Planet(new Position(180.5), 'sun', false, house) // 天秤座
      expect(planet.quality).toEqual('cardinal')
    })
    it('蠍座：不動宮', () => {
      const planet = new Planet(new Position(210.5), 'sun', false, house) // 蠍座
      expect(planet.quality).toEqual('fixed')
    })
    it('射手座：柔軟宮', () => {
      const planet = new Planet(new Position(240.5), 'sun', false, house) // 射手座
      expect(planet.quality).toEqual('mutable')
    })
    it('山羊座：活動宮', () => {
      const planet = new Planet(new Position(270.5), 'sun', false, house) // 山羊座
      expect(planet.quality).toEqual('cardinal')
    })
    it('水瓶座：不動宮', () => {
      const planet = new Planet(new Position(300.5), 'sun', false, house) // 水瓶座
      expect(planet.quality).toEqual('fixed')
    })
    it('魚座：柔軟宮', () => {
      const planet = new Planet(new Position(330.5), 'sun', false, house) // 魚座
      expect(planet.quality).toEqual('mutable')
    })
  })

  describe('Polarity', () => {
    it('牡羊座：男性', () => {
      const planet = new Planet(new Position(0.5), 'sun', false, house) // 牡羊座
      expect(planet.polarity).toEqual('masculine')
    })
    it('牡牛座：女性', () => {
      const planet = new Planet(new Position(30.5), 'sun', false, house) // 牡牛座
      expect(planet.polarity).toEqual('feminine')
    })
    it('双子座：男性', () => {
      const planet = new Planet(new Position(60.5), 'sun', false, house) // 双子座
      expect(planet.polarity).toEqual('masculine')
    })
    it('蟹座：女性', () => {
      const planet = new Planet(new Position(90.5), 'sun', false, house) // 蟹座
      expect(planet.polarity).toEqual('feminine')
    })
    it('獅子座：男性', () => {
      const planet = new Planet(new Position(120.5), 'sun', false, house) // 獅子座
      expect(planet.polarity).toEqual('masculine')
    })
    it('乙女座：女性', () => {
      const planet = new Planet(new Position(150.5), 'sun', false, house) // 乙女座
      expect(planet.polarity).toEqual('feminine')
    })
    it('天秤座：男性', () => {
      const planet = new Planet(new Position(180.5), 'sun', false, house) // 天秤座
      expect(planet.polarity).toEqual('masculine')
    })
    it('蠍座：女性', () => {
      const planet = new Planet(new Position(210.5), 'sun', false, house) // 蠍座
      expect(planet.polarity).toEqual('feminine')
    })
    it('射手座：男性', () => {
      const planet = new Planet(new Position(240.5), 'sun', false, house) // 射手座
      expect(planet.polarity).toEqual('masculine')
    })
    it('山羊座：女性', () => {
      const planet = new Planet(new Position(270.5), 'sun', false, house) // 山羊座
      expect(planet.polarity).toEqual('feminine')
    })
    it('水瓶座：男性', () => {
      const planet = new Planet(new Position(300.5), 'sun', false, house) // 水瓶座
      expect(planet.polarity).toEqual('masculine')
    })
    it('魚座：女性', () => {
      const planet = new Planet(new Position(330.5), 'sun', false, house) // 魚座
      expect(planet.polarity).toEqual('feminine')
    })
  })

  describe('メジャーアスペクト', () => {
    const orb = 6
    describe('0度：コンジャクション', () => {
      it('ちょうど基準値', () => {
        const planet1 = new Planet(new Position(10), 'sun', false, house)
        const planet2 = new Planet(new Position(10), 'sun', false, house)
        expect(planet1.majorAspect(planet2, orb)).toEqual({ degrees: 0, name: 'conjunction', type: 'hard' })
      })
      it('基準値より大きい、許容範囲内', () => {
        const planet1 = new Planet(new Position(10), 'sun', false, house)
        const planet2 = new Planet(new Position(16), 'sun', false, house)
        expect(planet1.majorAspect(planet2, orb)).toEqual({ degrees: 0, name: 'conjunction', type: 'hard' })
      })
      it('基準値より小さい、許容範囲内', () => {
        const planet1 = new Planet(new Position(16), 'sun', false, house)
        const planet2 = new Planet(new Position(10), 'sun', false, house)
        expect(planet1.majorAspect(planet2, orb)).toEqual({ degrees: 0, name: 'conjunction', type: 'hard' })
      })
      it('基準値より大きい、許容範囲外', () => {
        const planet1 = new Planet(new Position(10), 'sun', false, house)
        const planet2 = new Planet(new Position(16.1), 'sun', false, house)
        expect(planet1.majorAspect(planet2, orb)).toEqual(undefined)
      })
      it('基準値より小さい、許容範囲外', () => {
        const planet1 = new Planet(new Position(16.1), 'sun', false, house)
        const planet2 = new Planet(new Position(10), 'sun', false, house)
        expect(planet1.majorAspect(planet2, orb)).toEqual(undefined)
      })
    })
    describe('60度：セクスタイル', () => {
      it('ちょうど基準値1', () => {
        const planet1 = new Planet(new Position(10), 'sun', false, house)
        const planet2 = new Planet(new Position(70), 'sun', false, house)
        expect(planet1.majorAspect(planet2, orb)).toEqual({ degrees: 60, name: 'sextile', type: 'soft' })
      })
      it('ちょうど基準値2', () => {
        const planet1 = new Planet(new Position(70), 'sun', false, house)
        const planet2 = new Planet(new Position(10), 'sun', false, house)
        expect(planet1.majorAspect(planet2, orb)).toEqual({ degrees: 60, name: 'sextile', type: 'soft' })
      })
      it('基準値より大きい、許容範囲内', () => {
        const planet1 = new Planet(new Position(10), 'sun', false, house)
        const planet2 = new Planet(new Position(76), 'sun', false, house)
        expect(planet1.majorAspect(planet2, orb)).toEqual({ degrees: 60, name: 'sextile', type: 'soft' })
      })
      it('基準値より小さい、許容範囲内', () => {
        const planet1 = new Planet(new Position(76), 'sun', false, house)
        const planet2 = new Planet(new Position(10), 'sun', false, house)
        expect(planet1.majorAspect(planet2, orb)).toEqual({ degrees: 60, name: 'sextile', type: 'soft' })
      })
      it('基準値より大きい、許容範囲外', () => {
        const planet1 = new Planet(new Position(10), 'sun', false, house)
        const planet2 = new Planet(new Position(77), 'sun', false, house)
        expect(planet1.majorAspect(planet2, orb)).toEqual(undefined)
      })
      it('基準値より小さい、許容範囲外', () => {
        const planet1 = new Planet(new Position(77), 'sun', false, house)
        const planet2 = new Planet(new Position(10), 'sun', false, house)
        expect(planet1.majorAspect(planet2, orb)).toEqual(undefined)
      })
    })
    describe('90度：スクエア', () => {
      it('ちょうど基準値', () => {
        const planet1 = new Planet(new Position(10), 'sun', false, house)
        const planet2 = new Planet(new Position(100), 'sun', false, house)
        expect(planet1.majorAspect(planet2, orb)).toEqual({ degrees: 90, name: 'square', type: 'hard' })
      })
    })
    describe('120度：トライン', () => {
      it('ちょうど基準値', () => {
        const planet1 = new Planet(new Position(10), 'sun', false, house)
        const planet2 = new Planet(new Position(130), 'sun', false, house)
        expect(planet1.majorAspect(planet2, orb)).toEqual({ degrees: 120, name: 'trine', type: 'soft' })
      })
    })
    describe('180度：オポジション', () => {
      it('ちょうど基準値', () => {
        const planet1 = new Planet(new Position(10), 'sun', false, house)
        const planet2 = new Planet(new Position(190), 'sun', false, house)
        expect(planet1.majorAspect(planet2, orb)).toEqual({ degrees: 180, name: 'opposition', type: 'hard' })
      })
    })
  })

  describe('マイナーアスペクト', () => {
    const orb = 2
    describe('30度：セミセクスタイル', () => {
      it('ちょうど基準値', () => {
        const planet1 = new Planet(new Position(10), 'sun', false, house)
        const planet2 = new Planet(new Position(40), 'sun', false, house)
        expect(planet1.minorAspect(planet2, orb)).toEqual({ degrees: 30, name: 'semi-sextile' })
      })
    })
    describe('45度：セミスクエア', () => {
      it('ちょうど基準値', () => {
        const planet1 = new Planet(new Position(10), 'sun', false, house)
        const planet2 = new Planet(new Position(55), 'sun', false, house)
        expect(planet1.minorAspect(planet2, orb)).toEqual({ degrees: 45, name: 'semi-square' })
      })
    })
    describe('72度：クィンタイル', () => {
      it('ちょうど基準値', () => {
        const planet1 = new Planet(new Position(10), 'sun', false, house)
        const planet2 = new Planet(new Position(82), 'sun', false, house)
        expect(planet1.minorAspect(planet2, orb)).toEqual({ degrees: 72, name: 'quintile' })
      })
    })
    describe('135度：セスキコードレート', () => {
      it('ちょうど基準値', () => {
        const planet1 = new Planet(new Position(10), 'sun', false, house)
        const planet2 = new Planet(new Position(145), 'sun', false, house)
        expect(planet1.minorAspect(planet2, orb)).toEqual({ degrees: 135, name: 'sesquiquadrate' })
      })
    })
    describe('144度：バイクインタイル', () => {
      it('ちょうど基準値', () => {
        const planet1 = new Planet(new Position(10), 'sun', false, house)
        const planet2 = new Planet(new Position(154), 'sun', false, house)
        expect(planet1.minorAspect(planet2, orb)).toEqual({ degrees: 144, name: 'biquintile' })
      })
    })
    describe('150度：クインカンクス', () => {
      it('ちょうど基準値', () => {
        const planet1 = new Planet(new Position(10), 'sun', false, house)
        const sign150 = new Planet(new Position(160), 'sun', false, house)
        expect(planet1.minorAspect(sign150, orb)).toEqual({ degrees: 150, name: 'quincunx' })
      })
    })
  })
})
