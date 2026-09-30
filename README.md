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

天体の位置の計算に、[Swiss Ephemeris](https://www.astro.com/swisseph/) を使っています（[sweph](https://github.com/timotejroiko/sweph) 経由）。Swiss Ephemeris は、オープンソースのライセンスか、有償のライセンスかを選ぶ仕組みです。このプロジェクトは、オープンソースのライセンスを選んでいます。

今使っている版（2.10.03）のオープンソースのライセンスは、AGPL です。それに合わせて、AGPL にしています。`ephe/` に置いている天体暦のファイルも、Swiss Ephemeris のものです。

GPL バージョン 3 のソフトウェアは、AGPL バージョン 3 のソフトウェアと組み合わせられます（GPL バージョン 3 の第 13 条）。Apache License 2.0 や MIT License のライブラリも、組み合わせられます。
