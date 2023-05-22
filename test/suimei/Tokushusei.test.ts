import { getKanshiInstance } from './test-util'
import { tokushusei } from '../../src/suimei'

describe('Tokushusei', () => {
  const date = new Date('2023-03-15T11:41:20+09:00')

  it('特殊星', async () => {
    const kanshi = await getKanshiInstance(date)
    const tokushuseiList = tokushusei(kanshi)
    expect(tokushuseiList).toMatchObject(['飛刃'])
  })
})
