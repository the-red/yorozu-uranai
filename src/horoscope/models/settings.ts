import { AspectSettings, parseAspectQuery, toAspectQuery } from './AspectSettings'
import { Visibility, parseShowParam, toShowParam } from './visibility'

// ホロスコープの画面の設定。URLのハッシュ（# の後ろ）に持たせる
// - visibility: 惑星以外のものを、表示するかどうか
// - aspects: アスペクトの求め方
//
// NOTE: 入力（生年月日と場所）は、クエリ（? の後ろ）に持たせている。設定は、ハッシュに分ける。
// - ハッシュは、サーバーに送られない。設定を変えても、入力の読み直し（住所の検索と、結果の取得）が要らない
// - 最初の状態と同じ項目は、入れない。設定を変えていなければ、ハッシュは付かない
export type HoroscopeSettings = { visibility: Visibility; aspects: AspectSettings }

// ハッシュから読み取る（#show=chiron,ascMc&orb=8）。先頭の # は、あっても無くてもよい
// NOTE: 読み取れない値は、無視する（最初の状態にする）
export const parseSettingsHash = (hash: string): HoroscopeSettings => {
  const params = Object.fromEntries(new URLSearchParams(hash.replace(/^#/, '')))
  return {
    visibility: parseShowParam(params.show),
    aspects: parseAspectQuery(params).settings,
  }
}

// ハッシュにする。先頭の # は、付けない。最初の状態なら、空の文字列
export const toSettingsHash = ({ visibility, aspects }: HoroscopeSettings): string => {
  const show = toShowParam(visibility)
  const params = { ...(show !== undefined && { show }), ...toAspectQuery(aspects) }
  // NOTE: 値は、英数字とカンマとピリオドだけ。カンマを %2C にしないように、自分で組み立てる
  return Object.entries(params)
    .map(([key, value]) => `${key}=${value}`)
    .join('&')
}
