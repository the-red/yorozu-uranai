import type { NextApiRequest, NextApiResponse } from 'next'
import {
  DEFAULT_VISIBILITY,
  HOUSE_SYSTEM_CODES,
  Horoscope,
  HoroscopeProps,
  toHoroscopeResult,
  toSettingsHash,
} from '../../horoscope/models'
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
    raw = await getHoroscopeProps(toDateTime(input).toJSDate(), input.lat, input.lng, HOUSE_SYSTEM_CODES[input.house])
  } catch (e) {
    return sendCalculationFailed(res, e)
  }

  sendResult(res, {
    type: 'horoscope',
    input,
    // NOTE: ページは、アスペクトの求め方を、ハッシュで受け取る
    page: pageUrl(req, '/horoscope', input, toSettingsHash({ visibility: DEFAULT_VISIBILITY, aspects: input.aspects })),
    raw,
    // ページと同じく、材料から復元したモデルを変換する
    result: toHoroscopeResult(new Horoscope(raw), input.aspects, input.house),
  })
}

export default horoscope
