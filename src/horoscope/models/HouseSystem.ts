// ハウスシステム（ハウスの分け方）。利用者が選ぶ
// Swiss Ephemeris が計算できるもののうち、12ハウスに分けるものを、すべて入れている
// - 入れていないもの: ガークラン・セクター（G。36 に分ける）、E（イコールと同じ）、i（サンシャインの別の計算方法）
//
// 並び順は、選択肢の順番。主なもの（MAIN_HOUSE_SYSTEMS）を先に置く
export const HOUSE_SYSTEMS = [
  'placidus',
  'koch',
  'regiomontanus',
  'campanus',
  'porphyry',
  'equal',
  'wholeSign',
  'alcabitius',
  'topocentric',
  'morinus',
  'meridian',
  'equalMc',
  'vehlow',
  'equalAries',
  'sripati',
  'carter',
  'horizon',
  'krusinski',
  'pullenSd',
  'pullenSr',
  'savardA',
  'sunshine',
  'apc',
] as const
export type HouseSystem = (typeof HOUSE_SYSTEMS)[number]

export const DEFAULT_HOUSE_SYSTEM: HouseSystem = 'placidus'

// 主なもの。選択肢で、ほかと分けて、先に出す
export const MAIN_HOUSE_SYSTEMS: readonly HouseSystem[] = HOUSE_SYSTEMS.slice(0, HOUSE_SYSTEMS.indexOf('alcabitius'))

// 画面に出す名前
// NOTE: アルファベットで書く。カタカナにすると、書き方が人によって違い、どれを指すのかが、分かりにくい
export const HOUSE_SYSTEM_NAMES = {
  placidus: 'Placidus',
  koch: 'Koch',
  regiomontanus: 'Regiomontanus',
  campanus: 'Campanus',
  porphyry: 'Porphyry',
  equal: 'Equal',
  wholeSign: 'Whole Sign',
  alcabitius: 'Alcabitius',
  topocentric: 'Topocentric',
  morinus: 'Morinus',
  meridian: 'Meridian',
  equalMc: 'Equal (Mc)',
  vehlow: 'Vehlow',
  equalAries: 'Equal (0° Aries)',
  sripati: 'Sripati',
  carter: 'Carter',
  horizon: 'Horizon',
  krusinski: 'Krusinski',
  pullenSd: 'Pullen SD',
  pullenSr: 'Pullen SR',
  savardA: 'Savard-A',
  sunshine: 'Sunshine',
  apc: 'APC',
} as const satisfies Record<HouseSystem, string>

// Swiss Ephemeris での記号
// NOTE: Asc と Mc が、ハウスの起点にならないものがある
// - イコールは、Asc を 1ハウスの起点にして、30度ずつに分ける。Mc は、10ハウスの起点にならない
// - ホールサインは、Asc のあるサインを、まるごと 1ハウスにする（カスプは、すべてサインの 0度）
// - ヴェーロウとシュリパティは、Asc を、1ハウスの中央に置く
// - モリナス、メリディアン、ホリゾンタル、イコール（Mc 起点、牡羊座 0° 起点）は、Asc を使わずに分ける
// NOTE: 向かい合うハウスのカスプが、180度の反対側にならないものがある（サンシャイン、APC）
export const HOUSE_SYSTEM_CODES = {
  placidus: 'P',
  koch: 'K',
  regiomontanus: 'R',
  campanus: 'C',
  porphyry: 'O',
  equal: 'A',
  wholeSign: 'W',
  alcabitius: 'B',
  topocentric: 'T',
  morinus: 'M',
  meridian: 'X',
  equalMc: 'D',
  vehlow: 'V',
  equalAries: 'N',
  sripati: 'S',
  carter: 'F',
  horizon: 'H',
  krusinski: 'U',
  pullenSd: 'L',
  pullenSr: 'Q',
  savardA: 'J',
  sunshine: 'I',
  apc: 'Y',
} as const satisfies Record<HouseSystem, string>

// URLの値から読み取る。読み取れなければ undefined
export const toHouseSystem = (value: string): HouseSystem | undefined => HOUSE_SYSTEMS.find((_) => _ === value)
