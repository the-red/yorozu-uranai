import type { ReactNode } from 'react'

type Props = {
  title: string
  summary: string // 今の設定の要約
  children: ReactNode
}

// 設定の欄。折り畳める。最初は、閉じている
// NOTE: 閉じていても、今の設定が分かるように、見出しの横に要約を出す
export default function OptionsPanel({ title, summary, children }: Props) {
  return (
    <details className="list-container options-panel">
      <summary>
        <span className="list">{title}</span>
        <span className="options-summary">{summary}</span>
      </summary>
      {children}
    </details>
  )
}
