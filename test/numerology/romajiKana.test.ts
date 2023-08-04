import { convertKanaToRomaji } from '../../src/numerology/models/romajiKana'

describe('convertHiraganaToRomagi', () => {
  describe('五十音と撥音（ん）', () => {
    it('３文字', () => {
      const hiraganaString = 'こよみ'
      const romajiString = 'KOYOMI'
      expect(convertKanaToRomaji(hiraganaString)).toEqual(romajiString)
    })
    it('長い文字', () => {
      const hiraganaString = 'にわにはにわのにわとり'
      const romajiString = 'niwanihaniwanoniwatori'.toUpperCase()
      expect(convertKanaToRomaji(hiraganaString)).toEqual(romajiString)
    })
    it('わをん', () => {
      const hiraganaString = 'わをん'
      const romajiString = 'wawon'.toUpperCase()
      expect(convertKanaToRomaji(hiraganaString)).toEqual(romajiString)
    })
    it('「ち」"chi"、「つ」"tsu"', () => {
      const hiraganaString = 'たちつてと'
      const romajiString = 'tachitsuteto'.toUpperCase()
      expect(convertKanaToRomaji(hiraganaString)).toEqual(romajiString)
    })
    it('はひふへほ', () => {
      const hiraganaString = 'はひふへほ'
      const romajiString = 'hahifuheho'.toUpperCase()
      expect(convertKanaToRomaji(hiraganaString)).toEqual(romajiString)
    })
  })
  describe('拗音、促音', () => {
    it('文章中の拗音、促音', () => {
      const hiraganaString = 'とうきょうとっきょきょかきょく'
      const romajiString = 'toukyoutokkyokyokakyoku'.toUpperCase()
      expect(convertKanaToRomaji(hiraganaString)).toEqual(romajiString)
    })
  })
  describe('濁点付き', () => {
    it('「ば」「が」', () => {
      const hiraganaString = 'ばすがすばくはつ'
      const romajiString = 'basugasubakuhatsu'.toUpperCase()
      expect(convertKanaToRomaji(hiraganaString)).toEqual(romajiString)
    })
    it('ばびぶべぼ', () => {
      const hiraganaString = 'ばびぶべぼ'
      const romajiString = 'babibubebo'.toUpperCase()
      expect(convertKanaToRomaji(hiraganaString)).toEqual(romajiString)
    })
    it('がぎぐげご', () => {
      const hiraganaString = 'がぎぐげご'
      const romajiString = 'gagigugego'.toUpperCase()
      expect(convertKanaToRomaji(hiraganaString)).toEqual(romajiString)
    })
    it('だぢづでど', () => {
      // TODO: 「ぢ」、「づ」のローマ字変換は実際の値と異なるので検討する
      const hiraganaString = 'だぢづでど'
      const romajiString = 'dadjidzudedo'.toUpperCase()
      expect(convertKanaToRomaji(hiraganaString)).toEqual(romajiString)
    })
  })

  describe('半濁点つき', () => {
    it('ぱぴぷぺぽ', () => {
      const hiraganaString = 'ぱぴぷぺぽ'
      const romajiString = 'papipupepo'.toUpperCase()
      expect(convertKanaToRomaji(hiraganaString)).toEqual(romajiString)
    })
    it('「ポッポ」', () => {
      const hiraganaString = 'ぽっぽ'
      const romajiString = 'poppo'.toUpperCase()
      expect(convertKanaToRomaji(hiraganaString)).toEqual(romajiString)
    })
  })
})

describe('空白文字はすべて半角に統一', () => {
  it('全角スペース', () => {
    const hiraganaString = 'やまだ　たろう'
    const romajiString = 'YAMADA TAROU'
    expect(convertKanaToRomaji(hiraganaString)).toEqual(romajiString)
  })
  it('タブ文字', () => {
    const hiraganaString = 'やまだ\tはなこ'
    const romajiString = 'YAMADA HANAKO'
    expect(convertKanaToRomaji(hiraganaString)).toEqual(romajiString)
  })
})

describe('未入力対応', () => {
  it('undefined', () => {
    const hiraganaString = undefined
    const romajiString = ''
    expect(convertKanaToRomaji(hiraganaString)).toEqual(romajiString)
  })
  it('ブランク', () => {
    const hiraganaString = ''
    const romajiString = ''
    expect(convertKanaToRomaji(hiraganaString)).toEqual(romajiString)
  })
})
