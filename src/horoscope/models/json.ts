import type { AsteroidName, PlanetName } from '../../astronomy/types'
import { ALL_PLANETS } from './ALL_PLANETS'
import type { Aspect, MajorAspect } from './Aspect'
import {
  AngleName,
  AspectSettings,
  getAngleAspects,
  getAsteroidAspects,
  getPlanetAspects,
  getPointAspects,
} from './AspectSettings'
import { ASTEROID_NAMES, ASTEROID_NAMES_JA, ASTEROID_TYPES } from './Asteroid'
import type { Horoscope } from './Horoscope'
import { DEFAULT_HOUSE_SYSTEM, HouseSystem } from './HouseSystem'
import { POINT_NAMES, POINT_NAMES_JA, POINT_TYPES, PointName, PointVariant, getPointVariant } from './Point'
import { PLANET_NAMES_JA, Planet } from './Planet'
import { Position } from './Position'

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
  variant: PointVariant | null // 求め方が複数あるものは、どれで求めたか
  isRetrograde: boolean
  house: number | null
}

// 小惑星とキロン
type AsteroidJson = PositionJson & {
  name: AsteroidName
  nameJa: (typeof ASTEROID_NAMES_JA)[AsteroidName]
  type: (typeof ASTEROID_TYPES)[AsteroidName]
  isRetrograde: boolean
  house: number | null
}

// アスペクトの名前と、角度と、種類（hard / soft / minor）
type AspectKindJson<T extends Aspect = Aspect> = Pick<T, 'name' | 'degrees' | 'type'>

type AspectJson<T extends Aspect = Aspect> = AspectKindJson<T> & { planets: [PlanetName, PlanetName] }

// 惑星以外のものと、惑星のアスペクト
type AngleAspectJson = AspectKindJson<MajorAspect> & { angle: AngleName; planet: PlanetName }
type AsteroidAspectJson = AspectKindJson<MajorAspect> & { asteroid: AsteroidName; planet: PlanetName }
type PointAspectJson = AspectKindJson<MajorAspect> & { point: PointName; planet: PlanetName }

export type HoroscopeResult = {
  planets: PlanetJson[]
  asteroids: AsteroidJson[] | null // 計算できない日付（1800年より前、2400年より後）では null
  points: PointJson[]
  houses: {
    system: HouseSystem // ハウスシステム
    ascendant: PositionJson
    mc: PositionJson
    cusps: (PositionJson & { house: number })[]
  }
  aspects: {
    settings: AspectSettings // アスペクトの求め方（オーブなど）
    major: AspectJson<MajorAspect>[]
    minor: AspectJson[] // settings.minor で選んだものだけ
    angles: AngleAspectJson[]
    asteroids: AsteroidAspectJson[]
    points: PointAspectJson[]
  }
}

const toPositionJson = ({ sign, degrees, longitude }: Position): PositionJson => ({ sign, degrees, longitude })

// NOTE: オブジェクトを展開（...）すると、アスペクトの項目が先に並ぶ。今までの並び順（相手が先）を保つ
const toAspectKindJson = <T extends Aspect>({ name, degrees, type }: T): AspectKindJson<T> => ({ name, degrees, type })

// houseSystem は、horoscope を計算したときの、ハウスシステム
export const toHoroscopeResult = (
  horoscope: Horoscope,
  settings: AspectSettings,
  houseSystem: HouseSystem = DEFAULT_HOUSE_SYSTEM
): HoroscopeResult => {
  const { planets, asteroids, points, house } = horoscope
  const planetAspects = getPlanetAspects(horoscope, settings).map(({ planets, aspect }) => ({
    planets,
    ...toAspectKindJson(aspect),
  }))
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
    asteroids: asteroids
      ? ASTEROID_NAMES.map((name) => {
          const asteroid = asteroids[name]
          return {
            name,
            nameJa: ASTEROID_NAMES_JA[name],
            type: ASTEROID_TYPES[name],
            ...toPositionJson(asteroid.position),
            isRetrograde: asteroid.isRetrograde,
            house: asteroid.house ?? null,
          }
        })
      : null,
    points: POINT_NAMES.map((name) => {
      const point = points[name]
      return {
        name,
        nameJa: POINT_NAMES_JA[name],
        type: POINT_TYPES[name],
        variant: getPointVariant(name, horoscope),
        ...toPositionJson(point.position),
        isRetrograde: point.isRetrograde,
        house: point.house ?? null,
      }
    }),
    houses: {
      system: houseSystem,
      ascendant: toPositionJson(house.ascendant),
      mc: toPositionJson(house.mc),
      cusps: house.cusps.map((cusp, i) => ({ house: i + 1, ...toPositionJson(cusp) })),
    },
    aspects: {
      settings,
      // 惑星の組み合わせごとに1つ。メジャーかマイナーの、どちらかに入る
      major: planetAspects.filter((_): _ is AspectJson<MajorAspect> => _.type !== 'minor'),
      minor: planetAspects.filter((_) => _.type === 'minor'),
      angles: getAngleAspects(horoscope, settings.ascMc).map(({ angle, planet, aspect }) => ({
        angle,
        planet,
        ...toAspectKindJson(aspect),
      })),
      asteroids: getAsteroidAspects(horoscope, settings.asteroid).map(({ asteroid, planet, aspect }) => ({
        asteroid,
        planet,
        ...toAspectKindJson(aspect),
      })),
      points: getPointAspects(horoscope, settings.point).map(({ point, planet, aspect }) => ({
        point,
        planet,
        ...toAspectKindJson(aspect),
      })),
    },
  }
}
