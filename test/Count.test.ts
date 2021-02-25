import { Count } from '../src/Count'

describe('Count', () => {
  const count = new Count(123)
  it('value: そのままの値', () => {
    expect(count.value).toEqual(123)
  })
  it('twice: 2倍の値', () => {
    expect(count.twice()).toEqual(246)
  })
  it('文字列をコンストラクタに渡しても同じ', () => {
    const countFromString = new Count('123')
    expect(count.value).toEqual(countFromString.value)
  })
})
