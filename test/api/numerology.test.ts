import { describe, it, expect } from 'vitest'
import numerology from '../../src/pages/api/numerology'
import { get } from './test-util'

const query = { date: '19701031', name: 'Suhi Kazuya' }

describe('/numerology.json', () => {
  it('コアナンバーを返す', async () => {
    const { status, json, headers } = await get(numerology, query)
    expect(status).toEqual(200)
    expect(json).toEqual({
      type: 'numerology',
      input: { date: '1970-10-31', name: 'SUHI KAZUYA', maxSameNumber: 22 },
      page: 'https://yorozu-uranai.com/numerology?name=SUHI+KAZUYA&date=19701031',
      raw: null,
      result: {
        lifePathNumber: 22,
        destinyNumber: 7,
        soulNumber: 8,
        personalityNumber: 8,
        maturityNumber: 29,
        birthdayNumber: 4,
      },
    })
    expect(headers).toEqual({ 'cache-control': 'public, max-age=0, s-maxage=86400', 'x-robots-tag': 'noindex' })
  })

  it('ページのクエリが付いていても計算できる', async () => {
    const page = { ...query, time: '0853', zone: 'Asia/Tokyo', lat: '43.06', lng: '141.35', gender: 'woman' }
    expect((await get(numerology, page)).json).toEqual((await get(numerology, query)).json)
  })

  describe('エラー', () => {
    it('名前がローマ字でない', async () => {
      const { status, json, headers } = await get(numerology, { ...query, name: '山田太郎' })
      expect(status).toEqual(400)
      expect(json).toEqual({ error: { code: 'invalid_query', message: 'name is invalid', params: ['name'] } })
      expect(headers['cache-control']).toEqual('no-store')
    })
    it('GET以外', async () => {
      const { status, json } = await get(numerology, query, { method: 'POST' })
      expect(status).toEqual(405)
      expect(json.error.code).toEqual('method_not_allowed')
    })
  })
})
