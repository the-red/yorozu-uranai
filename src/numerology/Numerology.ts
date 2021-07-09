export class Numerology {
  birthDate: Date
  fullName: string

  private VOWELS = 'AIUEO'

  constructor({ birthDate, fullName }: { birthDate: Date; fullName: string }) {
    this.birthDate = birthDate
    this.fullName = fullName.replace(/\s+/g, '')
  }

  private get YYYY() {
    return String(this.birthDate.getFullYear()).padStart(4, '0')
  }

  private get MM() {
    return String(this.birthDate.getMonth() + 1).padStart(2, '0')
  }

  private get DD() {
    return String(this.birthDate.getDate()).padStart(2, '0')
  }

  // 生年月日が対象
  get lifePathNumber(): number {
    const digits = [...this.YYYY.split(''), ...this.MM.split(''), ...this.DD.split('')].map((v) => Number(v))
    return this.sumOfDigits(digits)
  }

  // ローマ字表記の名前をピュタゴリアン変換したものが対象
  get destinyNumber(): number {
    const digits = this.fullName.split('').map(this.putagorianConvert)
    return this.sumOfDigits(digits)
  }

  // ローマ字表記の名前の母音をピュタゴリアン変換したものが対象
  get soulNumber(): number {
    const digits = this.fullName
      .split('')
      .filter((v) => this.VOWELS.includes(v))
      .map(this.putagorianConvert)
    return this.sumOfDigits(digits)
  }

  // ローマ字表記の名前の子音をピュタゴリアン変換したものが対象
  get personalityNumber(): number {
    const digits = this.fullName
      .split('')
      .filter((v) => !this.VOWELS.includes(v))
      .map(this.putagorianConvert)
    return this.sumOfDigits(digits)
  }

  get maturityNumber(): number {
    return this.lifePathNumber + this.destinyNumber
  }

  get birthdayNumber(): number {
    return this.sumOfDigits(this.DD.split('').map(Number))
  }

  // 各桁の和を求める。ゾロ目または1桁になるまで再帰的に計算する
  private sumOfDigits(digits: number[]): number {
    const sum = digits.reduce((prev, curr) => prev + curr, 0)
    const nextDigits = String(sum).split('').map(Number)
    if (this.isSameNumberDigits(nextDigits)) return sum
    return this.sumOfDigits(nextDigits)
  }

  // ABC...IJ... -> 123...91... に変換する
  private putagorianConvert(char: string): number {
    const count = char.toUpperCase().charCodeAt(0) - 'A'.charCodeAt(0) + 1
    return count % 9 || 9
  }

  private isSameNumberDigits(digits: number[]) {
    return digits.every((val, _, ary) => val === ary[0], true)
  }
}
