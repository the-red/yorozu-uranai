/** @type {import('next').NextConfig} */
module.exports = {
  reactStrictMode: true,
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
