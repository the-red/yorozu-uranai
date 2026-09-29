import type { PlanetName } from '../../astronomy/types'
import { ALL_PLANETS } from './ALL_PLANETS'
import type { Horoscope } from './Horoscope'
import { POINT_NAMES, POINT_NAMES_JA, POINT_TYPES, PointConjunction, PointName, getPointConjunctions } from './Point'
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

// 感受点。天体ではないので、四元素などの分類は持たない
type PointJson = PositionJson & {
  name: PointName
  nameJa: (typeof POINT_NAMES_JA)[PointName]
  type: (typeof POINT_TYPES)[PointName]
  variant: 'true' | null // 求め方が複数あるものは、どれで求めたか。ヘッドとテイルは、真位置（トゥルーノード）
  isRetrograde: boolean
  house: number | null
}

type AspectJson = {
  planets: [PlanetName, PlanetName]
  name: MajorAspect['name']
  degrees: MajorAspect['degrees']
  type: MajorAspect['type']
}

// 感受点と、惑星のコンジャンクション
type PointAspectJson = PointConjunction & {
  name: 'conjunction'
  degrees: 0
}

export type HoroscopeResult = {
  planets: PlanetJson[]
  points: PointJson[]
  houses: {
    ascendant: PositionJson
    mc: PositionJson
    cusps: (PositionJson & { house: number })[]
  }
  aspects: {
    orb: number
    major: AspectJson[]
    pointOrb: number
    points: PointAspectJson[]
  }
}

const toPositionJson = ({ sign, degrees, longitude }: Position): PositionJson => ({ sign, degrees, longitude })

export const toHoroscopeResult = (horoscope: Horoscope, orb: number, pointOrb: number): HoroscopeResult => {
  const { planets, points, house } = horoscope
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
    points: POINT_NAMES.map((name) => {
      const point = points[name]
      return {
        name,
        nameJa: POINT_NAMES_JA[name],
        type: POINT_TYPES[name],
        variant: 'true' as const,
        ...toPositionJson(point.position),
        isRetrograde: point.isRetrograde,
        house: point.house ?? null,
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
      pointOrb,
      points: getPointConjunctions(horoscope, pointOrb).map((_) => ({
        ..._,
        name: 'conjunction' as const,
        degrees: 0 as const,
      })),
    },
  }
}
