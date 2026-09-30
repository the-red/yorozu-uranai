import { useCallback, useMemo, useSyncExternalStore } from 'react'
import { Visibility, VisibilityKey, parseVisibility, toggleVisibility } from '../horoscope/models'

// ホロスコープで、惑星以外のものを表示するかどうか。ブラウザに保存する
// NOTE: URLのクエリには持たせない。URLを変えると、入力の読み直し（住所の検索と、結果の取得）が走る。
// 表示の好みは、生年月日を変えても、同じ設定のまま使えるほうが良い

const STORAGE_KEY = 'horoscope.visibility'
// 同じ画面の中での変更を、知らせるイベント。storage イベントは、ほかのタブでの変更しか届かない
const CHANGE_EVENT = 'horoscope.visibility.change'

// 保存できない環境（プライベートブラウズなど）では、画面を開いている間だけ覚えておく
let memory: string | null = null

const read = (): string | null => {
  try {
    return window.localStorage.getItem(STORAGE_KEY) ?? memory
  } catch {
    return memory
  }
}

const write = (saved: string) => {
  memory = saved
  try {
    window.localStorage.setItem(STORAGE_KEY, saved)
  } catch {
    // 保存できなくても、画面には反映する
  }
  window.dispatchEvent(new Event(CHANGE_EVENT))
}

const subscribe = (onChange: () => void) => {
  window.addEventListener('storage', onChange)
  window.addEventListener(CHANGE_EVENT, onChange)
  return () => {
    window.removeEventListener('storage', onChange)
    window.removeEventListener(CHANGE_EVENT, onChange)
  }
}

export const useVisibility = (): [Visibility, (key: VisibilityKey, visible: boolean) => void] => {
  // NOTE: サーバーでは、保存した内容が分からないので、最初の状態で描画する
  const saved = useSyncExternalStore(subscribe, read, () => null)
  const visibility = useMemo(() => parseVisibility(saved), [saved])
  const setVisible = useCallback(
    (key: VisibilityKey, visible: boolean) => write(toggleVisibility(visibility, key, visible)),
    [visibility]
  )
  return [visibility, setVisible]
}
