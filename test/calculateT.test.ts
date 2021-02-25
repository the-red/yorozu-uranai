import { calculateT } from '../src/calculateT'

describe('calculateT', () => {
  it('14：55をTに変換', () => {
    const T = calculateT(new Date('1979-08-06 14:55:00'))
    expect(T).toEqual(14.917)
  })
})
