/** @type {import('next').NextConfig} */
module.exports = {
  reactStrictMode: true,
  // Vercelと同じように、必要なファイルだけを切り出した形で動かして確かめるときに指定する（CIと、手元での確認用）
  output: process.env.NEXT_OUTPUT === 'standalone' ? 'standalone' : undefined,
  // swephのネイティブバイナリは、実行時に組み立てたパスで読み込まれるので、ビルド時に自動では検出されない。
  // Vercelなど、必要なファイルだけを切り出して動かす環境に含まれるように、明示しておく
  outputFileTracingIncludes: {
    // NOTE: ライブラリには、環境ごとにビルド済みのバイナリが入っている。ビルドする環境のものだけを含める
    // （Vercel と CI は linux-x64）
    '/api/*': [`./node_modules/sweph/prebuilds/${process.platform}-${process.arch}/sweph.node`],
    // 天体暦のファイル。小惑星とキロンの計算に使う
    // NOTE: 小惑星のファイル（seas）だけでも計算できるが、惑星のファイル（sepl）が無いと、値がわずかに変わる
    '/api/horoscope': ['./ephe/seas_18.se1', './ephe/sepl_18.se1'],
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
