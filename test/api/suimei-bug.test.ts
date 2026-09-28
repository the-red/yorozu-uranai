import { describe, it, expect, vi } from 'vitest'
import suimei from '../../src/pages/api/suimei'
import { get } from './test-util'

// 天文計算のあとの処理で、プログラムの不具合が起きた場合を再現する
vi.mock('../../src/suimei/models', async (importOriginal) => ({
  ...(await importOriginal<typeof import('../../src/suimei/models')>()),
  toSuimeiResult: () => {
    throw new TypeError('bug')
  },
}))

describe('/suimei.json: プログラムの不具合', () => {
  it('入力の問題として返さない', async () => {
    // 400 を返すと、利用者は入力を直そうとするが、直しようがない。例外のままにして 500 にする
    const query = { date: '19870908', time: '0853', zone: 'Asia/Tokyo', lng: '141.35', gender: 'woman' }
    await expect(get(suimei, query)).rejects.toThrow('bug')
  })
})
