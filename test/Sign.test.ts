import { Sign } from '../src/Sign'

describe('Sign', () => {
  const sign = new Sign({
    sun: '乙女座',
    moon: '魚座',
    mercury: '天秤座',
    venus: '乙女座',
    mars: '乙女座',
    jupiter: '牡羊座',
    saturn: '射手座',
    uranus: '射手座',
    neptune: '山羊座',
    pluto: '蠍座',
  })
  describe('Element', () => {
    it('火', () => {
      expect(sign.fire()).toEqual(['jupiter', 'saturn', 'uranus'])
    })
    it('土', () => {
      expect(sign.earth()).toEqual(['sun', 'venus', 'mars', 'neptune'])
    })
    it('風', () => {
      expect(sign.air()).toEqual(['mercury'])
    })
    it('水', () => {
      expect(sign.water()).toEqual(['moon', 'pluto'])
    })
  })
  describe('Polarity', () => {
    it('男性', () => {
      expect(sign.masculine()).toEqual(['jupiter', 'saturn', 'uranus', 'mercury'])
    })
    it('女性', () => {
      expect(sign.feminine()).toEqual(['sun', 'venus', 'mars', 'neptune', 'moon', 'pluto'])
    })
  })
})
