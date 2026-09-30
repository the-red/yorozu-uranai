// 起動したサーバーの確認
// ビルドしたサーバーに実際にリクエストを送って、URLの対応とヘッダーを調べる。
// ハンドラーを直接呼ぶテストでは、next.config.js の rewrites と、ビルド結果に含めるファイルを確かめられない
//
// 使い方: node scripts/check-server.js http://localhost:3000

const base = process.argv[2]
if (!base) {
  console.error('使い方: node scripts/check-server.js <サーバーのURL>')
  process.exit(1)
}

// 1987-09-08 08:53 札幌生まれ
const QUERY = 'date=19870908&time=0853&zone=Asia%2FTokyo&lat=43.06&lng=141.35&gender=woman'

const CACHE = 'public, max-age=0, s-maxage=86400'
const NO_STORE = 'no-store'

const errors = []
let count = 0
const check = (name, actual, expected) => {
  count++
  if (JSON.stringify(actual) !== JSON.stringify(expected)) {
    errors.push(`${name}\n    期待: ${JSON.stringify(expected)}\n    実際: ${JSON.stringify(actual)}`)
  }
}

const request = async (path, init) => {
  const res = await fetch(base + path, { redirect: 'manual', ...init })
  const text = await res.text()
  let json
  try {
    json = JSON.parse(text)
  } catch {
    // JSONでない応答（ページのHTMLなど）
  }
  return { status: res.status, headers: res.headers, text, json }
}

// 占い結果のJSON
const checkJson = async (path, type, pick, expected) => {
  const { status, headers, json } = await request(path)
  check(`${path}: ステータス`, status, 200)
  check(`${path}: Content-Type`, headers.get('content-type'), 'application/json; charset=utf-8')
  check(`${path}: Cache-Control`, headers.get('cache-control'), CACHE)
  check(`${path}: X-Robots-Tag`, headers.get('x-robots-tag'), 'noindex')
  check(`${path}: type`, json?.type, type)
  check(`${path}: 結果`, json && pick(json), expected)
}

// エラーの応答
const checkError = async (path, init, status, code, params) => {
  const { status: actual, headers, json } = await request(path, init)
  const name = `${init?.method ?? 'GET'} ${path}`
  check(`${name}: ステータス`, actual, status)
  check(`${name}: Cache-Control`, headers.get('cache-control'), NO_STORE)
  check(`${name}: code`, json?.error?.code, code)
  check(`${name}: params`, json?.error?.params, params)
}

const main = async () => {
  // NOTE: 天文計算の結果が返れば、sweph のネイティブバイナリがビルド結果に含まれている
  await checkJson(
    `/horoscope.json?${QUERY}`,
    'horoscope',
    // NOTE: 小惑星とキロンが返れば、天体暦のファイルも、ビルド結果に含まれている
    ({ result }) =>
      [...result.planets.slice(0, 2), ...(result.asteroids ?? []), ...result.points].map((_) => [
        _.name,
        _.sign,
        _.house,
      ]),
    [
      ['sun', '乙女座', 11],
      ['moon', '魚座', 5],
      ['ceres', '射手座', 2],
      ['pallas', '蠍座', 1],
      ['juno', '水瓶座', 4],
      ['vesta', '蟹座', 9],
      ['chiron', '双子座', 8],
      ['northNode', '牡羊座', 5],
      ['southNode', '天秤座', 11],
      ['lilith', '獅子座', 9],
      ['vertex', '双子座', 8],
      ['partOfFortune', '牡牛座', 7],
    ]
  )
  await checkJson(
    `/suimei.json?${QUERY}`,
    'suimei',
    ({ result }) => ['年柱', '月柱', '日柱', '時柱'].map((_) => result.命式[_].干支),
    ['丁卯', '戊申', '庚申', '辛巳']
  )
  await checkJson(
    '/numerology.json?date=19701031&name=Suhi+Kazuya',
    'numerology',
    ({ result }) => [result.lifePathNumber, result.destinyNumber],
    [22, 7]
  )

  await checkError('/horoscope.json', undefined, 400, 'invalid_query', ['date', 'zone', 'lat', 'lng'])
  await checkError(`/horoscope.json?${QUERY.replace('lat=43.06', 'lat=80')}`, undefined, 400, 'calculation_failed', [
    'lat',
  ])
  // アスペクトの求め方
  await checkJson(
    `/horoscope.json?${QUERY}&orb=1&minor=150`,
    'horoscope',
    ({ result }) => [...result.aspects.major, ...result.aspects.minor].map((_) => [..._.planets, _.degrees]),
    [
      ['sun', 'saturn', 90],
      ['mercury', 'jupiter', 150],
    ]
  )
  await checkError(`/horoscope.json?${QUERY}&orb=abc`, undefined, 400, 'invalid_query', ['orb'])
  await checkError(`/suimei.json?${QUERY.replace('gender=woman', 'gender=male')}`, undefined, 400, 'invalid_query', [
    'gender',
  ])
  await checkError(`/suimei.json?${QUERY}`, { method: 'POST' }, 405, 'method_not_allowed', [])

  // ページ
  for (const path of ['/', '/horoscope', '/suimei', '/suimei/saiun', '/numerology', '/map']) {
    const { status, headers } = await request(path)
    check(`${path}: ステータス`, status, 200)
    check(`${path}: Content-Type`, headers.get('content-type'), 'text/html; charset=utf-8')
  }

  // 無いURL
  for (const path of ['/horoscope.jsonx', '/map.json', '/api/horoscope-props', '/api/suimei-props']) {
    check(`${path}: ステータス`, (await request(path)).status, 404)
  }
}

main().then(
  () => {
    if (errors.length > 0) {
      console.error(`サーバーの確認に失敗しました（${count} 件のうち ${errors.length} 件）`)
      errors.forEach((error) => console.error(`- ${error}`))
      process.exit(1)
    }
    console.info(`サーバーの確認: ${count} 件すべて成功しました`)
  },
  (e) => {
    console.error('サーバーの確認を実行できませんでした。サーバーが起動しているかを確認してください。')
    console.error(e)
    process.exit(1)
  }
)
