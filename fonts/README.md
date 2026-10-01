# 元のフォント

文字を絞る前のフォント。配信はしない（`public/` の外に置いている）。

`yarn fonts` が、ここから、ソースコード（`src/`）に出てくる文字だけを取り出して、`public/fonts/` に書き出す（`scripts/subset-fonts.mjs`）。

| ファイル | フォント | 版 | 使う場所 |
| --- | --- | --- | --- |
| `YujiSyuku-Regular.ttf` | Yuji Syuku | 3.002 | 四柱推命の見出し |
| `ZenOldMincho-Bold.ttf` | Zen Old Mincho Bold | 1.500 | 四柱推命の命式の表、送信ボタン、エラーの文章 |

- ライセンスは、どちらも SIL Open Font License 1.1。文字を絞ったものも、同じライセンスで配布できる
  - 著作権表示とライセンスは、絞ったフォントの中にも残している（name テーブルの 0、13、14）
  - 予約されたフォント名（Reserved Font Name）は、指定されていない。絞ったフォントも、元の名前のまま使える
- 配布元
  - Yuji Syuku: https://github.com/Kinutafontfactory/Yuji
  - Zen Old Mincho: https://github.com/googlefonts/zen-oldmincho

## フォントを足すとき

絞ってよいのは、決まった文言にしか使わないフォントだけ。住所や、利用者が入力した文字を表示する場所のフォントは、絞らない（どの文字が来るか分からない）。

1. 元のフォントを、ここに置く
2. `scripts/subset-fonts.mjs` の `FONTS` に足す
3. CSS の `@font-face` で、書き出したファイル（`/fonts/<名前>.subset.woff2`）を参照する
