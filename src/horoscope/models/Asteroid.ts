import type { AsteroidName } from '../../astronomy/types'

// 小惑星（セレス、パラス、ジュノ、ベスタ）と、キロン
// 惑星と同じく、実際にある天体。サインとハウスを読み、逆行もする
//
// 並び順は、表示の順番。小惑星は番号の順に、キロンは最後に置く
export const ASTEROID_NAMES = ['ceres', 'pallas', 'juno', 'vesta', 'chiron'] as const satisfies readonly AsteroidName[]

export const ASTEROID_ICONS = {
  chiron: '⚷',
  ceres: '⚳',
  pallas: '⚴',
  juno: '⚵',
  vesta: '⚶',
} as const

export const ASTEROID_NAMES_JA = {
  chiron: 'キロン',
  ceres: 'セレス',
  pallas: 'パラス',
  juno: 'ジュノ',
  vesta: 'ベスタ',
} as const

// 種類。キロンは、小惑星と彗星の中間の天体（ケンタウルス族）
export const ASTEROID_TYPES = {
  chiron: 'centaur',
  ceres: 'asteroid',
  pallas: 'asteroid',
  juno: 'asteroid',
  vesta: 'asteroid',
} as const
