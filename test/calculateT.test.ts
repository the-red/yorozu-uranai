import { calculateT } from '../src/calculateT'

describe('calculateT', () => {
  it('14：55をTに変換', () => {
    const T = calculateT()
    expect(T).toEqual(14.917)
  })
})
