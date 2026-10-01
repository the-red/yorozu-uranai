import type { NextRouter } from 'next/router'
import { useCallback, useMemo, useSyncExternalStore } from 'react'
import {
  ASPECT_QUERY_KEYS,
  HoroscopeSettings,
  parseSettings,
  toSettingsHash,
  toSettingsQuery,
} from '../horoscope/models'
import { toUrl } from '../lib/url'

// URLのハッシュ（# の後ろ。無ければ、空の文字列）
export const getHash = (): string => window.location.hash.slice(1)

// ホロスコープの画面の設定。アスペクトの求め方はURLのクエリに、表示するものはハッシュに持たせる
// NOTE: ブラウザには、保存しない。設定を含めて、URLだけで、同じ画面になるようにする
export const useHoroscopeSettings = (
  router: NextRouter
): [HoroscopeSettings, (settings: HoroscopeSettings) => void] => {
  const { events, query } = router
  const subscribe = useCallback(
    (onChange: () => void) => {
      // 利用者が、アドレスのハッシュを書き換えたとき
      window.addEventListener('hashchange', onChange)
      // 画面から変えたとき。ルーターは、履歴を直接書き換えるので、hashchange は起きない
      events.on('hashChangeComplete', onChange)
      events.on('routeChangeComplete', onChange)
      return () => {
        window.removeEventListener('hashchange', onChange)
        events.off('hashChangeComplete', onChange)
        events.off('routeChangeComplete', onChange)
      }
    },
    [events]
  )
  // NOTE: ハッシュは、サーバーに送られない。サーバーでは、最初の状態で描画する
  const hash = useSyncExternalStore(subscribe, getHash, () => '')
  const settings = useMemo(() => parseSettings(query, hash), [query, hash])

  const setSettings = useCallback(
    (next: HoroscopeSettings) => {
      // 入力（生年月日と場所など）は、そのまま残す。アスペクトの求め方だけを、入れ替える
      const rest = Object.fromEntries(
        Object.entries(router.query).filter(([key]) => !(ASPECT_QUERY_KEYS as readonly string[]).includes(key))
      )
      // NOTE: shallow で移動する。入力は変わらないので、読み直し（住所の検索と、結果の取得）は走らない。
      // 履歴は増やさない（戻るボタンで、1つずつ戻らなくて済むように）。
      // scroll を false にしないと、ハッシュが空になったときに、画面の先頭に移動する
      const url = toUrl(router.pathname, { ...rest, ...toSettingsQuery(next) }, toSettingsHash(next))
      router.replace(url, undefined, { shallow: true, scroll: false })
    },
    [router]
  )
  return [settings, setSettings]
}
