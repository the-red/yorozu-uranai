import { FROM_MAP, NOT_SELECTED, PREFECTURES } from '../lib/prefectures'

// 出生場所の選択欄の中身
export const PlaceOptions = ({ place }: { place: string }) => (
  <>
    <option value={NOT_SELECTED}>未選択</option>
    {/* 地図で選んだときだけ、出す。ここからは、選べない */}
    {place === FROM_MAP && <option value={FROM_MAP}>地図で選んだ場所</option>}
    {PREFECTURES.map(({ name }) => (
      <option key={name} value={name}>
        {name}
      </option>
    ))}
  </>
)
