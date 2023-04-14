import { juuniun } from '../../src/suimei/Juuniun'

describe('Juuniun', () => {
  describe('十二運：日干のindexが偶数', () => {
    it('甲のとき：胎は「酉」', () => {
      expect(juuniun('甲', '酉')).toEqual('胎')
    })
    it('丙のとき：胎になるのは「子」', () => {
      expect(juuniun('丙', '子')).toEqual('胎')
    })
    it('戊のとき：胎になるのは「子」', () => {
      expect(juuniun('戊', '子')).toEqual('胎')
    })
    it('庚のとき：胎になるのは「卯」', () => {
      expect(juuniun('庚', '卯')).toEqual('胎')
    })
    it('壬のとき：胎になるのは「午」', () => {
      expect(juuniun('壬', '午')).toEqual('胎')
    })
  })
  describe('十二運：日干のindexが奇数', () => {
    it('乙のとき：絶は「酉」', () => {
      expect(juuniun('乙', '酉')).toEqual('絶')
    })
    it('丁のとき：胎になるのは「子」', () => {
      expect(juuniun('丁', '子')).toEqual('絶')
    })
    it('己のとき：胎になるのは「子」', () => {
      expect(juuniun('己', '子')).toEqual('絶')
    })
    it('辛のとき：胎になるのは「卯」', () => {
      expect(juuniun('辛', '卯')).toEqual('絶')
    })
    it('癸のとき：胎になるのは「午」', () => {
      expect(juuniun('癸', '午')).toEqual('絶')
    })
  })
  describe('1983/05/17 18:50福岡県生まれ女性の場合', () => {
    it('時柱の十二運：絶', () => {
      expect(juuniun('乙', '酉')).toEqual('絶')
    })
    it('日柱の十二運：沐浴', () => {
      expect(juuniun('乙', '巳')).toEqual('沐浴')
    })
    it('月柱の十二運：沐浴', () => {
      expect(juuniun('乙', '巳')).toEqual('沐浴')
    })
    it('年柱の十二運：死', () => {
      expect(juuniun('乙', '亥')).toEqual('死')
    })
  })
  describe('2000/01/01 00:00東京都新宿区生まれ女性の場合', () => {
    it('時柱の十二運：胎', () => {
      expect(juuniun('戊', '子')).toEqual('胎')
    })
    it('日柱の十二運：帝旺', () => {
      expect(juuniun('戊', '午')).toEqual('帝旺')
    })
    it('月柱の十二運：子', () => {
      expect(juuniun('戊', '子')).toEqual('胎')
    })
    it('年柱の十二運：沐浴', () => {
      expect(juuniun('戊', '卯')).toEqual('沐浴')
    })
  })
})
