import { getKanshiInstance } from './test-util'
import { tokushusei } from '../../src/suimei'

describe('Tokushusei', () => {
  it('all', async () => {
    const date = new Date('1983-03-15T22:23:00+09:00')
    const kanshi = await getKanshiInstance(date)
    expect(kanshi.天干).toMatchObject(['癸', '乙', '壬', '辛'])
    expect(kanshi.地支).toMatchObject(['亥', '卯', '寅', '亥'])
    const tokushuseiMap = tokushusei(kanshi)
    expect(tokushuseiMap.年柱).toMatchObject(['十干禄', '流霞殺', '劫殺', '血刃'])
    expect(tokushuseiMap.月柱).toMatchObject(['咸池'])
    expect(tokushuseiMap.日柱).toMatchObject(['天官貴人', '天厨貴人', '暗禄', '孤辰'])
    expect(tokushuseiMap.時柱).toMatchObject(['十干禄', '流霞殺', '劫殺', '血刃'])
  })

  it('日干と支', async () => {
    const date = new Date('1983-03-15T22:23:00+09:00')
    const kanshi = await getKanshiInstance(date)
    expect(kanshi.天干).toMatchObject(['癸', '乙', '壬', '辛'])
    expect(kanshi.地支).toMatchObject(['亥', '卯', '寅', '亥'])
    const tokushuseiMap = tokushusei(kanshi)
    expect(tokushuseiMap.年柱).toEqual(expect.arrayContaining(['十干禄']))
    expect(tokushuseiMap.月柱).toEqual(expect.arrayContaining([]))
    expect(tokushuseiMap.日柱).toEqual(expect.arrayContaining(['天官貴人']))
    expect(tokushuseiMap.時柱).toEqual(expect.arrayContaining(['流霞殺']))
  })

  it('月支と干支', async () => {
    const date = new Date('2023-03-15T11:41:20+09:00')
    const kanshi = await getKanshiInstance(date)
    expect(kanshi.天干).toMatchObject(['癸', '乙', '壬', '丙'])
    expect(kanshi.地支).toMatchObject(['卯', '卯', '申', '午'])
    const tokushuseiMap = tokushusei(kanshi)
    expect(tokushuseiMap.年柱).toEqual(expect.arrayContaining([]))
    expect(tokushuseiMap.月柱).toEqual(expect.arrayContaining([]))
    expect(tokushuseiMap.日柱).toEqual(expect.arrayContaining(['天徳貴人']))
    expect(tokushuseiMap.時柱).toEqual(expect.arrayContaining([]))
  })

  it('月支と支', async () => {
    const date = new Date('1939-02-06T12:00:00+09:00')
    const kanshi = await getKanshiInstance(date)
    expect(kanshi.天干).toMatchObject(['己', '丙', '甲', '庚'])
    expect(kanshi.地支).toMatchObject(['卯', '寅', '戌', '午'])
    const tokushuseiMap = tokushusei(kanshi)
    expect(tokushuseiMap.年柱).toEqual(expect.arrayContaining([]))
    expect(tokushuseiMap.月柱).toEqual(expect.arrayContaining([]))
    expect(tokushuseiMap.日柱).toEqual(expect.arrayContaining(['華蓋']))
    expect(tokushuseiMap.時柱).toEqual(expect.arrayContaining([]))
  })

  it('年支日支と支', async () => {
    const date = new Date('1939-02-06T12:00:00+09:00')
    const kanshi = await getKanshiInstance(date)
    expect(kanshi.天干).toMatchObject(['己', '丙', '甲', '庚'])
    expect(kanshi.地支).toMatchObject(['卯', '寅', '戌', '午'])
    const tokushuseiMap = tokushusei(kanshi)
    expect(tokushuseiMap.年柱).toEqual(expect.arrayContaining(['咸池']))
    expect(tokushuseiMap.月柱).toEqual(expect.arrayContaining(['亡神']))
    expect(tokushuseiMap.日柱).toEqual(expect.arrayContaining([]))
    expect(tokushuseiMap.時柱).toEqual(expect.arrayContaining(['白虎']))
  })

  it('日柱', async () => {
    const date = new Date('1939-07-17T12:00:00+09:00')
    const kanshi = await getKanshiInstance(date)
    expect(kanshi.天干).toMatchObject(['己', '辛', '乙', '壬'])
    expect(kanshi.地支).toMatchObject(['卯', '未', '卯', '午'])
    const tokushuseiMap = tokushusei(kanshi)
    expect(tokushuseiMap.日柱).toEqual(expect.arrayContaining(['妨害殺']))
  })
})
