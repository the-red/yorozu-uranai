import { convertHiraganaToRomagi } from '../../src/numerology/romajiKana'

describe('convertHiraganaToRomagi', () => {
  describe('五十音と撥音（ん）', () => {
    it('３文字', () => {
      expect(convertHiraganaToRomagi('こよみ')).toEqual('koyomi')
    })
    it('長い文字', () => {
      const hiraganaString = 'にわにはにわのにわとり'
      const romajiString = 'niwanihaniwanoniwatori'
      expect(convertHiraganaToRomagi(hiraganaString)).toEqual(romajiString)
    })
    it('わをん', () => {
      const hiraganaString = 'わをん'
      const romajiString = 'wawon'
      expect(convertHiraganaToRomagi(hiraganaString)).toEqual(romajiString)
    })
    it('「ち」"chi"、「つ」"tsu"', () => {
      const hiraganaString = 'たちつてと'
      const romajiString = 'tachitsuteto'
      expect(convertHiraganaToRomagi(hiraganaString)).toEqual(romajiString)
    })
    it('はひふへほ', () => {
      const hiraganaString = 'はひふへほ'
      const romajiString = 'hahihuheho'
      expect(convertHiraganaToRomagi(hiraganaString)).toEqual(romajiString)
    })
  })
  describe('拗音、促音', () => {
    it('ゃゅょ', () => {
      const hiraganaString = 'ゃゅょ'
      const romajiString = 'lyalyulyo'
      expect(convertHiraganaToRomagi(hiraganaString)).toEqual(romajiString)
    })
    it('っ', () => {
      const hiraganaString = 'っ'
      const romajiString = 'ltu'
      expect(convertHiraganaToRomagi(hiraganaString)).toEqual(romajiString)
    })
    it('ぁぃぅぇぉ', () => {
      const hiraganaString = 'ぁぃぅぇぉ'
      const romajiString = 'lalilulelo'
      expect(convertHiraganaToRomagi(hiraganaString)).toEqual(romajiString)
    })
    it('文章中の拗音、促音', () => {
      const hiraganaString = 'とうきょうとっきょきょかきょく'
      const romajiString = 'toukyoutokkyokyokakyoku'
      expect(convertHiraganaToRomagi(hiraganaString)).toEqual(romajiString)
    })
  })
  describe('濁点付き', () => {
    it('「ば」「が」', () => {
      const hiraganaString = 'ばすがすばくはつ'
      const romajiString = 'basugasubakuhatu'
      expect(convertHiraganaToRomagi(hiraganaString)).toEqual(romajiString)
    })
    it('ばびぶべぼ', () => {
      const hiraganaString = 'ばびぶべぼ'
      const romajiString = 'babibubebo'
      expect(convertHiraganaToRomagi(hiraganaString)).toEqual(romajiString)
    })
    it('がぎぐげご', () => {
      const hiraganaString = 'がぎぐげご'
      const romajiString = 'gagigugego'
      expect(convertHiraganaToRomagi(hiraganaString)).toEqual(romajiString)
    })
    it('だぢづでど', () => {
      const hiraganaString = 'だぢづでど'
      const romajiString = 'dadidudedo'
      expect(convertHiraganaToRomagi(hiraganaString)).toEqual(romajiString)
    })
  })

  describe('半濁点つき', () => {
    it('ぱぴぷぺぽ', () => {
      const hiraganaString = 'ぱぴぷぺぽ'
      const romajiString = 'papipupepo'
      expect(convertHiraganaToRomagi(hiraganaString)).toEqual(romajiString)
    })
    it('「ポッポ」', () => {
      const hiraganaString = 'ぽっぽ'
      const romajiString = 'poltupo'
      expect(convertHiraganaToRomagi(hiraganaString)).toEqual(romajiString)
    })
  })
})
