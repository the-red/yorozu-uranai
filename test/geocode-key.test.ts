import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'
import type { NextApiRequest, NextApiResponse } from 'next'

// Google に送るリクエストを記録する
const requests: { params: { key: string } }[] = []
vi.mock('@googlemaps/google-maps-services-js', async (importOriginal) => ({
  ...(await importOriginal<typeof import('@googlemaps/google-maps-services-js')>()),
  Client: class {
    async reverseGeocode(request: { params: { key: string } }) {
      requests.push(request)
      return { data: { results: [] } }
    }
  },
}))

import geocode from '../src/pages/api/geocode'

const call = async () => {
  const res = { status: () => res, json: () => {} }
  await geocode({ body: { lat: 35.68, lng: 139.76 } } as NextApiRequest, res as unknown as NextApiResponse)
}

describe('/api/geocode のAPIキー', () => {
  beforeEach(() => {
    requests.length = 0
    vi.stubEnv('GOOGLE_GEOCODING_API_KEY', 'server-only-key')
    vi.stubEnv('NEXT_PUBLIC_GOOGLE_GEOCODING_API_KEY', 'public-key')
  })
  afterEach(() => {
    vi.unstubAllEnvs()
  })

  it('ブラウザに公開しない環境変数から読む', async () => {
    // NOTE: NEXT_PUBLIC_ で始まる環境変数は、ブラウザ側のコードで参照すると、配信するJavaScriptに値が入る
    await call()
    expect(requests.map((_) => _.params.key)).toEqual(['server-only-key'])
  })
})
