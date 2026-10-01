import { ASPECT_QUERY_KEYS, AspectSettings, parseAspectQuery, toAspectQuery } from './AspectSettings'
import { Visibility, parseShowParam, toShowParam } from './visibility'

// ホロスコープの画面の設定。URLのクエリに持たせる
// - aspects: アスペクトの求め方（orb など）。JSON の結果に影響する
// - visibility: 惑星以外のものを、表示するかどうか（show）。画面だけが使う。JSON は、付けても無視して、常にすべてを返す
//
// NOTE: 最初の状態と同じ項目は、入れない。設定を変えていなければ、URLは変わらない
export type HoroscopeSettings = { visibility: Visibility; aspects: AspectSettings }

export const SETTINGS_QUERY_KEYS = [...ASPECT_QUERY_KEYS, 'show'] as const
export type SettingsQuery = Partial<Record<(typeof SETTINGS_QUERY_KEYS)[number], string>>

// クエリから読み取る（?orb=8&minor=30,150&show=chiron,ascMc）
// NOTE: 読み取れない値は、無視する（最初の状態にする）
export const parseSettings = (query: Partial<Record<string, string | string[]>>): HoroscopeSettings => ({
  // 同じパラメータが複数あるときは、最初の値を使う
  visibility: parseShowParam([query.show].flat()[0]),
  aspects: parseAspectQuery(query).settings,
})

// クエリにする。最初の状態なら、空
export const toSettingsQuery = ({ visibility, aspects }: HoroscopeSettings): SettingsQuery => {
  const show = toShowParam(visibility)
  return { ...toAspectQuery(aspects), ...(show !== undefined && { show }) }
}
