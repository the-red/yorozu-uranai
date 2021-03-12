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
  it('火', () => {
    expect(sign.fire()).toEqual(['sun'])
  })
})
