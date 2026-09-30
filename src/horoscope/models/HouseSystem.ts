// ハウスシステム（ハウスの分け方）。利用者が選ぶ
// 並び順は、選択肢の順番
export const HOUSE_SYSTEMS = [
  'placidus',
  'koch',
  'regiomontanus',
  'campanus',
  'porphyry',
  'equal',
  'wholeSign',
] as const
export type HouseSystem = (typeof HOUSE_SYSTEMS)[number]

export const DEFAULT_HOUSE_SYSTEM: HouseSystem = 'placidus'

export const HOUSE_SYSTEM_NAMES_JA = {
  placidus: 'プラシーダス',
  koch: 'コッホ',
  regiomontanus: 'レジオモンタヌス',
  campanus: 'キャンパナス',
  porphyry: 'ポーフィリー',
  equal: 'イコール',
  wholeSign: 'ホールサイン',
} as const

// Swiss Ephemeris での記号
// NOTE: イコールは、Asc を 1ハウスの起点にして、30度ずつに分ける。
// ホールサインは、Asc のあるサインを、まるごと 1ハウスにする（カスプは、すべてサインの 0度）。
// どちらも、Mc は 10ハウスの起点にならない。ホールサインでは、Asc も 1ハウスの起点にならない
export const HOUSE_SYSTEM_CODES = {
  placidus: 'P',
  koch: 'K',
  regiomontanus: 'R',
  campanus: 'C',
  porphyry: 'O',
  equal: 'A',
  wholeSign: 'W',
} as const

// URLの値から読み取る。読み取れなければ undefined
export const toHouseSystem = (value: string): HouseSystem | undefined => HOUSE_SYSTEMS.find((_) => _ === value)
