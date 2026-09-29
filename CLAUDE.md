# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## 概要

「よろず占い」(https://yorozu-uranai.com) — ホロスコープ（西洋占星術）・四柱推命・数秘術を提供する Next.js (Pages Router) + TypeScript アプリ。Vercel にデプロイしている。

## コマンド

パッケージマネージャは yarn (v1)、Node.js は 24（`.tool-versions` と `package.json` の `engines`）。

```sh
yarn dev          # next dev と pathpida --watch を並列起動
yarn build        # pathpida 生成 → next build → ビルド結果の確認
yarn test         # テストコードの型チェック → vitest 全件（1回実行）
yarn vitest       # 変更を監視して再実行
yarn test test/suimei/Kanshi.test.ts   # 単一ファイル
yarn test -t '六十干支'                  # テスト名で絞り込み
yarn lint         # eslint --fix（自動修正が走る）
yarn lint:check   # eslint（修正しない。警告が増えたら失敗する）
yarn format       # prettier --write
yarn format:check # prettier --check（修正しない。test/ も対象）
yarn tsc --noEmit # 型チェック（専用scriptは無い。test/ は tsconfig の対象外）
yarn path         # src/lib/$path.ts を再生成
```

デプロイは Vercel が行う。プルリクエストを作るとプレビュー環境が作られる（認証で保護されている）。

### CI

プルリクエストと main への push で、GitHub Actions（`.github/workflows/ci.yml`）が次を実行する。

- 型チェック、`yarn lint:check`、`yarn format:check`
- `yarn test` を、3つのタイムゾーン（`Asia/Tokyo` / `UTC` / `America/New_York`）で
- Vercel と同じ形（`NEXT_OUTPUT=standalone`）でビルドして、サーバーを起動し、`scripts/check-server.js` で確認する
  - `next.config.js` の `rewrites`、ヘッダー、ビルド結果に含めるファイルは、ハンドラーを直接呼ぶテストでは確かめられない
  - ページを追加・削除して `yarn path` を実行し忘れていると、ここで失敗する

`yarn lint:check` は、ESLint の警告が今の件数（6 件）を超えると失敗する。警告を減らしたら、`package.json` の `--max-warnings` の値も下げる。

残っている 6 件は、すべて地図のページ（`src/pages/map.tsx`）のもの。手元には Google Maps のキーが無く、地図の操作を確かめられないので、書き換えていない。

### 環境変数

- `.env.local`（`.env.local.example` 参照）: `NEXT_PUBLIC_GOOGLE_MAPS_API_KEY` / `GOOGLE_GEOCODING_API_KEY`。未設定だと地図と住所の逆ジオコーディングが動かない
  - `NEXT_PUBLIC_` で始まる環境変数は、ブラウザ側のコードで参照すると、配信する JavaScript に値が入る。サーバーだけで使うキー（Geocoding）には付けない
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
- テスト対象は `src/*/models` と `src/astronomy` の計算ロジックが中心。API（`test/api`。ハンドラーを直接呼ぶ）と `src/lib` のテストもある。コンポーネントのテストは無い
- `test/client-bundle.test.ts` は、ページから import をたどって、サーバーでしか動かないもの（`swisseph` など）に届かないことを確かめる。型だけを使うときは `import type` と書く（型しか使っていなくても、`import { … }` は読み込むものとして数える）
- 既存のコードにテストを足すときは、コードをわざと壊して、テストが失敗することを確かめる
- Vitest はテストコードの型チェックをしないので、`yarn test` の中で `tsc -p test` を先に実行している（`test/` はルートの `tsconfig.json` の対象外）
- 期待値は実在の生年月日に対する計算結果をハードコードしている。天文計算の結果は `src/astronomy` 側で小数第6位に切り捨てている

## アーキテクチャ

### ディレクトリ構成の方針

占術ごとに `src/<占術>/{models,components}` に分割している（`horoscope` / `suimei` / `numerology`）。`models` は React に依存しない純粋な計算ロジック、`components` はその表示。`src/pages` は薄く、クエリ → フォーム値 → モデル生成 → コンポーネントへの受け渡しを担う。

`src/hakke/models` は占術ではなく、複数の占術（易占・九星気学）が共有する八卦のモデル。

### サーバー／クライアントの境界（重要）

`swisseph`（Swiss Ephemeris のネイティブバインディング）はサーバーでしか動かない。これを import しているのは `src/astronomy/index.ts` のみで、そこに依存するのは次の2つ:

- `src/horoscope/models/horoscopeFactory.ts`
- `src/suimei/models/SekkiUtil.ts`（と、それを使う `Daiun.ts` の `generateDaiun`）

これらはクライアントバンドルに含めてはいけない。そのため各 `models/index.ts` はこれらを **意図的に re-export していない**（`src/astronomy/types` は型のみなので export している）。ページ側からは API 経由で使う:

| API | 返すもの | クライアント側での復元 |
| --- | --- | --- |
| `GET /horoscope.json` | 惑星の黄道座標とハウス（`raw`）と、そこから求めた結果（`result`） | `new Horoscope(json.raw)` |
| `GET /suimei.json` | 節気ペア (`SekkiPair`)・均時差（`raw`）と、命式・大運・歳運（`result`） | `restoreKanshi()` で真太陽時と `Kanshi` を復元し、`Zoukan` / `Tsuhensei` / `Juuniun` / `tokushusei` / `generateSaiun` をクライアントで計算。大運は `result.大運` を `toDaiun()` で読み替える |
| `GET /numerology.json` | コアナンバー（`result`） | ページは使わない |
| `POST /api/geocode` | 緯度経度 → 住所（逆ジオコーディング） | — |

つまり「天文計算が必要な部分だけサーバー、そこから先の導出はクライアント」という分担。新しい計算を追加するときは、`astronomy` に依存するかどうかで置き場所が決まる。数秘術は天文計算が不要なので、ページは API を使わず完全にクライアントで完結する。

### 占い結果の JSON

ページの URL に `.json` を付けると、同じ入力に対する結果を JSON で返す。ページも同じ JSON を取得して描画する。生成 AI などの外部からも使える。形式は試験的なもので、今後変わることがある。

- `/horoscope.json` などのパスは、`next.config.js` の `rewrites` で `/api/horoscope` などに流している
- `raw` は天文計算の結果、`result` はモデルから求めた結果。`result` は、`raw` から復元したモデルを変換して作る（各 `models/json.ts`）。画面と JSON が同じモデルから作られるので、結果がずれない
- サーバーは既定値を補わず、時計も使わない。必須のパラメータが無ければ 400 を返す（`src/lib/json-query.ts`）。現在日時や東京駅の緯度経度を補うのは、ページの役割
- 四柱推命の `result` のキーは、占いの用語を漢字にしている（`命式` / `年柱` / `通変星` / `大運`）。年齢や年などの一般的な項目は英語
- `thisYear` が無いときは、大運と歳運に `current` を付けない（キーごと省く）
- エラーは `{ error: { code, message, params } }`。ページは文言ではなく、`code` と `params` で分岐する
  - `params` には、直す場所のパラメータを入れる（`calculation_failed` でも、`lat` か `date` を入れる）
  - `calculation_failed`（400）にするのは、天文計算の失敗だけ。`message` は固定の文言にして、ライブラリのエラーメッセージは返さない（`console.error` で記録する）。それ以外の例外は、そのまま 500 にする
- `gender` は `man` と `woman` だけを受け付ける。ページは「`man` でなければ `woman`」として読むが（以前の URL の `gender=on` も女性）、JSON では推測しない
- 設計の経緯は `docs/superpowers/specs/2026-09-28-json-api-design.md`

### ネイティブバイナリとデプロイ

Vercel は、ビルド時に「各 API の実行に必要なファイル」を調べて、それだけを切り出して動かす。`swisseph` のネイティブバイナリ（`swisseph.node`）は、実行時に組み立てたパスで読み込まれるので、Turbopack では自動で検出されない。

- `next.config.js` の `outputFileTracingIncludes` で、バイナリを明示的に含めている
- `yarn build` の最後に `scripts/check-file-tracing.js` が、バイナリが含まれているかを確認する。含まれていなければビルドが失敗する
- **`yarn start` で動いても、Vercel で動くとは限らない**（`yarn start` は `node_modules` が丸ごとある状態で動くため）。ビルドやライブラリの構成を変えたら、`NEXT_OUTPUT=standalone yarn build` でビルドし、`.next/standalone/server.js` を起動して、`node scripts/check-server.js http://localhost:3000` で確認する（CI でも実行している）

### URL クエリ ⇄ フォーム値

入力状態は URL クエリが正（共有可能な URL にするため）。フォーム送信は `router.push` でクエリを書き換えるだけで、それを受けて再計算が走る。

- `src/lib/params.ts`: クエリ形式（`date=yyyyMMdd`, `time=HHmm` または `unknown`）とフォーム形式（`yyyy-MM-dd`, `HH:mm`）の相互変換
- `src/hooks/useFormValues.ts`: クエリにデフォルト値を補完（現在日時、東京駅の緯度経度、性別など）。時刻不明の場合は `12:00` として計算する
- `src/hooks/useYorozuUranaiForm.ts`: ホロスコープと四柱推命で共通のフォームロジック（react-hook-form）
- `src/hooks/useResult.ts`: フォームの値から結果を求めて、取得の状態（結果・エラー・読み込み中）を返す

### 結果を求められなかったとき

ホロスコープと四柱推命のページは、結果が無くてもフォームを表示する。利用者が入力を直せるようにするため。

- エラーの文章は、フォームの中（送信ボタンの上）に出す。`alert` は使わない
- エラーになったら、前の結果を消す。入力と結果が食い違ったまま表示しないため。読み込み中は、前の結果を表示したままにする
- 文章は日本語だけ。API の `params` から、直す場所をフォームの項目の名前で案内する（`src/lib/fetch-json.ts` の `toErrorGuide`）
- `/suimei/saiun` にはフォームが無いので、四柱推命のページへのリンクを出す
- Next.js は、画面遷移の読み上げ用に、`role="alert"` の空の要素を常に置いている。エラーの要素を探すときは、クラス名（`.form-error` / `.form_error` / `.load_error`）を使う

### 地図ページとの連携

出生地の選択は `/map` を別タブで開く方式（`target="_blank" rel="opener"`）。値の返し方は2通りある。

- **通常のブラウザ**: フォーム側が `window.setLocation` を定義し（`useYorozuUranaiForm.ts`）、地図側が `window.opener.setLocation(lat, lng)` を呼んで値を返し、地図のタブを閉じる。`rel="opener"` を外すと動かなくなる
- **開いた元のページとつながらない場合**（LINE などのアプリ内ブラウザ）: 地図側が、緯度経度を URL に付けて元のページに移動する。そのために、地図へのリンクには戻り先（`returnTo`）と入力中のフォームの内容を付けている（`src/lib/map-return.ts`）。戻れるページは `horoscope` と `suimei` に限定している

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
- 日時は必ず出生地のタイムゾーンを持った luxon の `DateTime` で渡す（数秘術の生年月日も同じ）。`Date` や、ゾーン指定なしの `DateTime.fromISO()` / `fromJSDate()` は実行環境のタイムゾーンになるので使わない（API では、クエリの `zone` を `toDateTime()` に渡して作る）
- 現在の年（大運・歳運の「現在」の行の判定）は、閲覧者の現在地を基準にする。ブラウザで `DateTime.now().year` を求めて API にも `thisYear` として送る。サーバー側では時計を使わない
- 特殊星 (`models/tokushusei/`) はルール表をデータとして持つ。表は `scripts/generate-tokushusei.js` に TSV を貼って JSON 化したものを元にしている

### 八卦モデル

- 卦は漢字の文字列リテラル（`'震'` など）で受け渡す。3ビットの値は `八卦list` の index で、`toBits` / `fromBits` でだけ変換する
- ビット列の決まり: 陽 = 0、陰 = 1。上位ビットが初爻（一番下の線）。震 ☳ = `011` は、下から陽・陰・陰
  - 一般的な対応（陽 = 1）とは逆。先天八卦の順（乾1〜坤8）と Unicode（☰〜☷）の並びに一致させている
- 爻の位置（1始まり、1 が初爻）とビット位置の変換は `Kou.ts` の中だけで行う。線の本数（3 か 6）で位置が変わるため
- 後天八卦の属性（方位・九星の数・五行）はビット列から計算できないので、表で持つ
- 読みは2種類ある。`get読み` は音読み（けん・だ…）。`get四維読み` は、四維（四隅の方位にある乾・艮・巽・坤）の方位としての読み（いぬい・うしとら・たつみ・ひつじさる）
- 設計の経緯は `docs/superpowers/specs/2026-09-28-hakke-design.md`

### 感受点

感受点は、天体ではなく、計算で求める点。`src/horoscope/models/Point.ts` で扱う。Asc と Mc も感受点だが、ハウスの起点なので、`House` で扱う。

どれも、サインとハウスを読むので、惑星と同じ形（`Planet`）で扱う。`Horoscope.points` に入れる。`Horoscope.planets` は、10 個の天体のまま。

| 名前 | 画面の表示 | 記号 | 求め方 | どこで計算するか |
| --- | --- | --- | --- | --- |
| `northNode` | ヘッド | ☊ | 月の軌道と、太陽の通り道（黄道）が交わる点。真位置（トゥルーノード） | サーバー（`raw.node`） |
| `southNode` | テイル | ☋ | ヘッドの 180 度反対側 | ブラウザ |
| `lilith` | リリス | ⚸ | 月の軌道の上で、地球から一番遠い点（遠地点）。平均の位置 | サーバー（`raw.lilith`） |
| `partOfFortune` | PoF | ⨂ | パート・オブ・フォーチュン。Asc・太陽・月の位置から求める | ブラウザ |
| `vertex` | Vx | なし | バーテックス。ハウスの計算結果に含まれている | サーバー（`raw.houses.vertex`） |

- 画面に出す名前は、短くする（「ドラゴンヘッド」ではなく「ヘッド」）
- 並び順は、`POINT_NAMES` の順。記号が無いもの（Vx）を、最後に置く
- 略記は、先頭だけを大文字にする（Vx、Asc、Mc）。画面でも、コメントでも、同じ書き方にする
- 記号の説明は、惑星の位置の表に、名前と並べて表示する（`☉ 太陽`）。記号が無いもの（Vx、Asc、Mc）は、名前だけを表示する
  - 円と、アスペクトの表では、Vx は記号の代わりに名前を表示する（`POINT_ICONS.vertex` は `'Vx'`）
- ヘッドを平均の位置にするなら、`src/astronomy/index.ts` の `BODIES` の `trueNode` を `SE_MEAN_NODE` に変える。リリスを真位置にするなら、`meanApogee` を `SE_OSCU_APOG` に変える。変えたら、`getPointVariant` が返す値も変える
  - 平均の位置のリリスは、ほかのサイトと 0.1 度ほど違うことがある。Swiss Ephemeris は、月の軌道の傾きを計算に入れるため
- PoF は、昼生まれと夜生まれで式を変える（`getPartOfFortune`）。昼生まれは「Asc + 月 − 太陽」、夜生まれは「Asc + 太陽 − 月」
  - 昼生まれは、太陽が地平線より上（7〜12 ハウス）にあること。カスプの値を使わずに、Asc からの角度で判定する（`isDayBirth`）
- バーテックスと PoF は、進む向きが無いので、逆行はしないものとして扱う（`isRetrograde` は常に `false`）
- 惑星とのアスペクトは、コンジャンクションだけを求める（`getPointConjunctions`。オーブは `POINT_ORB` の 3 度）
  - テイルは、ヘッドの反対側にある。ほかのアスペクトまで求めると、同じ情報が2回ずつ出る（テイルとのセクスタイルは、ヘッドとのトライン）。ほかの感受点も、表をそろえるために、コンジャンクションだけにしている
- サインの分類の表（四元素など）には、含めない
- アスペクトの表は、惑星どうしの三角の表の下に、惑星 × 感受点の四角い表を置く。感受点どうしのアスペクトは読まないので、三角の表には足さない
  - それぞれの表の下に、オーブを表示する
  - 1マスの大きさ（31px）は、横に 11 マス（感受点の記号 + 惑星 10 個）が、幅に収まるように決めている
- リリスの記号（⚸）は、端末のフォントに無いと表示されない。手元で確かめたのは、macOS の Chrome だけ
- JSON では、`result.points` と `result.aspects.points` として、惑星とは別に返す。種類は `type`（`node` / `apogee` / `angle` / `lot`）、求め方は `variant`（`true` / `mean` / `day` / `night` / `null`）で区別する。感受点を増やすときは、配列の要素を足す

### ホロスコープの描画

`HoroscopeCircle.tsx` が react-konva (canvas) で円・サイン・惑星・アスペクト線を描画する。アセンダントが左（9時方向）に来るよう全体を `-house.ascendant.longitude` だけ回転させている。アスペクトのオーブは現状 `pages/horoscope.tsx` の固定値 (6)。

輪の位置は、外周の半径を 1 としたときの割合で、`RINGS` にまとめている。外側から順に、次のものを描く。

| 部品 | 内容 |
| --- | --- |
| サインの輪 | 12 サインの記号 |
| 目盛り | 1 度ごとの線。5 度ごと、10 度ごとは長くする |
| 引き出し線 | 目盛りの上の本当の位置から、度数まで。Asc と Mc には引かない（ハウスの線が、位置を示している） |
| 度数 | 度だけを表示する（分は切り捨てる。`29°`）。逆行のときは、後ろに `R` を付ける（`29°R`） |
| 記号 | 惑星、感受点、Asc、Mc。重ならないように、ずらした位置に置く。度数も、同じ向きに置く |
| ハウスの番号 | 度数と見分けられるように、色を薄くしている |
| アスペクトの線 | 内側の輪の上の、本当の位置どうしを結ぶ |

- 記号をずらす位置は、`spreadLongitudes`（`src/horoscope/models/layout.ts`）で求める。近すぎる記号をかたまりにして、本当の位置の平均を中心に、等間隔に広げる。重なっていない記号は動かず、順番も入れ替わらない
  - 表示だけのものなので、JSON には含めない
- 記号どうしの間隔（`MIN_GAP`）は 10 度。記号の幅が、隣と重ならない大きさにしている。記号の大きさや、輪の位置を変えたら、見直す
- 記号が無いもの（Vx、Asc、Mc）は、名前を文字で置く
- 度数と記号は、文字の周りを白く縁取る。Asc と Mc は、ハウスの線の真上にあるので、縁取りが無いと、線が文字に重なって読みにくい
- 記号が大きく動く場合（惑星が1か所に集まる日）は、引き出し線が、隣の度数にかかることがある
- 惑星などのオブジェクトを、展開（`...`）で複製しない。`icon` などはクラスのゲッターなので、複製すると値が落ちる
- 設計の経緯は #198

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
  - `react-hooks/refs` / `set-state-in-effect` は、地図のページが該当するので警告にとどめている（`eslint.config.mjs`）
  - コンポーネントの中で、コンポーネントを定義しない（描画のたびに作り直される）。外に出して、必要な値は引数で渡す
  - `react-hook-form` の `watch` は使わない（React Compiler が対応していない）。値を表示に使うときは `useWatch`、操作のときに読むだけなら `getValues` を使う
- コメントは日本語
- コミットメッセージは Conventional Commits 形式 + 日本語の説明（例: `fix: 未入力の状態でローマ字変換を押しても落ちないように`）

## 既知の不整合

- `src/pages/_middleware.ts.txt` は Basic 認証ミドルウェアを拡張子で無効化したもの（現在は使われていない）
