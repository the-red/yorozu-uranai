import { Zoukan, ZoukanTsuhensei, calcZoukan } from '../../src/suimei/models/Zoukan'
import { getKanshiInstance } from './test-util'

describe('Zoukan', () => {
  describe('地支：子', () => {
    const z = calcZoukan('子')
    it('本気：癸', () => {
      expect(z.honki).toEqual('癸')
    })
    it('中気：なし', () => {
      expect(z.chuki).toEqual('-')
    })
    it('余気：壬', () => {
      expect(z.yoki).toEqual('壬')
    })
  })
  describe('地支：丑', () => {
    const z = calcZoukan('丑')
    it('本気：己', () => {
      expect(z.honki).toEqual('己')
    })
    it('中気：辛', () => {
      expect(z.chuki).toEqual('辛')
    })
    it('余気：癸', () => {
      expect(z.yoki).toEqual('癸')
    })
  })
  describe('地支：寅', () => {
    const z = calcZoukan('寅')
    it('本気：甲', () => {
      expect(z.honki).toEqual('甲')
    })
    it('中気：丙', () => {
      expect(z.chuki).toEqual('丙')
    })
    it('余気：戊', () => {
      expect(z.yoki).toEqual('戊')
    })
  })
  describe('地支：卯', () => {
    const z = calcZoukan('卯')
    it('本気：乙', () => {
      expect(z.honki).toEqual('乙')
    })
    it('中気：なし', () => {
      expect(z.chuki).toEqual('-')
    })
    it('余気：甲', () => {
      expect(z.yoki).toEqual('甲')
    })
  })
  describe('地支：辰', () => {
    const z = calcZoukan('辰')
    it('本気：戊', () => {
      expect(z.honki).toEqual('戊')
    })
    it('中気：癸', () => {
      expect(z.chuki).toEqual('癸')
    })
    it('余気：乙', () => {
      expect(z.yoki).toEqual('乙')
    })
  })
  describe('地支：巳', () => {
    const z = calcZoukan('巳')
    it('本気：丙', () => {
      expect(z.honki).toEqual('丙')
    })
    it('中気：庚', () => {
      expect(z.chuki).toEqual('庚')
    })
    it('余気：戊', () => {
      expect(z.yoki).toEqual('戊')
    })
  })
  describe('地支：午', () => {
    const z = calcZoukan('午')
    it('本気：丁', () => {
      expect(z.honki).toEqual('丁')
    })
    it('中気：なし', () => {
      expect(z.chuki).toEqual('-')
    })
    it('余気：己', () => {
      expect(z.yoki).toEqual('己')
    })
  })
  describe('地支：未', () => {
    const z = calcZoukan('未')
    it('本気：己', () => {
      expect(z.honki).toEqual('己')
    })
    it('中気：乙', () => {
      expect(z.chuki).toEqual('乙')
    })
    it('余気：丁', () => {
      expect(z.yoki).toEqual('丁')
    })
  })
  describe('地支：申', () => {
    const z = calcZoukan('申')
    it('本気：庚', () => {
      expect(z.honki).toEqual('庚')
    })
    it('中気：壬', () => {
      expect(z.chuki).toEqual('壬')
    })
    it('余気：戊', () => {
      expect(z.yoki).toEqual('戊')
    })
  })
  describe('地支：酉', () => {
    const z = calcZoukan('酉')
    it('本気：辛', () => {
      expect(z.honki).toEqual('辛')
    })
    it('中気：なし', () => {
      expect(z.chuki).toEqual('-')
    })
    it('余気：庚', () => {
      expect(z.yoki).toEqual('庚')
    })
  })
  describe('地支：戌', () => {
    const z = calcZoukan('戌')
    it('本気：戊', () => {
      expect(z.honki).toEqual('戊')
    })
    it('中気：丁', () => {
      expect(z.chuki).toEqual('丁')
    })
    it('余気：辛', () => {
      expect(z.yoki).toEqual('辛')
    })
  })
  describe('地支：亥', () => {
    const z = calcZoukan('亥')
    it('本気：壬', () => {
      expect(z.honki).toEqual('壬')
    })
    it('中気：なし', () => {
      expect(z.chuki).toEqual('-')
    })
    it('余気：甲', () => {
      expect(z.yoki).toEqual('甲')
    })
  })
})

describe('Zoukan', () => {
  const date = new Date('2023-03-15T11:41:20+09:00')

  it('蔵干：年柱', async () => {
    const zoukan = new Zoukan(await getKanshiInstance(date))
    expect(zoukan.年柱).toMatchObject({ honki: '乙', chuki: '-', yoki: '甲' })
  })
  it('蔵干：月柱', async () => {
    const zoukan = new Zoukan(await getKanshiInstance(date))
    expect(zoukan.月柱).toMatchObject({ honki: '乙', chuki: '-', yoki: '甲' })
  })
  it('蔵干：日柱', async () => {
    const zoukan = new Zoukan(await getKanshiInstance(date))
    expect(zoukan.日柱).toEqual({ honki: '庚', chuki: '壬', yoki: '戊' })
  })
  it('蔵干：時柱', async () => {
    const zoukan = new Zoukan(await getKanshiInstance(date))
    expect(zoukan.時柱).toMatchObject({ honki: '丁', chuki: '-', yoki: '己' })
  })
})

describe('ZoukanTsuhensei', () => {
  const date = new Date('2023-03-15T11:41:20+09:00')

  it('蔵干通変星：年柱', async () => {
    const zoukanTsuhensei = new ZoukanTsuhensei(new Zoukan(await getKanshiInstance(date)))
    expect(zoukanTsuhensei.年柱).toMatchObject({ honki: '傷官', chuki: '-', yoki: '食神' })
  })
  it('蔵干通変星：月柱', async () => {
    const zoukanTsuhensei = new ZoukanTsuhensei(new Zoukan(await getKanshiInstance(date)))
    expect(zoukanTsuhensei.月柱).toMatchObject({ honki: '傷官', chuki: '-', yoki: '食神' })
  })
  it('蔵干通変星：日柱', async () => {
    const zoukanTsuhensei = new ZoukanTsuhensei(new Zoukan(await getKanshiInstance(date)))
    expect(zoukanTsuhensei.日柱).toMatchObject({ honki: '偏印', chuki: '比肩', yoki: '偏官' })
  })
  it('蔵干通変星：時柱', async () => {
    const zoukanTsuhensei = new ZoukanTsuhensei(new Zoukan(await getKanshiInstance(date)))
    expect(zoukanTsuhensei.時柱).toMatchObject({ honki: '正財', chuki: '-', yoki: '正官' })
  })
})
