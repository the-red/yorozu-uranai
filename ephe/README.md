# 天体暦のファイル

[Swiss Ephemeris](https://www.astro.com/swisseph/) の天体暦のファイル。小惑星（セレス、パラス、ジュノ、ベスタ）とキロンの計算に使う。

| ファイル | 内容 | 期間 |
| --- | --- | --- |
| `seas_18.se1` | 小惑星とキロン | 1800 年から 2399 年まで |
| `sepl_18.se1` | 惑星 | 1800 年から 2399 年まで |

- 作成元は Astrodienst AG。ライセンスは、Swiss Ephemeris と同じ（このリポジトリでは、AGPL を選んでいる）
- ライブラリ（`sweph`）には、天体暦のファイルが同梱されていない。配布元の公式リポジトリから、ダウンロードして置いている
  - https://github.com/aloistr/swisseph/tree/master/ephe
  - コミット `cae9ecd4b201544d85e411aced17660932514d43`（2026-05-29）のもの。2026-05-26 に、JPL の天体暦 DE441 から作られている
- 月のファイル（`semo_18.se1`）は、置いていない。月は、計算式（Moshier）で求める

## 更新するとき

配布元のファイルが新しくなったら、同じ名前のファイルを置き換える。

```sh
COMMIT=<配布元のコミット>
for f in seas_18.se1 sepl_18.se1; do
  curl -fL -o ephe/$f https://raw.githubusercontent.com/aloistr/swisseph/$COMMIT/ephe/$f
done
```

- `git hash-object ephe/<ファイル>` の値が、配布元のファイルの SHA（GitHub の API の `sha`）と一致することを確かめる
- 小惑星とキロンの位置が変わるので、テストの期待値を計算し直す
- 上のコミットと、下のハッシュを書き換える

SHA-256:

```
a2cd8fc33807c78ca9a700c91c2e042258b12fc4796519e00781440b5ad8b2e2  seas_18.se1
ca1393ceab3a44fbc895887cf789c68819ae6a1cbc9b22225872dbe4ccd99a66  sepl_18.se1
```
