export const assertIntegerInRange = (name: string, value: number, min: number, max: number): void => {
  if (!Number.isInteger(value) || value < min || value > max) {
    throw new RangeError(`${name}は ${min}〜${max} の整数で指定してください: ${value}`)
  }
}
