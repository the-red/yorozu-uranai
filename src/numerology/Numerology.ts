export class Numerology {
  birthDate: Date
  firstName: string
  lastName: string

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

  // 計算方法
  // 1. 生年月日の数字を全部足す（Y+Y+Y+Y+M+M+D+D）
  // 2. その合計が11の倍数（ゾロ目）または一桁なら計算終了。そうでなければ十の位と一の位を足す。
  // 3. 2を繰り返す。
  lifePathNumber(nums?: number[]): number {
    if (!nums) {
      nums = [...this.YYYY.split(''), ...this.MM.split(''), ...this.DD.split('')].map((v) => Number(v))
    }
    const sum = nums.reduce((prev, curr) => prev + curr, 0)
    if (sum % 11 === 0 || Math.floor(sum / 10) === 0) return sum
    return this.lifePathNumber([Math.floor(sum / 10), sum % 10])
  }

  // 計算方法
  // 1. ローマ字表記の名前を数字に置き換える（ピュタゴリアン変換）。ABC...IJ... -> 123...91...
  // 2. 置き換えた数字の合計が11の倍数（ゾロ目）または一桁なら計算終了。そうでなければ十の位と一の位を足す。
  // 3. 2を繰り返す。
  destinyNumber(nums?: number[]): number {
    if (!nums) {
      nums = [...this.fullName.toUpperCase().split('')]
        .map((v) => v.charCodeAt(0) - 'A'.charCodeAt(0) + 1)
        .map((v) => v % 9 || 9)
    }
    const sum = nums.reduce((prev, curr) => prev + curr, 0)
    if (sum % 11 === 0 || Math.floor(sum / 10) === 0) return sum
    return this.destinyNumber([Math.floor(sum / 10), sum % 10])
  }
}
