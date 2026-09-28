# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## 概要

「よろず占い」(https://yorozu-uranai.com) — ホロスコープ（西洋占星術）・四柱推命・数秘術を提供する Next.js (Pages Router) + TypeScript アプリ。Vercel にデプロイしている。

## コマンド

パッケージマネージャは yarn (v1)、Node.js は 24（`.tool-versions` と `package.json` の `engines`）。

```sh
yarn dev          # next dev と pathpida --watch を並列起動
yarn build        # pathpida 生成 → next build
yarn test         # テストコードの型チェック → vitest 全件（1回実行）
yarn vitest       # 変更を監視して再実行
yarn test test/suimei/Kanshi.test.ts   # 単一ファイル
yarn test -t '六十干支'                  # テスト名で絞り込み
yarn lint         # eslint --fix（自動修正が走る）
yarn format       # prettier --write
yarn tsc --noEmit # 型チェック（専用scriptは無い。test/ は tsconfig の対象外）
yarn path         # src/lib/$path.ts を再生成
```

デプロイは Vercel が行う。プルリクエストを作るとプレビュー環境が作られる（認証で保護されている）。

### 環境変数

- `.env.local`（`.env.local.example` 参照）: `NEXT_PUBLIC_GOOGLE_MAPS_API_KEY` / `NEXT_PUBLIC_GOOGLE_GEOCODING_API_KEY`。未設定だと地図と住所の逆ジオコーディングが動かない
- `.env.example`: デプロイ先に設定する環境変数の雛形

## ライブラリのバージョンの制約

基本は最新に追従するが、次のものは意図して最新より古いバージョンにしている。上げるときは制約が解消されたか確認する。

| ライブラリ | 現在 | 理由 |
| --- | --- | --- |
| TypeScript | 6.0 系 | `eslint-config-next` が使う `typescript-eslint` の対応範囲が 6.1 未満。7 系にすると ESLint が動かない |
| ESLint | 9 系 | `eslint-config-next` が使う `eslint-plugin-react` などが 10 系に未対応 |

## テストの注意点

- **計算結果は、実行環境のタイムゾーンに依存させない**。本番サーバー（Vercel）は UTC で動き、利用者のブラウザも日本時間とは限らないため。日時を扱う変更をしたら `TZ=UTC yarn test` と `TZ=America/New_York yarn test` でも確認する
- 小数の比較は `toBeCloseTo()` を使う。桁数は `test/test-util.ts` の `NUM_DIGITS`。オブジェクトや配列は同ファイルの `expectToBeCloseTo()` でまとめて比較する
- `swisseph` はネイティブアドオンなので、Node.js のバージョンを変えたら `yarn install` し直す（リビルドが必要）
  - `swisseph` が依存する `nan` と `node-gyp` は古いままだと Node.js 24 でビルドできないので、`package.json` の `resolutions` で新しいバージョンに固定している
- テスト対象は `src/*/models` と `src/astronomy` の計算ロジックが中心。コンポーネントのテストは無い
- Vitest はテストコードの型チェックをしないので、`yarn test` の中で `tsc -p test` を先に実行している（`test/` はルートの `tsconfig.json` の対象外）
- 期待値は実在の生年月日に対する計算結果をハードコードしている。天文計算の結果は `src/astronomy` 側で小数第6位に切り捨てている

## アーキテクチャ

### ディレクトリ構成の方針

占術ごとに `src/<占術>/{models,components}` に分割している（`horoscope` / `suimei` / `numerology`）。`models` は React に依存しない純粋な計算ロジック、`components` はその表示。`src/pages` は薄く、クエリ → フォーム値 → モデル生成 → コンポーネントへの受け渡しを担う。

### サーバー／クライアントの境界（重要）

`swisseph`（Swiss Ephemeris のネイティブバインディング）はサーバーでしか動かない。これを import しているのは `src/astronomy/index.ts` のみで、そこに依存するのは次の2つ:

- `src/horoscope/models/horoscopeFactory.ts`
- `src/suimei/models/SekkiUtil.ts`（と、それを使う `Daiun.ts` の `generateDaiun`）

これらはクライアントバンドルに含めてはいけない。そのため各 `models/index.ts` はこれらを **意図的に re-export していない**（`src/astronomy/types` は型のみなので export している）。ページ側からは API Route 経由で使う:

| API | 返すもの | クライアント側での復元 |
| --- | --- | --- |
| `POST /api/horoscope-props` | 惑星の黄道座標とハウス（プレーンな JSON） | `new Horoscope(props)` |
| `POST /api/suimei-props` | 節気ペア (`SekkiPair`)・均時差・大運 | `toSolarTime()` で真太陽時を求め、`new Kanshi(dateTime, sekkiPair, solarTime)` を起点に `Zoukan` / `Tsuhensei` / `Juuniun` / `tokushusei` / `generateSaiun` をクライアントで計算 |
| `POST /api/geocode` | 緯度経度 → 住所（逆ジオコーディング） | — |

つまり「天文計算が必要な部分だけサーバー、そこから先の導出はクライアント」という分担。新しい計算を追加するときは、`astronomy` に依存するかどうかで置き場所が決まる。数秘術は天文計算が不要なので API を使わず完全にクライアントで完結する。

### URL クエリ ⇄ フォーム値

入力状態は URL クエリが正（共有可能な URL にするため）。フォーム送信は `router.push` でクエリを書き換えるだけで、それを受けて再計算が走る。

- `src/lib/params.ts`: クエリ形式（`date=yyyyMMdd`, `time=HHmm` または `unknown`）とフォーム形式（`yyyy-MM-dd`, `HH:mm`）の相互変換
- `src/hooks/useFormValues.ts`: クエリにデフォルト値を補完（現在日時、東京駅の緯度経度、性別など）。時刻不明の場合は `12:00` として計算する
- `src/hooks/useYorozuUranaiForm.ts`: ホロスコープと四柱推命で共通のフォームロジック（react-hook-form）

### 地図ページとの連携

出生地の選択は `/map` を別タブで開く方式（`target="_blank" rel="opener"`）。フォーム側が `window.setLocation` を定義し（`useYorozuUranaiForm.ts`）、地図側が `window.opener.setLocation(lat, lng)` を呼んで値を返す。`rel="opener"` を外すと動かなくなる。

### 型付きルーティング (pathpida)

`src/lib/$path.ts` は pathpida による**自動生成ファイル**（コミット対象）。手で編集しない。

- ページ遷移と `public/` 配下の参照は `pagesPath` / `staticPath` 経由で行う
- 各ページは受け取るクエリの型を `export type OptionalQuery` として export する（pathpida がこれを拾う）
- ページや `public/` のファイルを追加・削除したら `yarn path` で再生成する（`yarn dev` 中は自動）

### 四柱推命モデル

- 識別子に日本語（漢字）を使っている: `年柱` / `日干` / `十二支list` / `節` など。ファイル名はローマ字（`Kanshi`, `Zoukan`, `Tsuhensei`, `Juuniun`, `Daiun`, `Saiun`）。既存の命名に合わせること
- 月の区切りは暦月ではなく節入り（太陽黄経）で決まる。`Sekki.ts` は立春 = 黄経315° を基準に 30° 刻みで節を求め、`SekkiUtil.getSetsuIri` は `astronomy.longitudeToDate` で節入り日時を反復計算で求める
- `Kanshi` は「当日の節」と「月末の節」のペア (`SekkiPair`) を受け取り、節入りの前後で年柱・月柱を補正する
- 四柱ごとに使う時刻が違う
  - 年柱・月柱: 節入り（絶対時刻）で決まる。暦の年月は出生地のタイムゾーンで数える
  - 日柱・時柱: 真太陽時（`SolarTime.ts`）の日付と時刻で決まる。時計の時刻に、地方時差（出生地の経度）と均時差の両方を足したもの。片方だけの補正はしない
- 日時は必ず出生地のタイムゾーンを持った luxon の `DateTime` で渡す（数秘術の生年月日も同じ）。`Date` や、ゾーン指定なしの `DateTime.fromISO()` / `fromJSDate()` は実行環境のタイムゾーンになるので使わない（API では `{ setZone: true }` で受け取る）
- 現在の年（大運・歳運の「現在」の行の判定）は、閲覧者の現在地を基準にする。ブラウザで `DateTime.now().year` を求めて API にも `thisYear` として送る。サーバー側では時計を使わない
- 特殊星 (`models/tokushusei/`) はルール表をデータとして持つ。表は `scripts/generate-tokushusei.js` に TSV を貼って JSON 化したものを元にしている

### ホロスコープの描画

`HoroscopeCircle.tsx` が react-konva (canvas) で円・サイン・惑星・アスペクト線を描画する。アセンダントが左（9時方向）に来るよう全体を `-house.ascendant.longitude` だけ回転させている。アスペクトのオーブは現状 `pages/horoscope.tsx` の固定値 (6)。

### スタイリング

スタイルは、すべて通常の CSS で書く。Sass、CSS フレームワーク、インラインの `style` は使わない。

- グローバル CSS（`src/styles/*`、すべて `_app.tsx` で読み込み）: ページのルート要素のクラス（`.horoscope`, `.suimei` など）でスコープしている
  - Sass や CSS の入れ子は使わない。色やフォントなどの共通の値は、ページのルート要素に CSS 変数（`--main-red` など）として定義している
  - 四柱推命と地図のスマホ版は、デザイン上の横幅 375px を基準に `calc(343 / var(--sp-width) * 100vw)` の形で大きさを指定している
  - クラス名の書き方はファイルごとに違う（ホロスコープは `kebab-case`、数秘術と四柱推命は `snake_case`）。編集するファイルに合わせる

SVG は `import X from './x.svg'` で React コンポーネントとして読み込める（SVGR。`next.config.js` の `turbopack.rules`）。

CSS から画像を参照するときは、`url('/images/map/back_blue.svg')` のように `public/` からの絶対パスで書く。相対パスで書くとビルドの対象になり、SVG は React コンポーネントに変換されて表示されなくなる。

## コーディング規約

- Prettier: セミコロンなし、シングルクォート、120桁
- ESLint: `console.log` は禁止（`console.info` / `warn` / `error` は可）、`==` は禁止（`== null` のみ可）
  - `react-hooks/refs` / `set-state-in-effect` / `static-components` は、既存コードが該当するので警告にとどめている（`eslint.config.mjs`）
- コメントは日本語
- コミットメッセージは Conventional Commits 形式 + 日本語の説明（例: `fix: 未入力の状態でローマ字変換を押しても落ちないように`）

## 既知の不整合

- `src/pages/_middleware.ts.txt` は Basic 認証ミドルウェアを拡張子で無効化したもの（現在は使われていない）
