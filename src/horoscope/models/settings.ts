import { AspectQuery, AspectSettings, parseAspectQuery, toAspectQuery } from './AspectSettings'
import { Visibility, parseShowParam, toShowParam } from './visibility'

// ホロスコープの画面の設定
// - visibility: 惑星以外のものを、表示するかどうか
// - aspects: アスペクトの求め方
//
// NOTE: JSON の結果に影響するものは、クエリ（? の後ろ）に持たせる。見せ方だけを変えるものは、ハッシュ（# の後ろ）に持たせる。
// - アスペクトの求め方は、クエリ。JSON の、アスペクトの一覧が変わる。ページの URL に .json を付けると、画面と同じ結果になる
// - 表示するものは、ハッシュ。JSON は、常にすべてを返す
// - 最初の状態と同じ項目は、入れない
export type HoroscopeSettings = { visibility: Visibility; aspects: AspectSettings }

// URLから読み取る（?orb=8&minor=30,150#show=chiron,ascMc）。ハッシュの先頭の # は、あっても無くてもよい
// NOTE: 読み取れない値は、無視する（最初の状態にする）
export const parseSettings = (query: Partial<Record<string, string | string[]>>, hash: string): HoroscopeSettings => ({
  visibility: parseShowParam(new URLSearchParams(hash.replace(/^#/, '')).get('show') ?? undefined),
  aspects: parseAspectQuery(query).settings,
})

// クエリに入れる項目。最初の状態なら、空
export const toSettingsQuery = ({ aspects }: HoroscopeSettings): AspectQuery => toAspectQuery(aspects)

// ハッシュにする。先頭の # は、付けない。最初の状態なら、空の文字列
export const toSettingsHash = ({ visibility }: HoroscopeSettings): string => {
  const show = toShowParam(visibility)
  return show === undefined ? '' : `show=${show}`
}
