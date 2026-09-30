import type { NextRouter } from 'next/router'
import { useCallback, useMemo } from 'react'
import { ASPECT_QUERY_KEYS, AspectSettings, parseAspectQuery, toAspectQuery } from '../horoscope/models'

// ホロスコープの、アスペクトの求め方。URLのクエリに持たせる
// NOTE: 表示の切り替え（useVisibility）と違って、ブラウザには保存しない。
// アスペクトは、計算の結果の一部。同じURLなら、誰が開いても、同じ結果になるようにする
export const useAspectSettings = (router: NextRouter): [AspectSettings, (settings: AspectSettings) => void] => {
  // 関係のあるクエリだけを取り出す。ほかのクエリが変わっても、作り直さない
  const key = JSON.stringify(Object.fromEntries(ASPECT_QUERY_KEYS.map((_) => [_, router.query[_]])))
  // NOTE: 読み取れない値は、無視する（最初の状態にする）
  const settings = useMemo(() => parseAspectQuery(JSON.parse(key)).settings, [key])

  const setSettings = useCallback(
    (next: AspectSettings) => {
      const rest = Object.fromEntries(
        Object.entries(router.query).filter(([_]) => !(ASPECT_QUERY_KEYS as readonly string[]).includes(_))
      )
      // NOTE: アスペクトは、ブラウザで求める。入力の読み直し（住所の検索と、結果の取得）が走らないように、shallow にする。
      // 戻るボタンで、1つずつ戻らなくて済むように、履歴は増やさない
      router.replace({ query: { ...rest, ...toAspectQuery(next) } }, undefined, { shallow: true, scroll: false })
    },
    [router]
  )
  return [settings, setSettings]
}
