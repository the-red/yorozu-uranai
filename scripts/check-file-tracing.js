// ビルド結果の確認
// swissephのネイティブバイナリが、APIの実行に必要なファイルとして含まれているかを調べる。
// 含まれていないと、ビルドは成功するのに、Vercel上ではホロスコープと四柱推命のAPIが500エラーになる
const fs = require('fs')
const path = require('path')

const APIS = ['horoscope-props', 'suimei-props']
const REQUIRED_FILE = 'node_modules/swisseph/build/Release/swisseph.node'

const errors = []
for (const api of APIS) {
  const traceFile = path.join('.next', 'server', 'pages', 'api', `${api}.js.nft.json`)
  if (!fs.existsSync(traceFile)) {
    errors.push(`${traceFile} が見つかりません`)
    continue
  }
  const { files } = JSON.parse(fs.readFileSync(traceFile, 'utf8'))
  if (!files.some((file) => file.endsWith(REQUIRED_FILE))) {
    errors.push(`/api/${api} に ${REQUIRED_FILE} が含まれていません`)
  }
}

if (errors.length > 0) {
  console.error('ビルド結果の確認に失敗しました。next.config.js の outputFileTracingIncludes を確認してください。')
  errors.forEach((error) => console.error(`- ${error}`))
  process.exit(1)
}
console.info('ビルド結果の確認: swissephのネイティブバイナリが含まれています')
