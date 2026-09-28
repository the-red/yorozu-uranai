/** @type {import('next').NextConfig} */
module.exports = {
  reactStrictMode: true,
  // swissephのネイティブバイナリは、実行時に組み立てたパスで読み込まれるので、ビルド時に自動では検出されない。
  // Vercelなど、必要なファイルだけを切り出して動かす環境に含まれるように、明示しておく
  outputFileTracingIncludes: {
    '/api/*': ['./node_modules/swisseph/build/Release/swisseph.node'],
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
