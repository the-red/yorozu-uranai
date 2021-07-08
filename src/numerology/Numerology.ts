export class Numerology {
  birthDate: Date
  firstName: string
  lastName: string

  private VOWELS = 'AIUEO'

  constructor({ birthDate, firstName, lastName }: { birthDate: Date; firstName: string; lastName: string }) {
    this.birthDate = birthDate
    this.firstName = firstName
    this.lastName = lastName
  }

  get YYYY() {
    return String(this.birthDate.getFullYear()).padStart(4, '0')
  }

  get MM() {
    return String(this.birthDate.getMonth() + 1).padStart(2, '0')
  }

  get DD() {
    return String(this.birthDate.getDate()).padStart(2, '0')
  }

  get fullName() {
    return this.firstName + this.lastName
  }

  // 生年月日が対象
  lifePathNumber(nums?: number[]): number {
    const digits = [...this.YYYY.split(''), ...this.MM.split(''), ...this.DD.split('')].map((v) => Number(v))
    return this.sumOfDigits(digits)
  }

  // ローマ字表記の名前を数字に置き換えたものが対象
  // （ピュタゴリアン変換）。ABC...IJ... -> 123...91...
  destinyNumber(): number {
    const digits = [...this.fullName.toUpperCase().split('')]
      .map((v) => v.charCodeAt(0) - 'A'.charCodeAt(0) + 1)
      .map((v) => v % 9 || 9)
    return this.sumOfDigits(digits)
  }

  // ローマ字表記の名前の母音を数字に置き換えたものが対象
  soulNumber(): number {
    const digits = [...this.fullName.toUpperCase().split('')]
      .filter((v) => this.VOWELS.includes(v))
      .map((v) => v.charCodeAt(0) - 'A'.charCodeAt(0) + 1)
      .map((v) => v % 9 || 9)
    return this.sumOfDigits(digits)
  }

  // ローマ字表記の名前の子音を数字に置き換えたものが対象
  personalityNumber(): number {
    const digits = [...this.fullName.toUpperCase().split('')]
      .filter((v) => !this.VOWELS.includes(v))
      .map((v) => v.charCodeAt(0) - 'A'.charCodeAt(0) + 1)
      .map((v) => v % 9 || 9)
    return this.sumOfDigits(digits)
  }

  maturityNumber(): number {
    return this.lifePathNumber() + this.destinyNumber()
  }

  birthdayNumber(): number {
    return this.sumOfDigits(this.DD.split('').map((v) => Number(v)))
  }

  private sumOfDigits(digits: number[]): number {
    const sum = digits.reduce((prev, curr) => prev + curr, 0)
    if (sum % 11 === 0 || sum % 111 === 0 || Math.floor(sum / 10) === 0) return sum
    return this.sumOfDigits([Math.floor(sum / 10), sum % 10])
  }
}
