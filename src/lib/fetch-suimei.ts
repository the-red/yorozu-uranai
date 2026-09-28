import { DateTime } from 'luxon'
import type { FormValues } from '../hooks/useYorozuUranaiForm'
import { restoreKanshi, toDaiun } from '../suimei/models'
import { fetchJson } from './fetch-json'
import type { SuimeiJson } from './json-api'
import { toDateTime } from './json-query'

// 四柱推命のJSONを取得して、モデルを復元する
export const fetchSuimei = async (formValues: FormValues) => {
  // 閲覧者の現在地（ブラウザのタイムゾーン）での現在の年
  const thisYear = DateTime.now().year

  const { input, raw, result } = await fetchJson<SuimeiJson>('/suimei', formValues, { thisYear: String(thisYear) })
  const dateTime = toDateTime(input)
  const { solarTime, kanshi } = restoreKanshi(dateTime, input.lng, raw)

  return {
    dateTime,
    thisYear,
    sekkiPair: raw.sekkiPair,
    solarTime,
    kanshi,
    daiun: result.大運.map(toDaiun),
  }
}
