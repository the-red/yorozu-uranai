import { useEffect, useState } from 'react'
import type { FormValues } from './useYorozuUranaiForm'

type State<T> = {
  formValues?: FormValues // この入力に対する結果、またはエラー
  result?: T
  error?: unknown
}

// フォームの値から結果を求めて、取得の状態を返す
// NOTE: load には、描画のたびに作り直されない関数を渡す（コンポーネントの外で定義する）
export const useResult = <T>(formValues: FormValues | undefined, load: (formValues: FormValues) => Promise<T>) => {
  const [state, setState] = useState<State<T>>({})

  useEffect(() => {
    if (!formValues) {
      return
    }

    // 入力を続けて変えたときに、古い応答があとから届いても無視する
    let stale = false
    load(formValues).then(
      (result) => {
        if (!stale) setState({ formValues, result })
      },
      // エラーのときは、前の結果を消す。入力と結果が食い違ったまま表示しないため
      (error: unknown) => {
        if (!stale) setState({ formValues, error })
      }
    )
    return () => {
      stale = true
    }
  }, [formValues, load])

  const loading = !formValues || state.formValues !== formValues
  return {
    // 読み込み中は、前の結果を表示したままにする
    result: state.result,
    // 前のエラーは、入力を変えたら消す
    error: loading ? undefined : state.error,
    loading,
  }
}
