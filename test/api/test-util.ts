import type { NextApiHandler, NextApiRequest, NextApiResponse } from 'next'

type Options = {
  method?: string
  headers?: Record<string, string>
}

// APIのハンドラーを直接呼ぶ
export const get = async (
  handler: NextApiHandler,
  query: Record<string, string | string[]>,
  { method = 'GET', headers = { host: 'yorozu-uranai.com' } }: Options = {}
) => {
  let status: number | undefined
  let json: any
  const sent: Record<string, string> = {}
  const res = {
    setHeader(name: string, value: string) {
      sent[name.toLowerCase()] = value
      return res
    },
    status(code: number) {
      status = code
      return res
    },
    json(data: unknown) {
      // 実際の応答と同じように、JSONを経由させる
      json = JSON.parse(JSON.stringify(data))
    },
  }
  await handler({ method, query, headers } as unknown as NextApiRequest, res as unknown as NextApiResponse)
  return { status, json, headers: sent }
}
