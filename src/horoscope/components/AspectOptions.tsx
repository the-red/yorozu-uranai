import {
  ASPECT_GROUPS,
  ASPECT_SETS,
  AspectGroup,
  AspectSet,
  AspectSettings,
  DEFAULT_ASPECT_SETTINGS,
  MINOR_DEGREES,
  MinorDegrees,
  toAspectQuery,
} from '../models'
import OptionsPanel from './OptionsPanel'

type Props = {
  settings: AspectSettings
  onChange: (settings: AspectSettings) => void
}

const GROUP_LABELS: Record<AspectGroup, string> = {
  ascMc: 'Asc・Mc',
  asteroid: '小惑星・キロン',
  point: '感受点',
}
const ASPECT_SET_LABELS: Record<AspectSet, string> = {
  conjunction: '0° だけ',
  major: 'メジャー',
}

// 選べるオーブ
// NOTE: URLで、ここに無い値（2.5 など）を指定していたら、それも選べるようにする
const ORBS = Array.from({ length: 12 }, (_, i) => i + 1)
const PLUS = Array.from({ length: 6 }, (_, i) => i)

type OrbSelectProps = { label: string; value: number; options: number[]; onChange: (value: number) => void }
const OrbSelect = ({ label, value, options, onChange }: OrbSelectProps) => (
  <select aria-label={label} value={value} onChange={(e) => onChange(Number(e.target.value))}>
    {[...new Set([...options, value])]
      .sort((a, b) => a - b)
      .map((_) => (
        <option key={_} value={_}>
          {_}°
        </option>
      ))}
  </select>
)

// アスペクトの求め方の調整
export default function AspectOptions({ settings, onChange }: Props) {
  const toggleMinor = (degrees: MinorDegrees, checked: boolean) =>
    onChange({
      ...settings,
      minor: MINOR_DEGREES.filter((_) => (_ === degrees ? checked : settings.minor.includes(_))),
    })
  const isDefault = Object.keys(toAspectQuery(settings)).length === 0

  return (
    <OptionsPanel title="Aspect" isDefault={isDefault} onReset={() => onChange(DEFAULT_ASPECT_SETTINGS)}>
      <table className="aspect-options">
        <thead>
          <tr>
            <th />
            <th>アスペクト</th>
            <th>オーブ</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <th rowSpan={3}>惑星</th>
            <td>メジャー</td>
            <td>
              <OrbSelect
                label="惑星のメジャーアスペクトのオーブ"
                value={settings.orb}
                options={ORBS}
                onChange={(orb) => onChange({ ...settings, orb })}
              />
            </td>
          </tr>
          <tr>
            <td>太陽・月は広げる</td>
            <td>
              <select
                aria-label="太陽と月で、オーブに足す度数"
                value={settings.sunMoonPlus}
                onChange={(e) => onChange({ ...settings, sunMoonPlus: Number(e.target.value) })}
              >
                {[...new Set([...PLUS, settings.sunMoonPlus])]
                  .sort((a, b) => a - b)
                  .map((_) => (
                    <option key={_} value={_}>
                      +{_}°
                    </option>
                  ))}
              </select>
            </td>
          </tr>
          <tr>
            <td>
              マイナー
              <div className="aspect-options-minor">
                {MINOR_DEGREES.map((degrees) => (
                  <label key={degrees}>
                    <input
                      type="checkbox"
                      checked={settings.minor.includes(degrees)}
                      onChange={(e) => toggleMinor(degrees, e.target.checked)}
                    />
                    {degrees}°
                  </label>
                ))}
              </div>
            </td>
            <td>
              <OrbSelect
                label="惑星のマイナーアスペクトのオーブ"
                value={settings.minorOrb}
                options={ORBS}
                onChange={(minorOrb) => onChange({ ...settings, minorOrb })}
              />
            </td>
          </tr>
          {ASPECT_GROUPS.map((group) => (
            <tr key={group}>
              <th>{GROUP_LABELS[group]}</th>
              <td>
                <select
                  aria-label={`${GROUP_LABELS[group]}のアスペクト`}
                  value={settings[group].aspects}
                  onChange={(e) =>
                    onChange({ ...settings, [group]: { ...settings[group], aspects: e.target.value as AspectSet } })
                  }
                >
                  {ASPECT_SETS.map((_) => (
                    <option key={_} value={_}>
                      {ASPECT_SET_LABELS[_]}
                    </option>
                  ))}
                </select>
              </td>
              <td>
                <OrbSelect
                  label={`${GROUP_LABELS[group]}のオーブ`}
                  value={settings[group].orb}
                  options={ORBS}
                  onChange={(orb) => onChange({ ...settings, [group]: { ...settings[group], orb } })}
                />
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      <div className="aspect-options-note">
        惑星とのアスペクトを求めます。感受点は、ヘッド・テイル、リリス、Vx、PoF です。
      </div>
    </OptionsPanel>
  )
}
