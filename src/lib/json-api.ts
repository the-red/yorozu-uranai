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

// ハウスを計算できなかったときに、src/astronomy が投げるエラーのメッセージ
const HOUSES_ERROR = `Can't calculate houses.`

// 天文計算の失敗。それ以外の例外には使わない（入力を直しても解決しないので、500にする）
export const sendCalculationFailed = (res: NextApiResponse<ErrorJson>, e: unknown) => {
  // NOTE: ライブラリのメッセージは、内部のファイル名やパスを含むので返さない。原因はログに残す
  console.error(e)

  const isHousesError = e instanceof Error && e.message === HOUSES_ERROR
  sendError(res, 400, {
    code: 'calculation_failed',
    message: isHousesError ? 'Houses cannot be calculated at this latitude' : 'This date cannot be calculated',
    params: [],
  })
}

// 同じ結果を表示するページのURL
export const pageUrl = (req: NextApiRequest, pathname: string, input: Parameters<typeof toPageQuery>[0]): string => {
  const { host } = req.headers
  // NOTE: Vercelでは、利用者が使ったプロトコルが x-forwarded-proto で届く
  // ヘッダーの値をそのままURLに入れないように、http でなければ https にする
  const forwarded = [req.headers['x-forwarded-proto']].flat()[0]?.split(',')[0]
  const proto = forwarded === 'http' ? 'http' : 'https'
  const origin = host ? `${proto}://${host}` : ''
  return `${origin}${pathname}?${new URLSearchParams(toPageQuery(input))}`
}
