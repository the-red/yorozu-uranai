type QueryValues = Partial<Record<string, string | string[]>>

// パスに、クエリとハッシュを付ける。hash は、先頭の # を付けずに渡す
// NOTE: カンマは、そのまま入れる（%2C にしない）。カンマで区切る値（minor=30,150 など）を、読めるままにする
export const toUrl = (pathname: string, query: QueryValues, hash: string = ''): string => {
  const params = new URLSearchParams()
  Object.entries(query).forEach(([key, value]) => {
    // 値が複数あれば、すべて入れる
    ;[value ?? []].flat().forEach((_) => params.append(key, _))
  })
  const search = params.toString().replaceAll('%2C', ',')
  return `${pathname}${search && `?${search}`}${hash && `#${hash}`}`
}
