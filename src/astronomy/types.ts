import type { swe_houses, swe_calc_ut } from 'swisseph'

export type PlanetName =
  'sun' | 'moon' | 'mercury' | 'venus' | 'mars' | 'jupiter' | 'saturn' | 'uranus' | 'neptune' | 'pluto'

// 小惑星（セレス、パラス、ジュノ、ベスタ）と、キロン
export type AsteroidName = 'chiron' | 'ceres' | 'pallas' | 'juno' | 'vesta'

// 位置を計算できるもの
// - trueNode: ドラゴンヘッド（月の昇交点）の真位置
// - meanApogee: リリス（月の遠地点）の平均の位置
export type Body = PlanetName | AsteroidName | 'trueNode' | 'meanApogee'

export type EclipticPosition = Extract<ReturnType<typeof swe_calc_ut>, { longitude: number }> & {
  isRetrograde: boolean // trueなら逆行
}

export type HouseCusps = number[]

export type Houses = Extract<ReturnType<typeof swe_houses>, { house: HouseCusps }>
