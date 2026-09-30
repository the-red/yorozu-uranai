import type { NextRouter } from 'next/router'
import { useCallback, useMemo, useSyncExternalStore } from 'react'
import { HoroscopeSettings, parseSettingsHash, toSettingsHash } from '../horoscope/models'

// URLのハッシュ（# の後ろ。無ければ、空の文字列）
export const getHash = (): string => window.location.hash.slice(1)

// ホロスコープの画面の設定（表示するもの、アスペクトの求め方）。URLのハッシュに持たせる
// NOTE: ブラウザには、保存しない。設定を含めて、URLだけで、同じ画面になるようにする
export const useHoroscopeSettings = (
  router: NextRouter
): [HoroscopeSettings, (settings: HoroscopeSettings) => void] => {
  const { events } = router
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
  const settings = useMemo(() => parseSettingsHash(hash), [hash])

  const setSettings = useCallback(
    (next: HoroscopeSettings) => {
      // NOTE: 履歴は増やさない（戻るボタンで、1つずつ戻らなくて済むように）。
      // scroll を false にしないと、ハッシュが空になったときに、画面の先頭に移動する
      router.replace({ query: router.query, hash: toSettingsHash(next) }, undefined, { shallow: true, scroll: false })
    },
    [router]
  )
  return [settings, setSettings]
}
