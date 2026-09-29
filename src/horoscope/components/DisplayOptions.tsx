import { VISIBILITY_KEYS, VISIBILITY_LABELS, Visibility, VisibilityKey } from '../models'

type Props = {
  visibility: Visibility
  onChange: (key: VisibilityKey, visible: boolean) => void
}

// 惑星以外のものを、表示するかどうかの切り替え
export default function DisplayOptions({ visibility, onChange }: Props) {
  return (
    <div className="list-container">
      <div className="list">Display</div>
      <div className="display-options">
        {VISIBILITY_KEYS.map((key) => (
          <label key={key} className="display-option">
            <input type="checkbox" checked={visibility[key]} onChange={(e) => onChange(key, e.target.checked)} />
            {VISIBILITY_LABELS[key]}
          </label>
        ))}
      </div>
    </div>
  )
}
