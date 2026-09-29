import type { PlanetName } from '../../astronomy/types'
import { ALL_PLANETS } from './ALL_PLANETS'
import type { Horoscope } from './Horoscope'

// 感受点。天体ではなく、計算で求める点
// NOTE: ASCとMCも感受点だが、ハウスの起点なので、House で扱う
//
// ヘッドとテイル（ドラゴンヘッド、ドラゴンテイル）は、月の軌道と、太陽の通り道（黄道）が交わる2つの点。
// 位置は日時だけで決まり、サインとハウスを読むので、惑星と同じ形（Planet）で扱う
export const POINT_NAMES = ['northNode', 'southNode'] as const
export type PointName = (typeof POINT_NAMES)[number]

export const POINT_ICONS = {
  northNode: '☊',
  southNode: '☋',
} as const

export const POINT_NAMES_JA = {
  northNode: 'ヘッド',
  southNode: 'テイル',
} as const

// 種類
export const POINT_TYPES = {
  northNode: 'node',
  southNode: 'node',
} as const

// 惑星とのコンジャンクションのオーブ。感受点は、惑星より狭く取る
// TODO:固定値ではなく、ユーザーが画面から指定した値を使うようにしたい
export const POINT_ORB = 3

export type PointConjunction = { point: PointName; planet: PlanetName }

// 惑星とのコンジャンクション
// NOTE: テイルは、ヘッドの反対側にある。ほかのアスペクトまで求めると、同じ情報が2回ずつ出る
// （テイルとのセクスタイルは、ヘッドとのトライン）ので、コンジャンクションだけを求める
export const getPointConjunctions = ({ planets, points }: Horoscope, orb: number): PointConjunction[] =>
  POINT_NAMES.flatMap((point) =>
    ALL_PLANETS.filter((planet) => planets[planet].diffLongitude(points[point].longitude) <= orb).map((planet) => ({
      point,
      planet,
    }))
  )
