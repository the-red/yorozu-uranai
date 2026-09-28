import { expect } from 'vitest'
// 小数を比較するときの桁数（toBeCloseToのnumDigits）
// 差が 0.000005 未満なら一致とみなす
export const NUM_DIGITS = 5

// オブジェクトや配列に含まれる数値を、まとめてtoBeCloseToで比較する
// NOTE: expect.closeTo() だと数値ごとに書く必要があるので、期待値をそのまま渡せるように用意している
export const expectToBeCloseTo = (received: unknown, expected: unknown, path: string = 'received') => {
  if (typeof expected === 'number') {
    try {
      // NOTE: VitestのtoBeCloseToは、数値に変換できる文字列を渡しても失敗しないので、先に型を確認する
      expect(typeof received).toEqual('number')
      expect(received).toBeCloseTo(expected, NUM_DIGITS)
    } catch (e) {
      // どの項目で失敗したか分かるようにする
      throw new Error(`${path}\n\n${(e as Error).message}`)
    }
    return
  }

  if (Array.isArray(expected)) {
    expect(received).toHaveLength(expected.length)
    expected.forEach((value, i) => expectToBeCloseTo((received as unknown[])[i], value, `${path}[${i}]`))
    return
  }

  if (typeof expected === 'object' && expected !== null) {
    expect(Object.keys(received as object).sort()).toEqual(Object.keys(expected).sort())
    Object.entries(expected).forEach(([key, value]) =>
      expectToBeCloseTo((received as Record<string, unknown>)[key], value, `${path}.${key}`)
    )
    return
  }

  expect(received).toEqual(expected)
}
