import type { PlanetName } from '../../astronomy/types'
import { ALL_PLANETS } from './ALL_PLANETS'
import type { Horoscope } from './Horoscope'

// ドラゴンヘッドとドラゴンテイル
// 月の軌道と、太陽の通り道（黄道）が交わる2つの点。天体ではなく、ASCやMCと同じ感受点。
// ただし、位置は日時だけで決まり、サインとハウスを読むので、惑星と同じ形（Planet）で扱う
export const NODE_NAMES = ['northNode', 'southNode'] as const
export type NodeName = (typeof NODE_NAMES)[number]

export const NODE_ICONS = {
  northNode: '☊',
  southNode: '☋',
} as const

export const NODE_NAMES_JA = {
  northNode: 'ドラゴンヘッド',
  southNode: 'ドラゴンテイル',
} as const

// 惑星とのコンジャンクションのオーブ。感受点は、惑星より狭く取る
// TODO:固定値ではなく、ユーザーが画面から指定した値を使うようにしたい
export const NODE_ORB = 3

export type NodeConjunction = { node: NodeName; planet: PlanetName }

// 惑星とのコンジャンクション
// NOTE: ドラゴンテイルは、ドラゴンヘッドの反対側にある。ほかのアスペクトまで求めると、同じ情報が2回ずつ出る
// （ドラゴンテイルとのセクスタイルは、ドラゴンヘッドとのトライン）ので、コンジャンクションだけを求める
export const getNodeConjunctions = ({ planets, nodes }: Horoscope, orb: number): NodeConjunction[] =>
  NODE_NAMES.flatMap((node) =>
    ALL_PLANETS.filter((planet) => planets[planet].diffLongitude(nodes[node].longitude) <= orb).map((planet) => ({
      node,
      planet,
    }))
  )
