import type { NextRouter } from 'next/router'
import { useCallback, useMemo } from 'react'
import { HoroscopeSettings, SETTINGS_QUERY_KEYS, parseSettings, toSettingsQuery } from '../horoscope/models'
import { toUrl } from '../lib/url'

// ホロスコープの画面の設定（アスペクトの求め方、表示するもの）。URLのクエリに持たせる
// NOTE: ブラウザには、保存しない。設定を含めて、URLだけで、同じ画面になるようにする
export const useHoroscopeSettings = (
  router: NextRouter
): [HoroscopeSettings, (settings: HoroscopeSettings) => void] => {
  const { query } = router
  const settings = useMemo(() => parseSettings(query), [query])

  const setSettings = useCallback(
    (next: HoroscopeSettings) => {
      // 入力（生年月日と場所など）は、そのまま残す。設定だけを、入れ替える
      const rest = Object.fromEntries(
        Object.entries(router.query).filter(([key]) => !(SETTINGS_QUERY_KEYS as readonly string[]).includes(key))
      )
      // NOTE: shallow で移動する。入力は変わらないので、読み直し（住所の検索と、結果の取得）は走らない。
      // 履歴は増やさない（戻るボタンで、1つずつ戻らなくて済むように）。
      // scroll を false にしないと、画面の先頭に移動する
      router.replace(toUrl(router.pathname, { ...rest, ...toSettingsQuery(next) }), undefined, {
        shallow: true,
        scroll: false,
      })
    },
    [router]
  )
  return [settings, setSettings]
}
