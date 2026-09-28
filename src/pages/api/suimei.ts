import type { NextApiRequest, NextApiResponse } from 'next'
import type { DateTime } from 'luxon'
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
import { Daiun, generateDaiun } from '../../suimei/models/Daiun'
import { generateSaiun } from '../../suimei/models/Saiun'
import { getSekkiPair } from '../../suimei/models/SekkiUtil'

// NOTE: 現在の年は、閲覧者の現在地で判定したいので、サーバーの時計は使わない。
// 受け取っていなければ、どの行も「現在」にならないようにNaNにする
const toThisYear = ({ thisYear }: SuimeiInput) => thisYear ?? NaN

// 歳運の範囲（最初の年と最後の年）
const saiunYears = (birthYear: number, thisYear: number | null): [number, number] =>
  thisYear == null
    ? [birthYear, birthYear + 120]
    : [Math.max(thisYear - 5, birthYear), Math.max(thisYear, birthYear) + 10]

// 天文計算が必要な部分
const calcAstronomy = async (input: SuimeiInput, dateTime: DateTime): Promise<{ raw: SuimeiRaw; daiun: Daiun[] }> => {
  const birthday = dateTime.toJSDate()

  const raw: SuimeiRaw = {
    sekkiPair: await getSekkiPair(dateTime),
    equationOfTime: await calcEquationOfTime(await julday(birthday)),
  }
  const { solarTime } = restoreKanshi(dateTime, input.lng, raw)
  const daiun = await generateDaiun(
    birthday,
    dateTime,
    input.gender,
    raw.sekkiPair,
    toThisYear(input),
    solarTime.dateTime
  )
  return { raw, daiun }
}

const suimei = async (req: NextApiRequest, res: NextApiResponse<SuimeiJson | ErrorJson>) => {
  if (!allowGet(req, res)) return

  const parsed = parseSuimeiQuery(req.query)
  if (!parsed.ok) {
    return sendInvalidQuery(res, parsed.error)
  }
  const { input } = parsed

  // 出生地の暦で計算する
  const dateTime = toDateTime(input)

  let astronomy: Awaited<ReturnType<typeof calcAstronomy>>
  try {
    astronomy = await calcAstronomy(input, dateTime)
  } catch (e) {
    return sendCalculationFailed(res, e)
  }
  const { raw, daiun } = astronomy
  const { sekkiPair } = raw

  // ページと同じく、材料から復元したモデルを変換する
  const { solarTime, kanshi } = restoreKanshi(dateTime, input.lng, raw)
  const years = saiunYears(dateTime.year, input.thisYear)
  const saiun = generateSaiun(kanshi, dateTime, sekkiPair, toThisYear(input), ...years)
  const hasThisYear = input.thisYear != null
  const result = toSuimeiResult({ sekkiPair, solarTime, kanshi, daiun, saiun, hasThisYear })

  sendResult(res, { type: 'suimei', input, page: pageUrl(req, '/suimei', input), raw, result })
}

export default suimei
