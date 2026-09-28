import type { NextApiRequest, NextApiResponse } from 'next'
import type { HoroscopeProps, HoroscopeResult } from '../horoscope/models'
import type { NumerologyResult } from '../numerology/models/json'
import type { SuimeiRaw, SuimeiResult } from '../suimei/models'
import { HoroscopeInput, InvalidQuery, NumerologyInput, SuimeiInput, toPageQuery } from './json-query'

// JSON APIのレスポンス
// NOTE: 形式は試験的なもので、今後変わることがある
type UranaiJson<Type extends string, Input, Raw, Result> = {
  type: Type
  input: Input
  page: string // 同じ結果を表示するページのURL
  raw: Raw // 天文計算の結果。ページはここからモデルを復元する
  result: Result // モデルから求めた結果
}
export type HoroscopeJson = UranaiJson<'horoscope', HoroscopeInput, HoroscopeProps, HoroscopeResult>
export type SuimeiJson = UranaiJson<'suimei', SuimeiInput, SuimeiRaw, SuimeiResult>
export type NumerologyJson = UranaiJson<'numerology', NumerologyInput, null, NumerologyResult>

export type ErrorCode = 'invalid_query' | 'calculation_failed' | 'method_not_allowed'
export type ErrorJson = {
  error: {
    code: ErrorCode
    message: string
    params: string[] // 問題のあるパラメータ。invalid_query 以外では空
  }
}

// GET以外には405を返す。GETならtrue
export const allowGet = (req: NextApiRequest, res: NextApiResponse<ErrorJson>): boolean => {
  if (req.method === 'GET') {
    return true
  }
  res.setHeader('Allow', 'GET')
  sendError(res, 405, { code: 'method_not_allowed', message: 'Use GET', params: [] })
  return false
}

export const sendResult = <T>(res: NextApiResponse<T>, json: T) => {
  // 結果は入力だけで決まるので、CDNにキャッシュさせる
  res.setHeader('Cache-Control', 'public, max-age=0, s-maxage=86400')
  res.setHeader('X-Robots-Tag', 'noindex')
  res.status(200).json(json)
}

export const sendError = (res: NextApiResponse<ErrorJson>, status: number, error: ErrorJson['error']) => {
  res.setHeader('Cache-Control', 'no-store')
  res.setHeader('X-Robots-Tag', 'noindex')
  res.status(status).json({ error })
}

export const sendInvalidQuery = (res: NextApiResponse<ErrorJson>, error: InvalidQuery) => sendError(res, 400, error)

export const sendCalculationFailed = (res: NextApiResponse<ErrorJson>, e: unknown) =>
  sendError(res, 400, {
    code: 'calculation_failed',
    message: e instanceof Error ? e.message : String(e),
    params: [],
  })

// 同じ結果を表示するページのURL
export const pageUrl = (req: NextApiRequest, pathname: string, input: Parameters<typeof toPageQuery>[0]): string => {
  const { host } = req.headers
  // NOTE: Vercelでは、利用者が使ったプロトコルが x-forwarded-proto で届く
  const proto = [req.headers['x-forwarded-proto']].flat()[0]?.split(',')[0] ?? 'https'
  const origin = host ? `${proto}://${host}` : ''
  return `${origin}${pathname}?${new URLSearchParams(toPageQuery(input))}`
}
