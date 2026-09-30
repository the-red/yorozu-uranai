import type { ReactNode } from 'react'

type Props = {
  title: string
  isDefault: boolean // 初期状態のままか
  onReset: () => void
  children: ReactNode
}

// 設定の欄（Display、Aspect）。その欄の設定を、初期状態に戻すボタンを付ける
export default function OptionsPanel({ title, isDefault, onReset, children }: Props) {
  return (
    <div className="list-container">
      <div className="list">{title}</div>
      {children}
      <button type="button" className="options-reset" disabled={isDefault} onClick={onReset}>
        初期状態に戻す
      </button>
    </div>
  )
}
