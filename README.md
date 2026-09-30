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
