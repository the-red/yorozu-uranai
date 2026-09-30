# 天体暦のファイル

[Swiss Ephemeris](https://www.astro.com/swisseph/) の天体暦のファイル。小惑星（セレス、パラス、ジュノ、ベスタ）とキロンの計算に使う。

| ファイル | 内容 | 期間 |
| --- | --- | --- |
| `seas_18.se1` | 小惑星とキロン | 1800 年から 2399 年まで |
| `sepl_18.se1` | 惑星 | 1800 年から 2399 年まで |

- 作成元は Astrodienst AG。ライセンスは、Swiss Ephemeris と同じ（このリポジトリでは、AGPL を選んでいる）
- 以前に使っていたライブラリ（`swisseph` 0.5.17）に同梱されていたものを、そのまま置いている。計算結果を変えないため
  - 今のライブラリ（`sweph`）には、天体暦のファイルが同梱されていない
  - 配布元（https://github.com/aloistr/swisseph/tree/master/ephe）には、新しく作り直されたファイルがある。替えると、小惑星とキロンの位置が、最大で 4 秒角ほど変わる
- 月のファイル（`semo_18.se1`）は、置いていない。月は、計算式（Moshier）で求める

SHA-256:

```
0afe3f94769b6718082411c2c4fb06bf9d1aaa6c0bc1bad8f8b8725421ef8748  seas_18.se1
0b7e416e3c1be9e6a0dd1d711dae7f7685793a0e7df13f76363a493dc27b6ea1  sepl_18.se1
```
