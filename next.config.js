/** @type {import('next').NextConfig} */
module.exports = {
  reactStrictMode: true,
  // swissephのネイティブバイナリは、実行時に組み立てたパスで読み込まれるので、ビルド時に自動では検出されない。
  // Vercelなど、必要なファイルだけを切り出して動かす環境に含まれるように、明示しておく
  outputFileTracingIncludes: {
    '/api/*': ['./node_modules/swisseph/build/Release/swisseph.node'],
  },
  // 占い結果のJSON。ページのURLに .json を付けると、同じ入力に対する結果を返す
  async rewrites() {
    return [
      { source: '/horoscope.json', destination: '/api/horoscope' },
      { source: '/suimei.json', destination: '/api/suimei' },
      { source: '/numerology.json', destination: '/api/numerology' },
    ]
  },
  turbopack: {
    rules: {
      // SVGをReactコンポーネントとして読み込む
      '*.svg': {
        loaders: ['@svgr/webpack'],
        as: '*.js',
      },
    },
  },
}
