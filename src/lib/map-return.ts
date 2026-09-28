import { FormValuesBase, Query, formValuesToQuery } from './params'

// 地図ページから戻れるページ
const RETURN_PAGES = ['horoscope', 'suimei'] as const
export type ReturnTo = (typeof RETURN_PAGES)[number]

export type MapQuery = Query & Partial<{ returnTo: string | string[] }>

// 地図ページに渡すクエリ
// NOTE: 地図ページから元のページに値を返せない場合（アプリ内ブラウザなど）に、元のページへ移動して戻れるよう、
// 戻り先と、入力中のフォームの内容を渡しておく
export const buildMapQuery = (returnTo: ReturnTo, formValues: Partial<FormValuesBase>): MapQuery => ({
  returnTo,
  ...formValuesToQuery(formValues),
})

// 地図ページから元のページに戻るURL。戻り先が分からなければundefined
export const buildReturnUrl = ({ returnTo, ...query }: MapQuery, pinned: { lat: number; lng: number }) => {
  // 外部のサイトなどに移動させられないよう、決められたページにだけ戻す
  const page = RETURN_PAGES.find((_) => _ === returnTo)
  if (!page) {
    return undefined
  }

  return {
    pathname: `/${page}` as const,
    query: { ...query, lat: String(pinned.lat), lng: String(pinned.lng) },
  }
}
