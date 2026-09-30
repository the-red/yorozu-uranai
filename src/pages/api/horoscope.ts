import type { NextApiRequest, NextApiResponse } from 'next'
import { Horoscope, HoroscopeProps, toHoroscopeResult } from '../../horoscope/models'
import { getHoroscopeProps } from '../../horoscope/models/horoscopeFactory'
import {
  ErrorJson,
  HoroscopeJson,
  allowGet,
  pageUrl,
  sendCalculationFailed,
  sendInvalidQuery,
  sendResult,
} from '../../lib/json-api'
import { parseHoroscopeQuery, toDateTime } from '../../lib/json-query'

const horoscope = async (req: NextApiRequest, res: NextApiResponse<HoroscopeJson | ErrorJson>) => {
  if (!allowGet(req, res)) return

  const parsed = parseHoroscopeQuery(req.query)
  if (!parsed.ok) {
    return sendInvalidQuery(res, parsed.error)
  }
  const { input } = parsed

  let raw: HoroscopeProps
  try {
    raw = await getHoroscopeProps(toDateTime(input).toJSDate(), input.lat, input.lng)
  } catch (e) {
    return sendCalculationFailed(res, e)
  }

  sendResult(res, {
    type: 'horoscope',
    input,
    page: pageUrl(req, '/horoscope', input),
    raw,
    // ページと同じく、材料から復元したモデルを変換する
    result: toHoroscopeResult(new Horoscope(raw), input.aspects),
  })
}

export default horoscope
