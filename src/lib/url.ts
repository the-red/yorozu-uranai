type QueryValues = Partial<Record<string, string | string[]>>

// パスに、クエリを付ける
// NOTE: カンマは、そのまま入れる（%2C にしない）。カンマで区切る値（minor=30,150 など）を、読めるままにする
export const toUrl = (pathname: string, query: QueryValues): string => {
  const params = new URLSearchParams()
  Object.entries(query).forEach(([key, value]) => {
    // 値が複数あれば、すべて入れる
    ;[value ?? []].flat().forEach((_) => params.append(key, _))
  })
  const search = params.toString().replaceAll('%2C', ',')
  return `${pathname}${search && `?${search}`}`
}
