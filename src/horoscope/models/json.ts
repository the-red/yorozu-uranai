import type { PlanetName } from '../../astronomy/types'
import { ALL_PLANETS } from './ALL_PLANETS'
import type { Horoscope } from './Horoscope'
import { NODE_NAMES, NODE_NAMES_JA, NodeConjunction, NodeName, getNodeConjunctions } from './Node'
import { MajorAspect, PLANET_NAMES_JA, Planet } from './Planet'
import { Position } from './Position'

// アスペクトのオーブ
// TODO:固定値ではなく、ユーザーが画面から指定した値を使うようにしたい
export const ORB = 6

type PositionJson = {
  sign: Position['sign']
  degrees: number // サインの中での度数
  longitude: number // 黄経
}

type PlanetJson = PositionJson & {
  name: PlanetName
  nameJa: (typeof PLANET_NAMES_JA)[PlanetName]
  isRetrograde: boolean
  house: number | null
  element: NonNullable<Planet['element']> | null
  quality: NonNullable<Planet['quality']> | null
  polarity: NonNullable<Planet['polarity']> | null
}

// ドラゴンヘッドとドラゴンテイル。天体ではないので、四元素などの分類は持たない
type NodeJson = PositionJson & {
  name: NodeName
  nameJa: (typeof NODE_NAMES_JA)[NodeName]
  isRetrograde: boolean
  house: number | null
}

type AspectJson = {
  planets: [PlanetName, PlanetName]
  name: MajorAspect['name']
  degrees: MajorAspect['degrees']
  type: MajorAspect['type']
}

// ドラゴンヘッド・ドラゴンテイルと、惑星のコンジャンクション
type NodeAspectJson = NodeConjunction & {
  name: 'conjunction'
  degrees: 0
}

export type HoroscopeResult = {
  planets: PlanetJson[]
  nodeType: 'true' // ドラゴンヘッドの求め方。真位置（トゥルーノード）
  nodes: NodeJson[]
  houses: {
    ascendant: PositionJson
    mc: PositionJson
    cusps: (PositionJson & { house: number })[]
  }
  aspects: {
    orb: number
    major: AspectJson[]
    nodeOrb: number
    nodes: NodeAspectJson[]
  }
}

const toPositionJson = ({ sign, degrees, longitude }: Position): PositionJson => ({ sign, degrees, longitude })

export const toHoroscopeResult = (horoscope: Horoscope, orb: number, nodeOrb: number): HoroscopeResult => {
  const { planets, nodes, house } = horoscope
  return {
    planets: ALL_PLANETS.map((name) => {
      const planet = planets[name]
      return {
        name,
        nameJa: PLANET_NAMES_JA[name],
        ...toPositionJson(planet.position),
        isRetrograde: planet.isRetrograde,
        house: planet.house ?? null,
        element: planet.element ?? null,
        quality: planet.quality ?? null,
        polarity: planet.polarity ?? null,
      }
    }),
    nodeType: 'true',
    nodes: NODE_NAMES.map((name) => {
      const node = nodes[name]
      return {
        name,
        nameJa: NODE_NAMES_JA[name],
        ...toPositionJson(node.position),
        isRetrograde: node.isRetrograde,
        house: node.house ?? null,
      }
    }),
    houses: {
      ascendant: toPositionJson(house.ascendant),
      mc: toPositionJson(house.mc),
      cusps: house.cusps.map((cusp, i) => ({ house: i + 1, ...toPositionJson(cusp) })),
    },
    aspects: {
      orb,
      // 惑星の組み合わせごとに1つ
      major: ALL_PLANETS.flatMap((from, i) =>
        ALL_PLANETS.slice(i + 1).flatMap((to) => {
          const aspect = planets[from].majorAspect(planets[to], orb)
          return aspect ? [{ planets: [from, to] as [PlanetName, PlanetName], ...aspect }] : []
        })
      ),
      nodeOrb,
      nodes: getNodeConjunctions(horoscope, nodeOrb).map((_) => ({
        ..._,
        name: 'conjunction' as const,
        degrees: 0 as const,
      })),
    },
  }
}
