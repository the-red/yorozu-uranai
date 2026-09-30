import { VISIBILITY_KEYS, VISIBILITY_LABELS, Visibility, VisibilityKey, toShowParam } from '../models'
import OptionsPanel from './OptionsPanel'

type Props = {
  visibility: Visibility
  onChange: (key: VisibilityKey, visible: boolean) => void
  onReset: () => void
  hasAsteroids: boolean // 小惑星とキロンを、計算できたか
}

// 小惑星とキロン。計算できない日付では、選べない
const isAsteroid = (key: VisibilityKey) => key === 'chiron' || key === 'asteroids'

// 惑星を先頭にして、2つずつ、4段に並べる
// 惑星 / Asc・Mc、Vx / PoF、小惑星 / キロン、ヘッド・テイル / リリス
const [FIRST, ...REST] = VISIBILITY_KEYS
const ROWS: VisibilityKey[][] = [
  [FIRST],
  ...Array.from({ length: REST.length / 2 }, (_, i) => REST.slice(i * 2, i * 2 + 2)),
]

// 惑星以外のものを、表示するかどうかの切り替え
export default function DisplayOptions({ visibility, onChange, onReset, hasAsteroids }: Props) {
  return (
    <OptionsPanel title="Display" isDefault={toShowParam(visibility) === undefined} onReset={onReset}>
      {ROWS.map((keys, row) => (
        <div key={row} className="display-options">
          {/* 惑星は、常に表示する。切り替えられないことを、チェックの入った状態で示す */}
          {row === 0 && (
            <label className="display-option fixed">
              <input type="checkbox" checked disabled />
              惑星
            </label>
          )}
          {keys.map((key) => {
            // 計算できなかったものは、選べないようにする。設定は、変えない
            const disabled = isAsteroid(key) && !hasAsteroids
            return (
              <label key={key} className={`display-option ${disabled ? 'disabled' : ''}`}>
                <input
                  type="checkbox"
                  checked={visibility[key] && !disabled}
                  disabled={disabled}
                  onChange={(e) => onChange(key, e.target.checked)}
                />
                {VISIBILITY_LABELS[key]}
              </label>
            )
          })}
        </div>
      ))}
      {!hasAsteroids && (
        <div className="display-options-note">小惑星とキロンは、1800年から 2399年までの日付で表示できます</div>
      )}
    </OptionsPanel>
  )
}
