import { Numerology } from '../../src/numerology/models/Numerology'

describe('Numerology', () => {
  describe('通常のテスト', () => {
    const numerology = new Numerology({ birthDate: new Date('1970-10-31'), fullName: 'SUHI KAZUYA', maxSameNumber: 22 })
    it('life path number', () => {
      expect(numerology.lifePathNumber).toEqual(22)
    })
    it('destiny number', () => {
      expect(numerology.destinyNumber).toEqual(7)
    })
    it('soul number', () => {
      expect(numerology.soulNumber).toEqual(8)
    })
    it('personality number', () => {
      expect(numerology.personalityNumber).toEqual(8)
    })
    it('maturity number', () => {
      expect(numerology.maturityNumber).toEqual(29)
    })
    it('birthday number', () => {
      expect(numerology.birthdayNumber).toEqual(4)
    })
  })
  describe('ゾロの最大値設定のテスト', () => {
    // MEMO:
    // 初回の合計値が 1, 2, 100 になる文字列を使って、fullName から計算される destinyNumber でテストをする
    const one = 'A'
    const ten = 'AI'
    const hundred = ten.repeat(10)

    it('ゾロ目なし', () => {
      expect(new Numerology({ birthDate: new Date(), fullName: one + ten }).destinyNumber).toEqual(2)
    })
    describe('最大値: 22', () => {
      it('22 = 22', () => {
        expect(
          new Numerology({ birthDate: new Date(), fullName: (one + ten).repeat(2), maxSameNumber: 22 }).destinyNumber
        ).toEqual(22)
      })
      it('33 = 6', () => {
        expect(
          new Numerology({ birthDate: new Date(), fullName: (one + ten).repeat(3), maxSameNumber: 22 }).destinyNumber
        ).toEqual(6)
      })
    })
    describe('最大値: 99', () => {
      it('99 = 99', () => {
        expect(
          new Numerology({ birthDate: new Date(), fullName: (one + ten).repeat(9), maxSameNumber: 99 }).destinyNumber
        ).toEqual(99)
      })
      it('111 = 3', () => {
        expect(
          new Numerology({ birthDate: new Date(), fullName: one + ten + hundred, maxSameNumber: 99 }).destinyNumber
        ).toEqual(3)
      })
    })
  })
})
