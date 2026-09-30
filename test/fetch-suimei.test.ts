import { describe, it, expect, vi, afterEach } from 'vitest'
import { Settings } from 'luxon'
import { fetchSuimei } from '../src/lib/fetch-suimei'
import { JsonApiError } from '../src/lib/fetch-json'
import type { SuimeiJson } from '../src/lib/json-api'
import type { FormValues } from '../src/hooks/useYorozuUranaiForm'

// 1987-09-08 08:53 札幌生まれ
const formValues: FormValues = {
  date: '1987-09-08',
  time: '08:53',
  zone: 'Asia/Tokyo',
  timeUnknown: false,
  lat: 43.06,
  lng: 141.35,
  gender: 'woman',
  house: 'placidus',
  address: '北海道札幌市',
}

// /suimei.json の応答のうち、ページが使う部分
const json = {
  type: 'suimei',
  input: {
    date: '1987-09-08',
    time: '08:53',
    timeUnknown: false,
    zone: 'Asia/Tokyo',
    lat: 43.06,
    lng: 141.35,
    gender: 'woman',
    thisYear: 2026,
  },
  page: 'https://yorozu-uranai.com/suimei?date=19870908',
  raw: { sekkiPair: { today: '立秋', endOfMonth: '白露' }, equationOfTime: 2.05 },
  result: {
    大運: [
      {
        fromAge: 0,
        toAge: 0,
        current: false,
        干支: '戊申',
        天干: '戊',
        地支: '申',
        通変星: '偏印',
        蔵干: '庚',
        蔵干通変星: '比肩',
        十二運: '建禄',
      },
      {
        fromAge: 31,
        toAge: 40,
        current: true,
        干支: '壬子',
        天干: '壬',
        地支: '子',
        通変星: '食神',
        蔵干: '癸',
        蔵干通変星: '傷官',
        十二運: '死',
      },
    ],
  },
} as unknown as SuimeiJson

const stubFetch = (response: () => Response) => {
  const fetch = vi.fn(async (_url: string) => response())
  vi.stubGlobal('fetch', fetch)
  return fetch
}
const toQuery = (url: string) => Object.fromEntries(new URL(url, 'https://yorozu-uranai.com').searchParams)

describe('四柱推命のJSONを取得して、モデルを復元する', () => {
  afterEach(() => {
    vi.unstubAllGlobals()
    Settings.now = () => Date.now()
    Settings.defaultZone = 'system'
  })

  it('材料から、干支と真太陽時を復元する', async () => {
    stubFetch(() => Response.json(json))
    const { dateTime, sekkiPair, solarTime, kanshi } = await fetchSuimei(formValues)

    expect(dateTime.toISO()).toEqual('1987-09-08T08:53:00.000+09:00')
    expect(dateTime.zoneName).toEqual('Asia/Tokyo')
    expect(sekkiPair).toEqual({ today: '立秋', endOfMonth: '白露' })
    expect(solarTime.dateTime.toFormat('yyyy-MM-dd HH:mm')).toEqual('1987-09-08 09:20')
    expect([kanshi.年柱, kanshi.月柱, kanshi.日柱, kanshi.時柱]).toEqual(['丁卯', '戊申', '庚申', '辛巳'])
  })

  it('大運は、JSONの結果を画面で使う形にする', async () => {
    stubFetch(() => Response.json(json))
    const { daiun } = await fetchSuimei(formValues)

    expect(daiun).toEqual([
      {
        fromAge: 0,
        toAge: 0,
        thisYear: false,
        kanshi: '戊申',
        tenkan: '戊',
        tishi: '申',
        tenkanTsuhensei: '偏印',
        zoukan: '庚',
        zoukanTsuhensei: '比肩',
        juuniun: '建禄',
      },
      {
        fromAge: 31,
        toAge: 40,
        thisYear: true,
        kanshi: '壬子',
        tenkan: '壬',
        tishi: '子',
        tenkanTsuhensei: '食神',
        zoukan: '癸',
        zoukanTsuhensei: '傷官',
        juuniun: '死',
      },
    ])
  })

  it('フォームの値を、クエリにして送る', async () => {
    const fetch = stubFetch(() => Response.json(json))
    await fetchSuimei(formValues)

    expect(fetch).toHaveBeenCalledTimes(1)
    expect(fetch.mock.calls[0][0].startsWith('/suimei.json?')).toEqual(true)
    expect(toQuery(fetch.mock.calls[0][0])).toMatchObject({
      date: '19870908',
      time: '0853',
      zone: 'Asia/Tokyo',
      lat: '43.06',
      lng: '141.35',
      gender: 'woman',
    })
  })

  describe('現在の年', () => {
    // NOTE: テストを実行する年と重ならないように、先の年を使う
    it('閲覧者の時計の年を送る', async () => {
      Settings.now = () => new Date('2040-06-15T00:00:00Z').getTime()
      const fetch = stubFetch(() => Response.json(json))
      const { thisYear } = await fetchSuimei(formValues)

      expect(thisYear).toEqual(2040)
      expect(toQuery(fetch.mock.calls[0][0]).thisYear).toEqual('2040')
    })
    it('年の変わり目は、閲覧者の現在地の年にする', async () => {
      // UTCでは 2040-12-31 12:00。日付変更線のすぐ西（UTC+14）では、すでに 2041年
      Settings.now = () => new Date('2040-12-31T12:00:00Z').getTime()
      const fetch = stubFetch(() => Response.json(json))

      Settings.defaultZone = 'Pacific/Kiritimati'
      expect((await fetchSuimei(formValues)).thisYear).toEqual(2041)
      Settings.defaultZone = 'America/New_York'
      expect((await fetchSuimei(formValues)).thisYear).toEqual(2040)
      expect(fetch.mock.calls.map(([url]) => toQuery(url).thisYear)).toEqual(['2041', '2040'])
    })
  })

  it('エラーの応答は、例外にする', async () => {
    const error = { code: 'calculation_failed', message: 'This date cannot be calculated', params: ['date'] }
    stubFetch(() => Response.json({ error }, { status: 400 }))
    await expect(fetchSuimei(formValues)).rejects.toBeInstanceOf(JsonApiError)
  })
})
