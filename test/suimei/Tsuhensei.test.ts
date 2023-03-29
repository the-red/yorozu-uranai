import { calcTsuhensei, Tsuhensei } from '../../src/suimei/Tsuhensei'
import { getKanshiInstance } from './test-util'

describe('calcTsuhensei', () => {
  describe('通変星の算出：日干のindexが偶数', () => {
    it('差が0のときは比肩になる', () => {
      expect(calcTsuhensei('甲', '甲')).toEqual('比肩')
      expect(calcTsuhensei('丙', '丙')).toEqual('比肩')
      expect(calcTsuhensei('戊', '戊')).toEqual('比肩')
      expect(calcTsuhensei('庚', '庚')).toEqual('比肩')
      expect(calcTsuhensei('壬', '壬')).toEqual('比肩')
    })
    it('差が1,-9のときは印綬になる', () => {
      expect(calcTsuhensei('丙', '乙')).toEqual('印綬')
      expect(calcTsuhensei('戊', '丁')).toEqual('印綬')
      expect(calcTsuhensei('庚', '己')).toEqual('印綬')
      expect(calcTsuhensei('壬', '辛')).toEqual('印綬')
      expect(calcTsuhensei('甲', '癸')).toEqual('印綬')
    })
    it('差が2,-8のときは偏印になる', () => {
      expect(calcTsuhensei('甲', '壬')).toEqual('偏印')
      expect(calcTsuhensei('丙', '甲')).toEqual('偏印')
      expect(calcTsuhensei('戊', '丙')).toEqual('偏印')
      expect(calcTsuhensei('庚', '戊')).toEqual('偏印')
      expect(calcTsuhensei('壬', '庚')).toEqual('偏印')
    })
    it('差が3,-7のときは正官になる', () => {
      expect(calcTsuhensei('甲', '辛')).toEqual('正官')
      expect(calcTsuhensei('丙', '癸')).toEqual('正官')
      expect(calcTsuhensei('戊', '乙')).toEqual('正官')
      expect(calcTsuhensei('庚', '丁')).toEqual('正官')
      expect(calcTsuhensei('壬', '己')).toEqual('正官')
    })
    it('差が4,-6のときは偏官になる', () => {
      expect(calcTsuhensei('甲', '庚')).toEqual('偏官')
      expect(calcTsuhensei('丙', '壬')).toEqual('偏官')
      expect(calcTsuhensei('戊', '甲')).toEqual('偏官')
      expect(calcTsuhensei('庚', '丙')).toEqual('偏官')
      expect(calcTsuhensei('壬', '戊')).toEqual('偏官')
    })
    it('差が5,-5のときは正財になる', () => {
      expect(calcTsuhensei('甲', '己')).toEqual('正財')
      expect(calcTsuhensei('丙', '辛')).toEqual('正財')
      expect(calcTsuhensei('戊', '癸')).toEqual('正財')
      expect(calcTsuhensei('庚', '乙')).toEqual('正財')
      expect(calcTsuhensei('壬', '丁')).toEqual('正財')
    })
    it('差が6,-4のときは偏財になる', () => {
      expect(calcTsuhensei('甲', '戊')).toEqual('偏財')
      expect(calcTsuhensei('丙', '庚')).toEqual('偏財')
      expect(calcTsuhensei('戊', '壬')).toEqual('偏財')
      expect(calcTsuhensei('庚', '甲')).toEqual('偏財')
      expect(calcTsuhensei('壬', '丙')).toEqual('偏財')
    })
    it('差が7,-3のときは傷官になる', () => {
      expect(calcTsuhensei('甲', '丁')).toEqual('傷官')
      expect(calcTsuhensei('丙', '己')).toEqual('傷官')
      expect(calcTsuhensei('戊', '辛')).toEqual('傷官')
      expect(calcTsuhensei('庚', '癸')).toEqual('傷官')
      expect(calcTsuhensei('壬', '乙')).toEqual('傷官')
    })
    it('差が8,-2のときは食神になる', () => {
      expect(calcTsuhensei('甲', '丙')).toEqual('食神')
      expect(calcTsuhensei('丙', '戊')).toEqual('食神')
      expect(calcTsuhensei('戊', '庚')).toEqual('食神')
      expect(calcTsuhensei('庚', '壬')).toEqual('食神')
      expect(calcTsuhensei('壬', '甲')).toEqual('食神')
    })
    it('差が9,-1のときは劫財になる', () => {
      expect(calcTsuhensei('甲', '乙')).toEqual('劫財')
      expect(calcTsuhensei('丙', '丁')).toEqual('劫財')
      expect(calcTsuhensei('戊', '己')).toEqual('劫財')
      expect(calcTsuhensei('庚', '辛')).toEqual('劫財')
      expect(calcTsuhensei('壬', '癸')).toEqual('劫財')
    })
  })

  describe('通変星の算出：日干のindexが奇数', () => {
    it('差が0のときは比肩になる', () => {
      expect(calcTsuhensei('乙', '乙')).toEqual('比肩')
      expect(calcTsuhensei('丁', '丁')).toEqual('比肩')
      expect(calcTsuhensei('己', '己')).toEqual('比肩')
      expect(calcTsuhensei('辛', '辛')).toEqual('比肩')
      expect(calcTsuhensei('癸', '癸')).toEqual('比肩')
    })
    it('差が1,-9のときは劫財になる', () => {
      expect(calcTsuhensei('乙', '甲')).toEqual('劫財')
      expect(calcTsuhensei('丁', '丙')).toEqual('劫財')
      expect(calcTsuhensei('己', '戊')).toEqual('劫財')
      expect(calcTsuhensei('辛', '庚')).toEqual('劫財')
      expect(calcTsuhensei('癸', '壬')).toEqual('劫財')
    })
    it('差が2,-8のときは偏印になる', () => {
      expect(calcTsuhensei('乙', '癸')).toEqual('偏印')
      expect(calcTsuhensei('丁', '乙')).toEqual('偏印')
      expect(calcTsuhensei('己', '丁')).toEqual('偏印')
      expect(calcTsuhensei('辛', '己')).toEqual('偏印')
      expect(calcTsuhensei('癸', '辛')).toEqual('偏印')
    })
    it('差が3,-7のときは印綬になる', () => {
      expect(calcTsuhensei('乙', '壬')).toEqual('印綬')
      expect(calcTsuhensei('丁', '甲')).toEqual('印綬')
      expect(calcTsuhensei('己', '丙')).toEqual('印綬')
      expect(calcTsuhensei('辛', '戊')).toEqual('印綬')
      expect(calcTsuhensei('癸', '庚')).toEqual('印綬')
    })
    it('差が4,-6のときは偏官になる', () => {
      expect(calcTsuhensei('乙', '辛')).toEqual('偏官')
      expect(calcTsuhensei('丁', '癸')).toEqual('偏官')
      expect(calcTsuhensei('己', '乙')).toEqual('偏官')
      expect(calcTsuhensei('辛', '丁')).toEqual('偏官')
      expect(calcTsuhensei('癸', '己')).toEqual('偏官')
    })
    it('差が5,-5のときは正官になる', () => {
      expect(calcTsuhensei('乙', '庚')).toEqual('正官')
      expect(calcTsuhensei('丁', '壬')).toEqual('正官')
      expect(calcTsuhensei('己', '甲')).toEqual('正官')
      expect(calcTsuhensei('辛', '丙')).toEqual('正官')
      expect(calcTsuhensei('癸', '戊')).toEqual('正官')
    })
    it('差が6,-4のときは偏財になる', () => {
      expect(calcTsuhensei('乙', '己')).toEqual('偏財')
      expect(calcTsuhensei('丁', '辛')).toEqual('偏財')
      expect(calcTsuhensei('己', '癸')).toEqual('偏財')
      expect(calcTsuhensei('辛', '乙')).toEqual('偏財')
      expect(calcTsuhensei('癸', '丁')).toEqual('偏財')
    })
    it('差が7,-3のときは正財になる', () => {
      expect(calcTsuhensei('乙', '戊')).toEqual('正財')
      expect(calcTsuhensei('丁', '庚')).toEqual('正財')
      expect(calcTsuhensei('己', '壬')).toEqual('正財')
      expect(calcTsuhensei('辛', '甲')).toEqual('正財')
      expect(calcTsuhensei('癸', '丙')).toEqual('正財')
    })
    it('差が8,-2のときは食神になる', () => {
      expect(calcTsuhensei('乙', '丁')).toEqual('食神')
      expect(calcTsuhensei('丁', '己')).toEqual('食神')
      expect(calcTsuhensei('己', '辛')).toEqual('食神')
      expect(calcTsuhensei('辛', '癸')).toEqual('食神')
      expect(calcTsuhensei('癸', '乙')).toEqual('食神')
    })
    it('差が9,-1のときは傷官になる', () => {
      expect(calcTsuhensei('乙', '丙')).toEqual('傷官')
      expect(calcTsuhensei('丁', '戊')).toEqual('傷官')
      expect(calcTsuhensei('己', '庚')).toEqual('傷官')
      expect(calcTsuhensei('辛', '壬')).toEqual('傷官')
      expect(calcTsuhensei('癸', '甲')).toEqual('傷官')
    })
  })
})

describe('Tsuhensei', () => {
  const date = new Date('2023-03-15T11:41:20+09:00')

  it('通変星：年柱', async () => {
    const tsuhensei = new Tsuhensei(await getKanshiInstance(date))
    expect(tsuhensei.年柱).toEqual('劫財')
  })
  it('通変星：月柱', async () => {
    const tsuhensei = new Tsuhensei(await getKanshiInstance(date))
    expect(tsuhensei.月柱).toEqual('傷官')
  })
  it('通変星：時柱', async () => {
    const tsuhensei = new Tsuhensei(await getKanshiInstance(date))
    expect(tsuhensei.時柱).toEqual('偏財')
  })
})
