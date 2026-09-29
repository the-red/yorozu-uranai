# よろず占い🔮

https://yorozu-uranai.com

環境構築
```
git clone https://github.com/the-red/yorozu-uranai.git
cd yorozu-uranai
yarn install
cp .env.local.example .env.local # Google MapsのAPIキーを設定
```

テスト
```
yarn test
```

Next.js開発サーバー起動
```
yarn dev
```

Next.js本番ビルド・本番サーバー起動
```
yarn build
yarn start
```

デプロイ

Vercelにデプロイしています。プルリクエストを作ると、プレビュー環境が作られます。

## ライセンス

GNU Affero General Public License バージョン 3、またはそれ以降のバージョン（AGPL-3.0-or-later）で公開しています。全文は [LICENSE](LICENSE) にあります。

AGPL は、ネットワーク越しにサービスとして使う人にも、ソースコードを受け取る権利を保証するライセンスです。このサイトのソースコードは、このリポジトリで、すべて公開しています。

### AGPL にしている理由

天体の位置の計算に、[Swiss Ephemeris](https://www.astro.com/swisseph/) を使っています（[swisseph](https://github.com/mivion/swisseph) 経由）。Swiss Ephemeris は、オープンソースのライセンスか、有償のライセンスかを選ぶ仕組みです。このプロジェクトは、オープンソースのライセンスを選んでいます。

| Swiss Ephemeris | オープンソースのライセンス |
| --- | --- |
| 今使っている版（2.09.03） | GPL バージョン 2 以降 |
| 最新の版 | AGPL |

今使っている版も、「公開のサービスを始める前に、ライセンスを選ぶこと」を求めていて、考え方は AGPL に近いものです。最新の版のライセンスに合わせて、AGPL にしています。

GPL バージョン 3 のソフトウェアは、AGPL バージョン 3 のソフトウェアと組み合わせられます（GPL バージョン 3 の第 13 条）。Apache License 2.0 や MIT License のライブラリも、組み合わせられます。

以下、create-next-appで生成れたREADME

---

This is a [Next.js](https://nextjs.org/) project bootstrapped with [`create-next-app`](https://github.com/vercel/next.js/tree/canary/packages/create-next-app).

## Getting Started

First, run the development server:

```bash
npm run dev
# or
yarn dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

You can start editing the page by modifying `pages/index.js`. The page auto-updates as you edit the file.

[API routes](https://nextjs.org/docs/api-routes/introduction) can be accessed on [http://localhost:3000/api/hello](http://localhost:3000/api/hello). This endpoint can be edited in `pages/api/hello.js`.

The `pages/api` directory is mapped to `/api/*`. Files in this directory are treated as [API routes](https://nextjs.org/docs/api-routes/introduction) instead of React pages.

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js/) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/deployment) for more details.
