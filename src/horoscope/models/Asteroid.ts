import type { AsteroidName, PlanetName } from '../../astronomy/types'
import { ALL_PLANETS } from './ALL_PLANETS'
import type { Horoscope } from './Horoscope'

// 小惑星（セレス、パラス、ジュノ、ベスタ）と、キロン
// 惑星と同じく、実際にある天体。サインとハウスを読み、逆行もする
//
// 並び順は、表示の順番。よく使われるキロンを先に、小惑星は番号の順に置く
export const ASTEROID_NAMES = ['chiron', 'ceres', 'pallas', 'juno', 'vesta'] as const satisfies readonly AsteroidName[]

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

export type AsteroidConjunction = { asteroid: AsteroidName; planet: PlanetName }

// 惑星とのコンジャンクション
// NOTE: 感受点と同じ表に並べるので、感受点と同じく、コンジャンクションだけを求める
export const getAsteroidConjunctions = ({ planets, asteroids }: Horoscope, orb: number): AsteroidConjunction[] =>
  asteroids
    ? ASTEROID_NAMES.flatMap((asteroid) =>
        ALL_PLANETS.filter((planet) => planets[planet].diffLongitude(asteroids[asteroid].longitude) <= orb).map(
          (planet) => ({ asteroid, planet })
        )
      )
    : []
