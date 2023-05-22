import { getKanshiInstance } from './test-util'
import { tokushusei } from '../../src/suimei'

describe('Tokushusei', () => {
  it('日干と支、日干と日支', async () => {
    const date = new Date('2023-03-01T12:00:00+09:00')
    const kanshi = await getKanshiInstance(date)
    const tokushuseiList = tokushusei(kanshi)
    expect(tokushuseiList).toMatchObject(['羊刃', '日刃'])
  })
})
