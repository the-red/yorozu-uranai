export type PlanetName =
  'sun' | 'moon' | 'mercury' | 'venus' | 'mars' | 'jupiter' | 'saturn' | 'uranus' | 'neptune' | 'pluto'

// 小惑星（セレス、パラス、ジュノ、ベスタ）と、キロン
export type AsteroidName = 'chiron' | 'ceres' | 'pallas' | 'juno' | 'vesta'

// 位置を計算できるもの
// - trueNode: ドラゴンヘッド（月の昇交点）の真位置
// - meanApogee: リリス（月の遠地点）の平均の位置
export type Body = PlanetName | AsteroidName | 'trueNode' | 'meanApogee'

// 黄道座標。角度は度、距離は天文単位、速度は1日あたり
export type EclipticPosition = {
  longitude: number
  latitude: number
  distance: number
  longitudeSpeed: number
  latitudeSpeed: number
  distanceSpeed: number
  rflag: number // 計算に使われた方法（Swiss Ephemeris のフラグ）
  isRetrograde: boolean // trueなら逆行
}

export type HouseCusps = number[]

export type Houses = {
  house: HouseCusps // 1ハウスから12ハウスまでのカスプ
  ascendant: number
  mc: number
  armc: number
  vertex: number
  equatorialAscendant: number
  kochCoAscendant: number
  munkaseyCoAscendant: number
  munkaseyPolarAscendant: number
}
