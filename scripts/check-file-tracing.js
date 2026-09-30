// ビルド結果の確認
// swephのネイティブバイナリと、天体暦のファイルが、APIの実行に必要なファイルとして含まれているかを調べる。
// 含まれていないと、ビルドは成功するのに、Vercel上ではホロスコープと四柱推命のAPIがエラーになる
const fs = require('fs')
const path = require('path')

// NOTE: ライブラリには、環境ごとにビルド済みのバイナリが入っている。ビルドした環境のものを調べる。
// インストールのときにビルドされたバイナリ（build/Release）があれば、そちらが読み込まれるので、そちらを調べる
const BUILT_BINARY = 'node_modules/sweph/build/Release/sweph.node'
const BINARY = fs.existsSync(BUILT_BINARY)
  ? BUILT_BINARY
  : `node_modules/sweph/prebuilds/${process.platform}-${process.arch}/sweph.node`
// 天体暦のファイル。小惑星とキロンの計算に使う
// NOTE: 惑星のファイル（sepl）が無くても計算できるが、値がわずかに変わる。エラーにならないので、ここで確かめる
const EPHEMERIS = ['ephe/seas_18.se1', 'ephe/sepl_18.se1']

const REQUIRED_FILES = {
  horoscope: [BINARY, ...EPHEMERIS],
  suimei: [BINARY],
}

const errors = []
for (const [api, requiredFiles] of Object.entries(REQUIRED_FILES)) {
  const traceFile = path.join('.next', 'server', 'pages', 'api', `${api}.js.nft.json`)
  if (!fs.existsSync(traceFile)) {
    errors.push(`${traceFile} が見つかりません`)
    continue
  }
  const { files } = JSON.parse(fs.readFileSync(traceFile, 'utf8'))
  for (const requiredFile of requiredFiles) {
    if (!files.some((file) => file.endsWith(requiredFile))) {
      errors.push(`/api/${api} に ${requiredFile} が含まれていません`)
    }
  }
}

if (errors.length > 0) {
  console.error('ビルド結果の確認に失敗しました。next.config.js の outputFileTracingIncludes を確認してください。')
  errors.forEach((error) => console.error(`- ${error}`))
  process.exit(1)
}
console.info('ビルド結果の確認: swephのネイティブバイナリと、天体暦のファイルが含まれています')
