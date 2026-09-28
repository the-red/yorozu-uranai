# 占い結果の JSON API の設計

2026-09-28

## 目的

各占いの結果を JSON で取得できるようにする。ページの URL に `.json` を付けると、同じ入力に対する結果が返る。

- 天体の位置や節入りの計算は、生成 AI が自力ではできない。計算はこのサイトが行い、読み解きは AI に任せる、という使い方を想定する
- まずは JSON を返すところまでを作り、触って確かめる。形式は試験的なもので、今後変わることがある

ページも同じ JSON を取得して描画する。計算の入口を1つにするため。

## 方針

- JSON には「材料」（`raw`）と「導出結果」（`result`）の両方を入れる
  - `raw`: 天文計算の結果。ページはここからモデルを復元する（今の `/api/*-props` が返しているもの）
  - `result`: モデルから求めた結果。AI や外部の利用者が読む
- `result` は、`raw` から復元したモデルを変換して作る。画面と JSON は同じモデルから作られるので、結果がずれない
- コンポーネントは今までどおりモデルを受け取る。JSON だけで描画する形にはしない（改修が大きく、オーブを画面で変える構想とも合わない）
- サーバーは既定値を補わず、時計も使わない。現在日時や東京駅の緯度経度を補うのは、今までどおりページの役割

## URL

| URL | 内部の API |
| --- | --- |
| `GET /horoscope.json` | `/api/horoscope` |
| `GET /suimei.json` | `/api/suimei` |
| `GET /numerology.json` | `/api/numerology` |

Pages Router では `/horoscope.json` というパスを直接は作れないので、`next.config.js` の `rewrites` で API に流す。
3行を個別に書く（パターンにまとめない）。

API を `/api/*` に置くので、`swisseph` のバイナリを含める設定（`outputFileTracingIncludes`）はそのまま効く。

`/api/horoscope-props` と `/api/suimei-props` は削除する。`/api/geocode` は変更しない。

GET 以外は 405 を返す。

## 入力

クエリの形式はページと同じ（`src/lib/params.ts`）。

| パラメータ | 形式 | horoscope | suimei | numerology |
| --- | --- | --- | --- | --- |
| `date` | `yyyyMMdd` | 必須 | 必須 | 必須 |
| `time` | `HHmm` または `unknown` | 任意 | 任意 | — |
| `zone` | IANA のタイムゾーン名（`Asia/Tokyo`） | 必須 | 必須 | — |
| `lat` | −90 〜 90 | 必須 | 任意 | — |
| `lng` | −180 〜 180 | 必須 | 必須 | — |
| `gender` | `man` / `woman` | — | 必須 | — |
| `thisYear` | 1〜4桁の数字 | — | 任意 | — |
| `name` | ローマ字（英字と空白） | — | — | 必須 |

- 「—」のパラメータは、付いていても無視する。ページの URL に `.json` を付けただけで動くようにするため
- `time` が無い、または `unknown` のときは、ページと同じく 12:00 で計算して、`input.timeUnknown` を `true` にする
- `gender` は `man` か `woman`
  - ほかの値（`male`、`MAN` など）は `invalid_query` にする。以前の URL にある `gender=on` も同じ（保存されている URL は無いので、受け付ける必要が無い）。ページは「`man` でなければ `woman`」として読むが、JSON で同じように読むと、`gender=male` と書かれたときに、大運の向きが逆の結果を返してしまい、利用者は気づけない
  - `/suimei.json` の `input.gender` は、必ず `man` か `woman` のどちらかになる
  - `gender` が無いときは、補わずに `invalid_query` を返す
- `zone` は必須。緯度経度からは推定しない
  - IANA の名前のほかに、実行環境が受け付ける別名（`JST` など）も通る。別名は環境によって変わるので、動作は保証しない
- 空文字のパラメータは、無いものとして扱う
- `time` は `0000` 〜 `2359`。`2400` は受け付けない
- `thisYear` の桁数を制限するのは、歳運を1年ずつ数えて求めているため。大きすぎる値を通すと、計算が終わらなくなる
- 四柱推命の `lat` は、計算には使わない。`page`（同じ結果を表示するページの URL）に入れるために受け取る。無ければ `input.lat` は `null` で、`page` にも付けない
- 同じパラメータが複数あるときは、最初の値を使う（ページと同じ）

### thisYear

四柱推命の大運・歳運で、「現在」の行を決めるのに使う。閲覧者の現在地での年。

| | 大運・歳運の `current` | 歳運の範囲 |
| --- | --- | --- |
| あり | 付ける | `thisYear` の5年前 〜 10年後（ページと同じ。生まれ年より前は含めない） |
| なし | キーごと付けない | 生まれ年 〜 120年後（`/suimei/saiun` と同じ） |

ページは今までどおり、ブラウザで求めた年を必ず送る。

## レスポンス

```jsonc
{
  "type": "horoscope",
  "input": { /* 解釈した入力 */ },
  "page": "https://yorozu-uranai.com/horoscope?date=19900123&time=1234&zone=Asia%2FTokyo&lat=35.68&lng=139.76",
  "raw": { /* 材料 */ },
  "result": { /* 導出結果 */ }
}
```

- `input`: フォームと同じ形式（`date` は `yyyy-MM-dd`、`time` は `HH:mm`）。数値は数値にする
- `page`: 同じ結果を表示するページの URL。オリジンはリクエストのヘッダーから求める
- 値が無いときは `null` にする（キーは省略しない）。例外は `thisYear` が無いときの `current`
- 小数は丸めない（天文計算の結果は、`src/astronomy` が小数第6位に切り捨てている）

以下の例の値は、形を示すためのもの。実際の計算結果ではない。

### ホロスコープ

`raw` は今の `HoroscopeProps`（`positions` と `houses`）。

```jsonc
"result": {
  "planets": [
    {
      "name": "sun",
      "nameJa": "太陽",
      "sign": "水瓶座",
      "degrees": 2.951234,      // サインの中での度数
      "longitude": 302.951234,  // 黄経
      "isRetrograde": false,
      "house": 10,
      "element": "air",
      "quality": "fixed",
      "polarity": "masculine"
    }
    // ALL_PLANETS の順に10個
  ],
  "houses": {
    "ascendant": { "sign": "牡牛座", "degrees": 12.3, "longitude": 42.3 },
    "mc": { "sign": "山羊座", "degrees": 25.1, "longitude": 295.1 },
    "cusps": [
      { "house": 1, "sign": "牡牛座", "degrees": 12.3, "longitude": 42.3 }
      // 12個
    ]
  },
  "aspects": {
    "orb": 6,
    "major": [{ "planets": ["sun", "moon"], "name": "trine", "degrees": 120, "type": "soft" }]
  }
}
```

- アスペクトは、惑星の組み合わせごとに1つ。`planets` は `ALL_PLANETS` の順
- オーブは画面と同じ固定値の 6。マイナーアスペクトは、画面に出していないので含めない

### 四柱推命

`raw` は節気ペアと均時差。

```jsonc
"raw": {
  "sekkiPair": { "today": "小寒", "endOfMonth": "立春" },
  "equationOfTime": -11.9
}
```

`result` のキーは、占いの用語を漢字にする。年齢や年などの一般的な項目は英語にする。

```jsonc
"result": {
  "節": "小寒",
  "真太陽時": {
    "dateTime": "1990-01-23T12:41", // 出生地の暦として読む
    "地方時差": 19.1,                // 分
    "均時差": -11.9                  // 分
  },
  "命式": {
    "年柱": {
      "干支": "己巳",
      "天干": "己",
      "地支": "巳",
      "通変星": "偏印",
      "蔵干": { "本気": "丙", "中気": "庚", "余気": "戊" },
      "蔵干通変星": { "本気": "偏官", "中気": "比肩", "余気": "偏印" },
      "十二運": "長生",
      "特殊星": ["天乙貴人"]
    },
    "月柱": { /* 年柱と同じ項目 */ },
    "日柱": { /* 年柱と同じ項目。通変星は null（日干が基準なので） */ },
    "時柱": { /* 年柱と同じ項目 */ }
  },
  "五行": { "木": 1, "火": 2, "土": 3, "金": 1, "水": 1 },
  "大運": [
    {
      "fromAge": 0,
      "toAge": 7,
      "current": false,
      "干支": "戊寅",
      "天干": "戊",
      "地支": "寅",
      "通変星": "偏印",
      "蔵干": "甲", // 本気
      "蔵干通変星": "偏財",
      "十二運": "絶"
    }
  ],
  "歳運": [
    { "year": 2026, "age": 36, "current": true, "干支": "丙午" /* 以下、大運と同じ項目 */ }
  ]
}
```

- 中気が無い地支（子・卯・午・酉・亥）は、`蔵干` と `蔵干通変星` の `中気` を `null` にする（モデルでは `'-'`）
- 大運は `raw` に入れない。ページは `result.大運` を、今の `Daiun` 型に読み替えて使う
- 歳運は、ページでは今までどおりモデルから計算する（`/suimei` と `/suimei/saiun` で範囲が違うため）

### 数秘術

`raw` は無い（`null`）。

```jsonc
"input": { "date": "1990-01-23", "name": "YAMADA TARO", "maxSameNumber": 22 },
"result": {
  "lifePathNumber": 7,
  "destinyNumber": 3,
  "soulNumber": 11,
  "personalityNumber": 1,
  "maturityNumber": 10,
  "birthdayNumber": 5
}
```

`maxSameNumber` は、ページと同じ固定値の 22。

数秘術のページは、今までどおりブラウザだけで計算する。天文計算が要らないので、JSON を取得する理由が無い。

## エラー

```jsonc
{ "error": { "code": "invalid_query", "message": "date is required", "params": ["date"] } }
```

| code | ステータス | 場面 |
| --- | --- | --- |
| `invalid_query` | 400 | 必須のパラメータが無い、形式や範囲が正しくない。`params` に該当する名前をすべて入れる |
| `calculation_failed` | 400 | 入力は正しいが計算できない。`params` は空 |
| `method_not_allowed` | 405 | GET 以外 |

`params` は、どのエラーにも付ける（`invalid_query` 以外では空の配列）。

`message` は英語。ページは `code` と `params` で分岐して、日本語の案内を出す。
今のページは `errorMessage` の文言で分岐しているので、これを置き換える。

`calculation_failed` になる入力（Docker の `node:24` で確認）:

| 入力 | `message` |
| --- | --- |
| 緯度の絶対値が約 66.56 度（極圏）以上。プラシーダスのハウスを計算できない（66.5 度は計算できる） | `Houses cannot be calculated at this latitude` |
| 天体暦の範囲外の年。3000 年は計算できるが、5400 年と 9999 年は計算できない | `This date cannot be calculated` |

- `message` は固定の文言にする。ライブラリのエラーメッセージは、内部のファイル名やパスを含むので返さない。元のエラーは `console.error` で記録する
- `calculation_failed` にするのは、天文計算の失敗だけ。それ以外の例外（プログラムの不具合）は、そのまま 500 にする。400 を返すと、利用者は入力を直そうとするが、直しようがない
- `page` のプロトコルは `http` か `https` だけ。リクエストのヘッダーがほかの値なら `https` にする

## ヘッダー

| ヘッダー | 値 | 理由 |
| --- | --- | --- |
| `Cache-Control` | 成功: `public, max-age=0, s-maxage=86400` / エラー: `no-store` | 結果は入力だけで決まる。CDN のキャッシュはデプロイで消える |
| `X-Robots-Tag` | `noindex` | 検索結果に JSON が出ないように |

## 構成

```
src/lib/
  json-query.ts          クエリを解釈して、占術ごとの入力にする（必須と範囲の検査）
  json-api.ts            レスポンスの型、ヘッダーを付けて応答する処理、ページの URL
  fetch-json.ts          ページから JSON を取得する。エラーの案内
  fetch-suimei.ts        四柱推命の JSON を取得して、モデルを復元する
src/horoscope/models/
  json.ts                Horoscope → result
src/suimei/models/
  json.ts                Kanshi など → result、result.大運 → Daiun[]
src/numerology/models/
  json.ts                Numerology → result
src/pages/api/
  horoscope.ts           新設
  suimei.ts              新設
  numerology.ts          新設
  horoscope-props.ts     削除
  suimei-props.ts        削除
```

- `json.ts` は純粋な関数で、天文計算（`src/astronomy`）に依存しない。各 `models/index.ts` から export する（数秘術には `index.ts` が無いので、直接 import する）
- `result` の型（`HoroscopeResult` など）は `json.ts` に置く。レスポンス全体の型（`HoroscopeJson` など）は `json-api.ts` に置き、API とページの両方で使う
- ページが送るクエリは、`formValuesToQuery` に緯度と経度を足して作る。`formValuesToQuery` は 0 を省くので、そのままでは赤道や本初子午線の上の出生地を送れない
- API は薄くする。クエリの解釈 → 天文計算 → モデルの生成 → 変換 → 応答
- `scripts/check-file-tracing.js` の対象を、`horoscope` と `suimei` に変える

### ページ

| ページ | 変更 |
| --- | --- |
| `/horoscope` | `/horoscope.json` を取得して、`new Horoscope(json.raw)` |
| `/suimei` | `/suimei.json` を取得して、`raw` から `Kanshi` を復元。大運は `result.大運` を使う |
| `/suimei/saiun` | 同上 |
| `/numerology` | 変更なし |

`/suimei` と `/suimei/saiun` は、取得と復元の処理が重複している。1つの関数にまとめる。
今は、エラーのときに `return` せずに `res.json()` を2回読んでいるので、合わせて直す。

## テスト

| 対象 | 内容 |
| --- | --- |
| `json-query.ts` | 必須の不足、不正な日付・時刻・ゾーン・緯度経度、`time` の省略と `unknown`、範囲外のパラメータを無視すること |
| 各 `json.ts` | 既存のテストと同じ生年月日で、期待値を固定する。中気が無い地支、`thisYear` の有無 |
| API | 今の `suimei-props.test.ts` と同じ方式（ハンドラーを直接呼ぶ）。日本生まれと海外生まれ。エラーの `code` とステータス、ヘッダー |
| `raw` と `result` | レスポンスの `raw` からモデルを復元して変換し直すと、`result` と一致すること |

- 日時を扱うので、`TZ=UTC` と `TZ=America/New_York` でも実行する
- テストの整備は、ロジックの変更より先に済ませて、別のコミットにする
- ビルドの確認: Docker の `node:24` で `output: 'standalone'` を一時的に指定してビルドし、`/horoscope.json` `/suimei.json` `/numerology.json` が返ることを確かめる（`rewrites` とバイナリの両方の確認）

## 今回やらないこと

- OpenAPI の定義、`llms.txt`、MCP サーバー
- オーブ、ハウスシステムの指定
- CORS の許可、アクセスの制限
- 鑑定文（結果の読み解き）
- `/suimei/saiun.json`（歳運は `/suimei.json` に含まれる）

## 確認できないこと

Vercel のプレビュー環境は認証で保護されている。AI から実際に取得できるかは、本番に出してから確かめる。

## 見つけた不具合（別のプルリクエストにする）

3件とも、実行して再現を確かめた。

### アスペクトが漏れる

`Planet.diffLongitude` は、黄経の差を 360 度で折り返していない。
黄経 358 度と 2 度の差は 356 度になり、コンジャンクションにならない。
0 度をまたぐ組み合わせは、ほかのアスペクトも同じように漏れる（300 度と 60 度のトラインなど）。

### ハウスが求まらない

`House.where` は、0 度をまたぐハウスにある惑星のうち、0 度より後ろにあるものを見つけられない。
5ハウスが 337 度 〜 5 度のとき、黄経 3 度の惑星のハウスは `undefined` になる（348 度なら 5 になる）。
JSON では `house` が `null` になる。

### 4桁でない年の歳運が、すべて甲子になる

`generateSaiun` は `DateTime.fromISO(`${year}-12-31`)` で年柱を求めている。
年が 4 桁でないと不正な日時になり、干支が `甲子` に固定される。
西暦 1000 年より前と、10000 年以降が該当する（500 年生まれなら、歳運の 121 件がすべて `甲子`）。命式は正しい。

### 今回の扱い

JSON は画面と同じモデルを使うので、今回は同じ結果を返す。モデルを直せば、画面と JSON の両方が直る。
