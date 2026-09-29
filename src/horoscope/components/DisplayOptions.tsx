import { ASTEROID_NAMES, VISIBILITY_KEYS, VISIBILITY_LABELS, Visibility, VisibilityKey } from '../models'

type Props = {
  visibility: Visibility
  onChange: (key: VisibilityKey, visible: boolean) => void
  hasAsteroids: boolean // 小惑星とキロンを、計算できたか
}

const isAsteroid = (key: VisibilityKey) => (ASTEROID_NAMES as readonly string[]).includes(key)

// 惑星以外のものを、表示するかどうかの切り替え
export default function DisplayOptions({ visibility, onChange, hasAsteroids }: Props) {
  return (
    <div className="list-container">
      <div className="list">Display</div>
      <div className="display-options">
        {VISIBILITY_KEYS.map((key) => {
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
      {!hasAsteroids && (
        <div className="display-options-note">小惑星とキロンは、1800年から 2399年までの日付で表示できます</div>
      )}
    </div>
  )
}
