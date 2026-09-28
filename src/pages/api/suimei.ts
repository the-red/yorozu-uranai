import type { NextApiRequest, NextApiResponse } from 'next'
import { julday, equationOfTime as calcEquationOfTime } from '../../astronomy'
import {
  ErrorJson,
  SuimeiJson,
  allowGet,
  pageUrl,
  sendCalculationFailed,
  sendInvalidQuery,
  sendResult,
} from '../../lib/json-api'
import { SuimeiInput, parseSuimeiQuery, toDateTime } from '../../lib/json-query'
import { SuimeiRaw, restoreKanshi, toSuimeiResult } from '../../suimei/models'
import { generateDaiun } from '../../suimei/models/Daiun'
import { generateSaiun } from '../../suimei/models/Saiun'
import { getSekkiPair } from '../../suimei/models/SekkiUtil'

// 歳運の範囲（最初の年と最後の年）
const saiunYears = (birthYear: number, thisYear: number | null): [number, number] =>
  thisYear == null
    ? [birthYear, birthYear + 120]
    : [Math.max(thisYear - 5, birthYear), Math.max(thisYear, birthYear) + 10]

const calc = async (input: SuimeiInput) => {
  // 出生地の暦で計算する
  const dateTime = toDateTime(input)
  const birthday = dateTime.toJSDate()

  const raw: SuimeiRaw = {
    sekkiPair: await getSekkiPair(dateTime),
    equationOfTime: await calcEquationOfTime(await julday(birthday)),
  }
  const { sekkiPair } = raw
  // ページと同じく、材料から復元したモデルを変換する
  const { solarTime, kanshi } = restoreKanshi(dateTime, input.lng, raw)

  // NOTE: 現在の年は、閲覧者の現在地で判定したいので、サーバーの時計は使わない。
  // 受け取っていなければ、どの行も「現在」にならないようにNaNにする
  const thisYear = input.thisYear ?? NaN
  const daiun = await generateDaiun(birthday, dateTime, input.gender, sekkiPair, thisYear, solarTime.dateTime)
  const saiun = generateSaiun(kanshi, dateTime, sekkiPair, thisYear, ...saiunYears(dateTime.year, input.thisYear))

  const hasThisYear = input.thisYear != null
  return { raw, result: toSuimeiResult({ sekkiPair, solarTime, kanshi, daiun, saiun, hasThisYear }) }
}

const suimei = async (req: NextApiRequest, res: NextApiResponse<SuimeiJson | ErrorJson>) => {
  if (!allowGet(req, res)) return

  const parsed = parseSuimeiQuery(req.query)
  if (!parsed.ok) {
    return sendInvalidQuery(res, parsed.error)
  }
  const { input } = parsed

  try {
    const { raw, result } = await calc(input)
    sendResult(res, { type: 'suimei', input, page: pageUrl(req, '/suimei', input), raw, result })
  } catch (e) {
    sendCalculationFailed(res, e)
  }
}

export default suimei
