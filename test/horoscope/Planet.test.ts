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
      expect(planet.position.degrees).toEqual(0)
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
        expect(planet1.majorAspect(planet2, orb)).toEqual('conjunction')
      })
      it('基準値より小さい、許容範囲内1', () => {
        const planet1 = new Planet(new Position(10), 'sun', false, house)
        const planet2 = new Planet(new Position(4), 'sun', false, house)
        expect(planet1.majorAspect(planet2, orb)).toEqual('conjunction')
      })
      it('基準値より小さい、許容範囲内2', () => {
        const planet1 = new Planet(new Position(4), 'sun', false, house)
        const planet2 = new Planet(new Position(10), 'sun', false, house)
        expect(planet1.majorAspect(planet2, orb)).toEqual('conjunction')
      })
      it('基準値より小さい、許容範囲外1', () => {
        const planet1 = new Planet(new Position(10), 'sun', false, house)
        const planet2 = new Planet(new Position(3), 'sun', false, house)
        expect(planet1.majorAspect(planet2, orb)).toEqual(undefined)
      })
      it('基準値より小さい、許容範囲外2', () => {
        const planet1 = new Planet(new Position(3), 'sun', false, house)
        const planet2 = new Planet(new Position(10), 'sun', false, house)
        expect(planet1.majorAspect(planet2, orb)).toEqual(undefined)
      })
      it('基準値より大きい、許容範囲内1', () => {
        const planet1 = new Planet(new Position(10), 'sun', false, house)
        const planet2 = new Planet(new Position(16), 'sun', false, house)
        expect(planet1.majorAspect(planet2, orb)).toEqual('conjunction')
      })
      it('基準値より大きい、許容範囲内2', () => {
        const planet1 = new Planet(new Position(16), 'sun', false, house)
        const planet2 = new Planet(new Position(10), 'sun', false, house)
        expect(planet1.majorAspect(planet2, orb)).toEqual('conjunction')
      })
      it('基準値より大きい、許容範囲外1', () => {
        const planet1 = new Planet(new Position(10), 'sun', false, house)
        const planet2 = new Planet(new Position(17), 'sun', false, house)
        expect(planet1.majorAspect(planet2, orb)).toEqual(undefined)
      })
      it('基準値より大きい、許容範囲外2', () => {
        const planet1 = new Planet(new Position(17), 'sun', false, house)
        const planet2 = new Planet(new Position(10), 'sun', false, house)
        expect(planet1.majorAspect(planet2, orb)).toEqual(undefined)
      })
    })
    describe('60度：セクスタイル', () => {
      it('ちょうど基準値1', () => {
        const planet1 = new Planet(new Position(10), 'sun', false, house)
        const planet2 = new Planet(new Position(70), 'sun', false, house)
        expect(planet1.majorAspect(planet2, orb)).toEqual('sextile')
      })
      it('ちょうど基準値2', () => {
        const planet1 = new Planet(new Position(70), 'sun', false, house)
        const planet2 = new Planet(new Position(10), 'sun', false, house)
        expect(planet1.majorAspect(planet2, orb)).toEqual('sextile')
      })
      it('基準値より小さい、許容範囲内1', () => {
        const planet1 = new Planet(new Position(10), 'sun', false, house)
        const planet2 = new Planet(new Position(64), 'sun', false, house)
        expect(planet1.majorAspect(planet2, orb)).toEqual('sextile')
      })
      it('基準値より小さい、許容範囲内2', () => {
        const planet1 = new Planet(new Position(64), 'sun', false, house)
        const planet2 = new Planet(new Position(10), 'sun', false, house)
        expect(planet1.majorAspect(planet2, orb)).toEqual('sextile')
      })
      it('基準値より小さい、許容範囲外1', () => {
        const planet1 = new Planet(new Position(10), 'sun', false, house)
        const planet2 = new Planet(new Position(63), 'sun', false, house)
        expect(planet1.majorAspect(planet2, orb)).toEqual(undefined)
      })
      it('基準値より小さい、許容範囲外2', () => {
        const planet1 = new Planet(new Position(63), 'sun', false, house)
        const planet2 = new Planet(new Position(10), 'sun', false, house)
        expect(planet1.majorAspect(planet2, orb)).toEqual(undefined)
      })
      it('基準値より大きい、許容範囲内1', () => {
        const planet1 = new Planet(new Position(10), 'sun', false, house)
        const planet2 = new Planet(new Position(76), 'sun', false, house)
        expect(planet1.majorAspect(planet2, orb)).toEqual('sextile')
      })
      it('基準値より大きい、許容範囲内2', () => {
        const planet1 = new Planet(new Position(76), 'sun', false, house)
        const planet2 = new Planet(new Position(10), 'sun', false, house)
        expect(planet1.majorAspect(planet2, orb)).toEqual('sextile')
      })
      it('基準値より大きい、許容範囲外1', () => {
        const planet1 = new Planet(new Position(10), 'sun', false, house)
        const planet2 = new Planet(new Position(77), 'sun', false, house)
        expect(planet1.majorAspect(planet2, orb)).toEqual(undefined)
      })
      it('基準値より大きい、許容範囲外2', () => {
        const planet1 = new Planet(new Position(77), 'sun', false, house)
        const planet2 = new Planet(new Position(10), 'sun', false, house)
        expect(planet1.majorAspect(planet2, orb)).toEqual(undefined)
      })
    })
    describe('90度：スクエア', () => {
      it('ちょうど基準値1', () => {
        const planet1 = new Planet(new Position(10), 'sun', false, house)
        const planet2 = new Planet(new Position(100), 'sun', false, house)
        expect(planet1.majorAspect(planet2, orb)).toEqual('square')
      })
      it('ちょうど基準値2', () => {
        const planet1 = new Planet(new Position(100), 'sun', false, house)
        const planet2 = new Planet(new Position(10), 'sun', false, house)
        expect(planet1.majorAspect(planet2, orb)).toEqual('square')
      })
      it('基準値より小さい、許容範囲内1', () => {
        const planet1 = new Planet(new Position(10), 'sun', false, house)
        const planet2 = new Planet(new Position(94), 'sun', false, house)
        expect(planet1.majorAspect(planet2, orb)).toEqual('square')
      })
      it('基準値より小さい、許容範囲内2', () => {
        const planet1 = new Planet(new Position(94), 'sun', false, house)
        const planet2 = new Planet(new Position(10), 'sun', false, house)
        expect(planet1.majorAspect(planet2, orb)).toEqual('square')
      })
      it('基準値より小さい、許容範囲外1', () => {
        const planet1 = new Planet(new Position(10), 'sun', false, house)
        const planet2 = new Planet(new Position(93), 'sun', false, house)
        expect(planet1.majorAspect(planet2, orb)).toEqual(undefined)
      })
      it('基準値より小さい、許容範囲外2', () => {
        const planet1 = new Planet(new Position(93), 'sun', false, house)
        const planet2 = new Planet(new Position(10), 'sun', false, house)
        expect(planet1.majorAspect(planet2, orb)).toEqual(undefined)
      })
      it('基準値より大きい、許容範囲内1', () => {
        const planet1 = new Planet(new Position(10), 'sun', false, house)
        const planet2 = new Planet(new Position(106), 'sun', false, house)
        expect(planet1.majorAspect(planet2, orb)).toEqual('square')
      })
      it('基準値より大きい、許容範囲内2', () => {
        const planet1 = new Planet(new Position(106), 'sun', false, house)
        const planet2 = new Planet(new Position(10), 'sun', false, house)
        expect(planet1.majorAspect(planet2, orb)).toEqual('square')
      })
      it('基準値より大きい、許容範囲外1', () => {
        const planet1 = new Planet(new Position(10), 'sun', false, house)
        const planet2 = new Planet(new Position(107), 'sun', false, house)
        expect(planet1.majorAspect(planet2, orb)).toEqual(undefined)
      })
      it('基準値より大きい、許容範囲外2', () => {
        const planet1 = new Planet(new Position(107), 'sun', false, house)
        const planet2 = new Planet(new Position(10), 'sun', false, house)
        expect(planet1.majorAspect(planet2, orb)).toEqual(undefined)
      })
    })
    describe('120度：トライン', () => {
      it('ちょうど基準値1', () => {
        const planet1 = new Planet(new Position(10), 'sun', false, house)
        const planet2 = new Planet(new Position(130), 'sun', false, house)
        expect(planet1.majorAspect(planet2, orb)).toEqual('trine')
      })
      it('ちょうど基準値2', () => {
        const planet1 = new Planet(new Position(130), 'sun', false, house)
        const planet2 = new Planet(new Position(10), 'sun', false, house)
        expect(planet1.majorAspect(planet2, orb)).toEqual('trine')
      })
      it('基準値より小さい、許容範囲内1', () => {
        const planet1 = new Planet(new Position(10), 'sun', false, house)
        const planet2 = new Planet(new Position(124), 'sun', false, house)
        expect(planet1.majorAspect(planet2, orb)).toEqual('trine')
      })
      it('基準値より小さい、許容範囲内2', () => {
        const planet1 = new Planet(new Position(124), 'sun', false, house)
        const planet2 = new Planet(new Position(10), 'sun', false, house)
        expect(planet1.majorAspect(planet2, orb)).toEqual('trine')
      })
      it('基準値より小さい、許容範囲外1', () => {
        const planet1 = new Planet(new Position(10), 'sun', false, house)
        const planet2 = new Planet(new Position(123), 'sun', false, house)
        expect(planet1.majorAspect(planet2, orb)).toEqual(undefined)
      })
      it('基準値より小さい、許容範囲外2', () => {
        const planet1 = new Planet(new Position(123), 'sun', false, house)
        const planet2 = new Planet(new Position(10), 'sun', false, house)
        expect(planet1.majorAspect(planet2, orb)).toEqual(undefined)
      })
      it('基準値より大きい、許容範囲内1', () => {
        const planet1 = new Planet(new Position(10), 'sun', false, house)
        const planet2 = new Planet(new Position(136), 'sun', false, house)
        expect(planet1.majorAspect(planet2, orb)).toEqual('trine')
      })
      it('基準値より大きい、許容範囲内2', () => {
        const planet1 = new Planet(new Position(136), 'sun', false, house)
        const planet2 = new Planet(new Position(10), 'sun', false, house)
        expect(planet1.majorAspect(planet2, orb)).toEqual('trine')
      })
      it('基準値より大きい、許容範囲外1', () => {
        const planet1 = new Planet(new Position(10), 'sun', false, house)
        const planet2 = new Planet(new Position(137), 'sun', false, house)
        expect(planet1.majorAspect(planet2, orb)).toEqual(undefined)
      })
      it('基準値より大きい、許容範囲外2', () => {
        const planet1 = new Planet(new Position(137), 'sun', false, house)
        const planet2 = new Planet(new Position(10), 'sun', false, house)
        expect(planet1.majorAspect(planet2, orb)).toEqual(undefined)
      })
    })
    describe('180度：オポジション', () => {
      it('ちょうど基準値1', () => {
        const planet1 = new Planet(new Position(10), 'sun', false, house)
        const planet2 = new Planet(new Position(190), 'sun', false, house)
        expect(planet1.majorAspect(planet2, orb)).toEqual('opposition')
      })
      it('ちょうど基準値2', () => {
        const planet1 = new Planet(new Position(190), 'sun', false, house)
        const planet2 = new Planet(new Position(10), 'sun', false, house)
        expect(planet1.majorAspect(planet2, orb)).toEqual('opposition')
      })
      it('基準値より小さい、許容範囲内1', () => {
        const planet1 = new Planet(new Position(10), 'sun', false, house)
        const planet2 = new Planet(new Position(184), 'sun', false, house)
        expect(planet1.majorAspect(planet2, orb)).toEqual('opposition')
      })
      it('基準値より小さい、許容範囲内2', () => {
        const planet1 = new Planet(new Position(184), 'sun', false, house)
        const planet2 = new Planet(new Position(10), 'sun', false, house)
        expect(planet1.majorAspect(planet2, orb)).toEqual('opposition')
      })
      it('基準値より小さい、許容範囲外1', () => {
        const planet1 = new Planet(new Position(10), 'sun', false, house)
        const planet2 = new Planet(new Position(183), 'sun', false, house)
        expect(planet1.majorAspect(planet2, orb)).toEqual(undefined)
      })
      it('基準値より小さい、許容範囲外2', () => {
        const planet1 = new Planet(new Position(183), 'sun', false, house)
        const planet2 = new Planet(new Position(10), 'sun', false, house)
        expect(planet1.majorAspect(planet2, orb)).toEqual(undefined)
      })
      it('基準値より大きい、許容範囲内1', () => {
        const planet1 = new Planet(new Position(10), 'sun', false, house)
        const planet2 = new Planet(new Position(196), 'sun', false, house)
        expect(planet1.majorAspect(planet2, orb)).toEqual('opposition')
      })
      it('基準値より大きい、許容範囲内2', () => {
        const planet1 = new Planet(new Position(196), 'sun', false, house)
        const planet2 = new Planet(new Position(10), 'sun', false, house)
        expect(planet1.majorAspect(planet2, orb)).toEqual('opposition')
      })
      it('基準値より大きい、許容範囲外1', () => {
        const planet1 = new Planet(new Position(10), 'sun', false, house)
        const planet2 = new Planet(new Position(197), 'sun', false, house)
        expect(planet1.majorAspect(planet2, orb)).toEqual(undefined)
      })
      it('基準値より大きい、許容範囲外2', () => {
        const planet1 = new Planet(new Position(197), 'sun', false, house)
        const planet2 = new Planet(new Position(10), 'sun', false, house)
        expect(planet1.majorAspect(planet2, orb)).toEqual(undefined)
      })
    })
  })

  describe('マイナーアスペクト', () => {
    const orb = 2
    describe('30度：セミセクスタイル', () => {
      it('ちょうど基準値1', () => {
        const planet1 = new Planet(new Position(10), 'sun', false, house)
        const planet2 = new Planet(new Position(40), 'sun', false, house)
        expect(planet1.minorAspect(planet2, orb)).toEqual('semi-sextile')
      })
      it('ちょうど基準値2', () => {
        const planet1 = new Planet(new Position(40), 'sun', false, house)
        const planet2 = new Planet(new Position(10), 'sun', false, house)
        expect(planet1.minorAspect(planet2, orb)).toEqual('semi-sextile')
      })
      it('基準値より小さい、許容範囲内1', () => {
        const planet1 = new Planet(new Position(10), 'sun', false, house)
        const planet2 = new Planet(new Position(38), 'sun', false, house)
        expect(planet1.minorAspect(planet2, orb)).toEqual('semi-sextile')
      })
      it('基準値より小さい、許容範囲内2', () => {
        const planet1 = new Planet(new Position(38), 'sun', false, house)
        const planet2 = new Planet(new Position(10), 'sun', false, house)
        expect(planet1.minorAspect(planet2, orb)).toEqual('semi-sextile')
      })
      it('基準値より小さい、許容範囲外1', () => {
        const planet1 = new Planet(new Position(10), 'sun', false, house)
        const planet2 = new Planet(new Position(37), 'sun', false, house)
        expect(planet1.minorAspect(planet2, orb)).toEqual(undefined)
      })
      it('基準値より小さい、許容範囲外2', () => {
        const planet1 = new Planet(new Position(37), 'sun', false, house)
        const planet2 = new Planet(new Position(10), 'sun', false, house)
        expect(planet1.minorAspect(planet2, orb)).toEqual(undefined)
      })
      it('基準値より大きい、許容範囲内1', () => {
        const planet1 = new Planet(new Position(10), 'sun', false, house)
        const planet2 = new Planet(new Position(42), 'sun', false, house)
        expect(planet1.minorAspect(planet2, orb)).toEqual('semi-sextile')
      })
      it('基準値より大きい、許容範囲内2', () => {
        const planet1 = new Planet(new Position(42), 'sun', false, house)
        const planet2 = new Planet(new Position(10), 'sun', false, house)
        expect(planet1.minorAspect(planet2, orb)).toEqual('semi-sextile')
      })
      it('基準値より大きい、許容範囲外1', () => {
        const planet1 = new Planet(new Position(10), 'sun', false, house)
        const planet2 = new Planet(new Position(43), 'sun', false, house)
        expect(planet1.minorAspect(planet2, orb)).toEqual(undefined)
      })
      it('基準値より大きい、許容範囲外2', () => {
        const planet1 = new Planet(new Position(43), 'sun', false, house)
        const planet2 = new Planet(new Position(10), 'sun', false, house)
        expect(planet1.minorAspect(planet2, orb)).toEqual(undefined)
      })
    })
    describe('45度：セミスクエア', () => {
      it('ちょうど基準値1', () => {
        const planet1 = new Planet(new Position(10), 'sun', false, house)
        const planet2 = new Planet(new Position(55), 'sun', false, house)
        expect(planet1.minorAspect(planet2, orb)).toEqual('semi-square')
      })
      it('ちょうど基準値2', () => {
        const planet1 = new Planet(new Position(55), 'sun', false, house)
        const planet2 = new Planet(new Position(10), 'sun', false, house)
        expect(planet1.minorAspect(planet2, orb)).toEqual('semi-square')
      })
      it('基準値より小さい、許容範囲内1', () => {
        const planet1 = new Planet(new Position(10), 'sun', false, house)
        const planet2 = new Planet(new Position(53), 'sun', false, house)
        expect(planet1.minorAspect(planet2, orb)).toEqual('semi-square')
      })
      it('基準値より小さい、許容範囲内2', () => {
        const planet1 = new Planet(new Position(53), 'sun', false, house)
        const planet2 = new Planet(new Position(10), 'sun', false, house)
        expect(planet1.minorAspect(planet2, orb)).toEqual('semi-square')
      })
      it('基準値より小さい、許容範囲外1', () => {
        const planet1 = new Planet(new Position(10), 'sun', false, house)
        const planet2 = new Planet(new Position(52), 'sun', false, house)
        expect(planet1.minorAspect(planet2, orb)).toEqual(undefined)
      })
      it('基準値より小さい、許容範囲外2', () => {
        const planet1 = new Planet(new Position(52), 'sun', false, house)
        const planet2 = new Planet(new Position(10), 'sun', false, house)
        expect(planet1.minorAspect(planet2, orb)).toEqual(undefined)
      })
      it('基準値より大きい、許容範囲内1', () => {
        const planet1 = new Planet(new Position(10), 'sun', false, house)
        const planet2 = new Planet(new Position(57), 'sun', false, house)
        expect(planet1.minorAspect(planet2, orb)).toEqual('semi-square')
      })
      it('基準値より大きい、許容範囲内2', () => {
        const planet1 = new Planet(new Position(57), 'sun', false, house)
        const planet2 = new Planet(new Position(10), 'sun', false, house)
        expect(planet1.minorAspect(planet2, orb)).toEqual('semi-square')
      })
      it('基準値より大きい、許容範囲外1', () => {
        const planet1 = new Planet(new Position(10), 'sun', false, house)
        const planet2 = new Planet(new Position(58), 'sun', false, house)
        expect(planet1.minorAspect(planet2, orb)).toEqual(undefined)
      })
      it('基準値より大きい、許容範囲外2', () => {
        const planet1 = new Planet(new Position(58), 'sun', false, house)
        const planet2 = new Planet(new Position(10), 'sun', false, house)
        expect(planet1.minorAspect(planet2, orb)).toEqual(undefined)
      })
    })
    describe('72度：クィンタイル', () => {
      it('ちょうど基準値1', () => {
        const planet1 = new Planet(new Position(10), 'sun', false, house)
        const planet2 = new Planet(new Position(82), 'sun', false, house)
        expect(planet1.minorAspect(planet2, orb)).toEqual('quintile')
      })
      it('ちょうど基準値2', () => {
        const planet1 = new Planet(new Position(82), 'sun', false, house)
        const planet2 = new Planet(new Position(10), 'sun', false, house)
        expect(planet1.minorAspect(planet2, orb)).toEqual('quintile')
      })
      it('基準値より小さい、許容範囲内1', () => {
        const planet1 = new Planet(new Position(10), 'sun', false, house)
        const planet2 = new Planet(new Position(80), 'sun', false, house)
        expect(planet1.minorAspect(planet2, orb)).toEqual('quintile')
      })
      it('基準値より小さい、許容範囲内2', () => {
        const planet1 = new Planet(new Position(80), 'sun', false, house)
        const planet2 = new Planet(new Position(10), 'sun', false, house)
        expect(planet1.minorAspect(planet2, orb)).toEqual('quintile')
      })
      it('基準値より小さい、許容範囲外1', () => {
        const planet1 = new Planet(new Position(10), 'sun', false, house)
        const planet2 = new Planet(new Position(79), 'sun', false, house)
        expect(planet1.minorAspect(planet2, orb)).toEqual(undefined)
      })
      it('基準値より小さい、許容範囲外2', () => {
        const planet1 = new Planet(new Position(79), 'sun', false, house)
        const planet2 = new Planet(new Position(10), 'sun', false, house)
        expect(planet1.minorAspect(planet2, orb)).toEqual(undefined)
      })
      it('基準値より大きい、許容範囲内1', () => {
        const planet1 = new Planet(new Position(10), 'sun', false, house)
        const planet2 = new Planet(new Position(84), 'sun', false, house)
        expect(planet1.minorAspect(planet2, orb)).toEqual('quintile')
      })
      it('基準値より大きい、許容範囲内2', () => {
        const planet1 = new Planet(new Position(84), 'sun', false, house)
        const planet2 = new Planet(new Position(10), 'sun', false, house)
        expect(planet1.minorAspect(planet2, orb)).toEqual('quintile')
      })
      it('基準値より大きい、許容範囲外1', () => {
        const planet1 = new Planet(new Position(10), 'sun', false, house)
        const planet2 = new Planet(new Position(85), 'sun', false, house)
        expect(planet1.minorAspect(planet2, orb)).toEqual(undefined)
      })
      it('基準値より大きい、許容範囲外2', () => {
        const planet1 = new Planet(new Position(85), 'sun', false, house)
        const planet2 = new Planet(new Position(10), 'sun', false, house)
        expect(planet1.minorAspect(planet2, orb)).toEqual(undefined)
      })
    })
    describe('135度：セスキコードレート', () => {
      it('ちょうど基準値1', () => {
        const planet1 = new Planet(new Position(10), 'sun', false, house)
        const planet2 = new Planet(new Position(145), 'sun', false, house)
        expect(planet1.minorAspect(planet2, orb)).toEqual('sesquiquadrate')
      })
      it('ちょうど基準値2', () => {
        const planet1 = new Planet(new Position(145), 'sun', false, house)
        const planet2 = new Planet(new Position(10), 'sun', false, house)
        expect(planet1.minorAspect(planet2, orb)).toEqual('sesquiquadrate')
      })
      it('基準値より小さい、許容範囲内1', () => {
        const planet1 = new Planet(new Position(10), 'sun', false, house)
        const planet2 = new Planet(new Position(143), 'sun', false, house)
        expect(planet1.minorAspect(planet2, orb)).toEqual('sesquiquadrate')
      })
      it('基準値より小さい、許容範囲内2', () => {
        const planet1 = new Planet(new Position(143), 'sun', false, house)
        const planet2 = new Planet(new Position(10), 'sun', false, house)
        expect(planet1.minorAspect(planet2, orb)).toEqual('sesquiquadrate')
      })
      it('基準値より小さい、許容範囲外1', () => {
        const planet1 = new Planet(new Position(10), 'sun', false, house)
        const planet2 = new Planet(new Position(142), 'sun', false, house)
        expect(planet1.minorAspect(planet2, orb)).toEqual(undefined)
      })
      it('基準値より小さい、許容範囲外2', () => {
        const planet1 = new Planet(new Position(142), 'sun', false, house)
        const planet2 = new Planet(new Position(10), 'sun', false, house)
        expect(planet1.minorAspect(planet2, orb)).toEqual(undefined)
      })
      it('基準値より大きい、許容範囲内1', () => {
        const planet1 = new Planet(new Position(10), 'sun', false, house)
        const planet2 = new Planet(new Position(147), 'sun', false, house)
        expect(planet1.minorAspect(planet2, orb)).toEqual('sesquiquadrate')
      })
      it('基準値より大きい、許容範囲内2', () => {
        const planet1 = new Planet(new Position(147), 'sun', false, house)
        const planet2 = new Planet(new Position(10), 'sun', false, house)
        expect(planet1.minorAspect(planet2, orb)).toEqual('sesquiquadrate')
      })
      it('基準値より大きい、許容範囲外1', () => {
        const planet1 = new Planet(new Position(10), 'sun', false, house)
        const planet2 = new Planet(new Position(148), 'sun', false, house)
        expect(planet1.minorAspect(planet2, orb)).toEqual(undefined)
      })
      it('基準値より大きい、許容範囲外2', () => {
        const planet1 = new Planet(new Position(148), 'sun', false, house)
        const planet2 = new Planet(new Position(10), 'sun', false, house)
        expect(planet1.minorAspect(planet2, orb)).toEqual(undefined)
      })
    })
    describe('144度：バイクインタイル', () => {
      it('ちょうど基準値1', () => {
        const planet1 = new Planet(new Position(10), 'sun', false, house)
        const planet2 = new Planet(new Position(154), 'sun', false, house)
        expect(planet1.minorAspect(planet2, orb)).toEqual('biquintile')
      })
      it('ちょうど基準値2', () => {
        const planet1 = new Planet(new Position(154), 'sun', false, house)
        const planet2 = new Planet(new Position(10), 'sun', false, house)
        expect(planet1.minorAspect(planet2, orb)).toEqual('biquintile')
      })
      it('基準値より小さい、許容範囲内1', () => {
        const planet1 = new Planet(new Position(10), 'sun', false, house)
        const planet2 = new Planet(new Position(152), 'sun', false, house)
        expect(planet1.minorAspect(planet2, orb)).toEqual('biquintile')
      })
      it('基準値より小さい、許容範囲内2', () => {
        const planet1 = new Planet(new Position(152), 'sun', false, house)
        const planet2 = new Planet(new Position(10), 'sun', false, house)
        expect(planet1.minorAspect(planet2, orb)).toEqual('biquintile')
      })
      it('基準値より小さい、許容範囲外1', () => {
        const planet1 = new Planet(new Position(10), 'sun', false, house)
        const planet2 = new Planet(new Position(151), 'sun', false, house)
        expect(planet1.minorAspect(planet2, orb)).toEqual(undefined)
      })
      it('基準値より小さい、許容範囲外2', () => {
        const planet1 = new Planet(new Position(151), 'sun', false, house)
        const planet2 = new Planet(new Position(10), 'sun', false, house)
        expect(planet1.minorAspect(planet2, orb)).toEqual(undefined)
      })
      it('基準値より大きい、許容範囲内1', () => {
        const planet1 = new Planet(new Position(10), 'sun', false, house)
        const planet2 = new Planet(new Position(156), 'sun', false, house)
        expect(planet1.minorAspect(planet2, orb)).toEqual('biquintile')
      })
      it('基準値より大きい、許容範囲内2', () => {
        const planet1 = new Planet(new Position(156), 'sun', false, house)
        const planet2 = new Planet(new Position(10), 'sun', false, house)
        expect(planet1.minorAspect(planet2, orb)).toEqual('biquintile')
      })
      it('基準値より大きい、許容範囲外1', () => {
        const planet1 = new Planet(new Position(10), 'sun', false, house)
        const planet2 = new Planet(new Position(157), 'sun', false, house)
        expect(planet1.minorAspect(planet2, orb)).toEqual(undefined)
      })
      it('基準値より大きい、許容範囲外2', () => {
        const planet1 = new Planet(new Position(157), 'sun', false, house)
        const planet2 = new Planet(new Position(10), 'sun', false, house)
        expect(planet1.minorAspect(planet2, orb)).toEqual(undefined)
      })
    })
    describe('150度：クインカンクス', () => {
      it('ちょうど基準値1', () => {
        const planet1 = new Planet(new Position(10), 'sun', false, house)
        const sign150 = new Planet(new Position(160), 'sun', false, house)
        expect(planet1.minorAspect(sign150, orb)).toEqual('quincunx')
      })
      it('ちょうど基準値2', () => {
        const planet1 = new Planet(new Position(160), 'sun', false, house)
        const sign150 = new Planet(new Position(10), 'sun', false, house)
        expect(planet1.minorAspect(sign150, orb)).toEqual('quincunx')
      })
      it('基準値より小さい、許容範囲内1', () => {
        const planet1 = new Planet(new Position(10), 'sun', false, house)
        const planet2 = new Planet(new Position(158), 'sun', false, house)
        expect(planet1.minorAspect(planet2, orb)).toEqual('quincunx')
      })
      it('基準値より小さい、許容範囲内2', () => {
        const planet1 = new Planet(new Position(158), 'sun', false, house)
        const planet2 = new Planet(new Position(10), 'sun', false, house)
        expect(planet1.minorAspect(planet2, orb)).toEqual('quincunx')
      })
      it('基準値より小さい、許容範囲外1', () => {
        const planet1 = new Planet(new Position(10), 'sun', false, house)
        const planet2 = new Planet(new Position(157), 'sun', false, house)
        expect(planet1.minorAspect(planet2, orb)).toEqual(undefined)
      })
      it('基準値より小さい、許容範囲外2', () => {
        const planet1 = new Planet(new Position(157), 'sun', false, house)
        const planet2 = new Planet(new Position(10), 'sun', false, house)
        expect(planet1.minorAspect(planet2, orb)).toEqual(undefined)
      })
      it('基準値より大きい、許容範囲内1', () => {
        const planet1 = new Planet(new Position(10), 'sun', false, house)
        const planet2 = new Planet(new Position(162), 'sun', false, house)
        expect(planet1.minorAspect(planet2, orb)).toEqual('quincunx')
      })
      it('基準値より大きい、許容範囲内2', () => {
        const planet1 = new Planet(new Position(162), 'sun', false, house)
        const planet2 = new Planet(new Position(10), 'sun', false, house)
        expect(planet1.minorAspect(planet2, orb)).toEqual('quincunx')
      })
      it('基準値より大きい、許容範囲外1', () => {
        const planet1 = new Planet(new Position(10), 'sun', false, house)
        const planet2 = new Planet(new Position(163), 'sun', false, house)
        expect(planet1.minorAspect(planet2, orb)).toEqual(undefined)
      })
      it('基準値より大きい、許容範囲外2', () => {
        const planet1 = new Planet(new Position(163), 'sun', false, house)
        const planet2 = new Planet(new Position(10), 'sun', false, house)
        expect(planet1.minorAspect(planet2, orb)).toEqual(undefined)
      })
    })
  })
})
