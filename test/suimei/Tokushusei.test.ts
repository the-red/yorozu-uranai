import { getKanshiInstance } from './test-util'
import { tokushusei } from '../../src/suimei'

describe('Tokushusei', () => {
  it('all', async () => {
    const date = new Date('1983-03-15T22:23:00+09:00')
    const kanshi = await getKanshiInstance(date)
    const tokushuseiList = tokushusei(kanshi)
    expect(tokushuseiList).toMatchObject(['天官貴人', '天厨貴人', '暗禄', '十干禄', '流霞殺'])
  })

  it('日干と支', async () => {
    const date = new Date('1983-03-15T22:23:00+09:00')
    const kanshi = await getKanshiInstance(date)
    const tokushuseiList = tokushusei(kanshi)
    expect(tokushuseiList).toEqual(expect.arrayContaining(['天官貴人']))
  })

  it('日干と日支', async () => {
    const date = new Date('2023-03-01T12:00:00+09:00')
    const kanshi = await getKanshiInstance(date)
    const tokushuseiList = tokushusei(kanshi)
    expect(tokushuseiList).toEqual(expect.arrayContaining(['日刃']))
  })

  it('月支と干支', async () => {
    const date = new Date('2023-03-15T11:41:20+09:00')
    const kanshi = await getKanshiInstance(date)
    const tokushuseiList = tokushusei(kanshi)
    expect(tokushuseiList).toEqual(expect.arrayContaining(['天徳貴人']))
  })

  it('月支と支', async () => {
    const date = new Date('1939-02-06T12:00:00+09:00')
    const kanshi = await getKanshiInstance(date)
    const tokushuseiList = tokushusei(kanshi)
    expect(tokushuseiList).toEqual(expect.arrayContaining(['華蓋']))
  })
})
