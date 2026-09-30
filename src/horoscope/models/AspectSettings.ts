import type { AsteroidName, PlanetName } from '../../astronomy/types'
import { ALL_PLANETS } from './ALL_PLANETS'
import {
  Aspect,
  CONJUNCTION,
  Found,
  MAJOR_ASPECTS,
  MINOR_ASPECTS,
  MINOR_DEGREES,
  MajorAspect,
  MinorDegrees,
  closest,
  findAspect,
} from './Aspect'
import { ASTEROID_NAMES } from './Asteroid'
import type { Horoscope } from './Horoscope'
import { POINT_NAMES, PointName } from './Point'

// アスペクトの求め方。利用者が調整する
//
// 相手によって、読み方が違うので、4つに分けている。どれも、惑星とのアスペクトを求める
// - 惑星どうし: メジャーアスペクトと、選んだマイナーアスペクト
// - Asc・Mc: 惑星と同じように、メジャーアスペクトを読むことが多い
// - 小惑星とキロン、感受点: コンジャンクションだけを読むことが多い。オーブは、惑星より狭く取る
// NOTE: 惑星以外どうしのアスペクト（ヘッドとリリスなど）は、求めない

// 求めるアスペクト。コンジャンクションだけか、メジャーアスペクトの5種類か
export const ASPECT_SETS = ['conjunction', 'major'] as const
export type AspectSet = (typeof ASPECT_SETS)[number]

// 惑星以外のグループ
export const ASPECT_GROUPS = ['ascMc', 'asteroid', 'point'] as const
export type AspectGroup = (typeof ASPECT_GROUPS)[number]
export type GroupSettings = { aspects: AspectSet; orb: number }

export type AspectSettings = {
  orb: number // 惑星どうしの、メジャーアスペクトのオーブ
  sunMoonPlus: number // 太陽か月を含む組み合わせで、メジャーアスペクトのオーブに足す度数
  minor: MinorDegrees[] // 惑星どうしで求める、マイナーアスペクト。角度の小さい順
  minorOrb: number // マイナーアスペクトのオーブ
} & Record<AspectGroup, GroupSettings>

// 最初の状態
// NOTE: 惑星どうしは、メジャーアスペクトだけ。テイルは、ヘッドの反対側にあるので、感受点でメジャーアスペクトを求めると、
// 同じ情報が2回ずつ出る（テイルとのセクスタイルは、ヘッドとのトライン）
export const DEFAULT_ASPECT_SETTINGS: AspectSettings = {
  orb: 6,
  sunMoonPlus: 0,
  minor: [],
  minorOrb: 2,
  ascMc: { aspects: 'major', orb: 6 },
  asteroid: { aspects: 'conjunction', orb: 3 },
  point: { aspects: 'conjunction', orb: 3 },
}

export const MAX_ORB = 15

export const ANGLE_NAMES = ['ascendant', 'mc'] as const
export type AngleName = (typeof ANGLE_NAMES)[number]

export type PlanetAspect = { planets: [PlanetName, PlanetName]; aspect: Aspect }
export type AngleAspect = { angle: AngleName; planet: PlanetName; aspect: MajorAspect }
export type AsteroidAspect = { asteroid: AsteroidName; planet: PlanetName; aspect: MajorAspect }
export type PointAspect = { point: PointName; planet: PlanetName; aspect: MajorAspect }

const isSunOrMoon = (name: PlanetName) => name === 'sun' || name === 'moon'

// 惑星どうしのアスペクト
// NOTE: メジャーとマイナーの両方のオーブに収まるときは、ずれの小さいほうを選ぶ
export const getPlanetAspect = (
  { planets }: Horoscope,
  from: PlanetName,
  to: PlanetName,
  { orb, sunMoonPlus, minor, minorOrb }: AspectSettings
): Aspect | undefined => {
  const diff = planets[from].diffLongitude(planets[to].longitude)
  const majorOrb = orb + (isSunOrMoon(from) || isSunOrMoon(to) ? sunMoonPlus : 0)
  const candidates: (Found<Aspect> | undefined)[] = [
    findAspect(diff, MAJOR_ASPECTS, majorOrb),
    findAspect(
      diff,
      MINOR_ASPECTS.filter((_) => minor.includes(_.degrees)),
      minorOrb
    ),
  ]
  return closest(candidates)?.aspect
}

// 惑星どうしのアスペクト。惑星の組み合わせごとに1つ
export const getPlanetAspects = (horoscope: Horoscope, settings: AspectSettings): PlanetAspect[] =>
  ALL_PLANETS.flatMap((from, i) =>
    ALL_PLANETS.slice(i + 1).flatMap((to) => {
      const aspect = getPlanetAspect(horoscope, from, to, settings)
      return aspect ? [{ planets: [from, to] as [PlanetName, PlanetName], aspect }] : []
    })
  )

// 惑星と、ある黄経とのアスペクト
const getAspectsWith = (
  { planets }: Horoscope,
  longitude: number,
  { aspects, orb }: GroupSettings
): { planet: PlanetName; aspect: MajorAspect }[] =>
  ALL_PLANETS.flatMap((planet) => {
    const found = findAspect(
      planets[planet].diffLongitude(longitude),
      aspects === 'major' ? MAJOR_ASPECTS : [CONJUNCTION],
      orb
    )
    return found ? [{ planet, aspect: found.aspect }] : []
  })

// Asc・Mc と、惑星のアスペクト
export const getAngleAspects = (horoscope: Horoscope, settings: GroupSettings): AngleAspect[] =>
  ANGLE_NAMES.flatMap((angle) =>
    getAspectsWith(horoscope, horoscope.house[angle].longitude, settings).map((_) => ({ angle, ..._ }))
  )

// 小惑星とキロンと、惑星のアスペクト
export const getAsteroidAspects = (horoscope: Horoscope, settings: GroupSettings): AsteroidAspect[] => {
  const { asteroids } = horoscope
  return asteroids
    ? ASTEROID_NAMES.flatMap((asteroid) =>
        getAspectsWith(horoscope, asteroids[asteroid].longitude, settings).map((_) => ({ asteroid, ..._ }))
      )
    : []
}

// 感受点と、惑星のアスペクト
export const getPointAspects = (horoscope: Horoscope, settings: GroupSettings): PointAspect[] =>
  POINT_NAMES.flatMap((point) =>
    getAspectsWith(horoscope, horoscope.points[point].longitude, settings).map((_) => ({ point, ..._ }))
  )

// URLのクエリ
// NOTE: 最初の状態と同じ項目は、クエリに入れない。今までのURLは、そのまま、今までと同じ結果になる
export const ASPECT_QUERY_KEYS = [
  'orb',
  'sunMoonPlus',
  'minor',
  'minorOrb',
  'ascMcAspects',
  'ascMcOrb',
  'asteroidAspects',
  'asteroidOrb',
  'pointAspects',
  'pointOrb',
] as const
export type AspectQueryKey = (typeof ASPECT_QUERY_KEYS)[number]
export type AspectQuery = Partial<Record<AspectQueryKey, string>>

// オーブ。0 から MAX_ORB までの数
const toOrb = (value: string): number | undefined => {
  const orb = Number(value)
  return /^\d+(\.\d+)?$/.test(value) && orb <= MAX_ORB ? orb : undefined
}

// マイナーアスペクト。角度を、カンマで区切って並べる（minor=30,150）
const toMinor = (value: string): MinorDegrees[] | undefined => {
  const degrees = value.split(',').map(Number)
  const isValid = degrees.every((_) => (MINOR_DEGREES as readonly number[]).includes(_))
  return isValid ? MINOR_DEGREES.filter((_) => degrees.includes(_)) : undefined
}

const toAspectSet = (value: string): AspectSet | undefined => ASPECT_SETS.find((_) => _ === value)

// クエリから読み取る。読み取れなかった項目は、最初の状態のままにして、invalid に入れる
// NOTE: ページは、読み取れなかった項目を無視する。JSON は、エラーにする
export const parseAspectQuery = (
  query: Partial<Record<string, string | string[]>>
): { settings: AspectSettings; invalid: AspectQueryKey[] } => {
  const invalid: AspectQueryKey[] = []
  const read = <T>(key: AspectQueryKey, parse: (value: string) => T | undefined, initial: T): T => {
    // 同じパラメータが複数あるときは、最初の値を使う
    const value = [query[key]].flat()[0]
    if (value === undefined || value === '') {
      return initial
    }
    const parsed = parse(value)
    if (parsed === undefined) {
      invalid.push(key)
      return initial
    }
    return parsed
  }
  const readGroup = (group: AspectGroup): GroupSettings => ({
    aspects: read(`${group}Aspects`, toAspectSet, DEFAULT_ASPECT_SETTINGS[group].aspects),
    orb: read(`${group}Orb`, toOrb, DEFAULT_ASPECT_SETTINGS[group].orb),
  })

  const settings: AspectSettings = {
    orb: read('orb', toOrb, DEFAULT_ASPECT_SETTINGS.orb),
    sunMoonPlus: read('sunMoonPlus', toOrb, DEFAULT_ASPECT_SETTINGS.sunMoonPlus),
    minor: read('minor', toMinor, DEFAULT_ASPECT_SETTINGS.minor),
    minorOrb: read('minorOrb', toOrb, DEFAULT_ASPECT_SETTINGS.minorOrb),
    ascMc: readGroup('ascMc'),
    asteroid: readGroup('asteroid'),
    point: readGroup('point'),
  }
  return { settings, invalid }
}

// クエリにする。最初の状態と同じ項目は、省く
export const toAspectQuery = (settings: AspectSettings): AspectQuery => {
  const initial = DEFAULT_ASPECT_SETTINGS
  const query: AspectQuery = {}
  if (settings.orb !== initial.orb) query.orb = String(settings.orb)
  if (settings.sunMoonPlus !== initial.sunMoonPlus) query.sunMoonPlus = String(settings.sunMoonPlus)
  if (settings.minor.join() !== initial.minor.join()) query.minor = settings.minor.join()
  if (settings.minorOrb !== initial.minorOrb) query.minorOrb = String(settings.minorOrb)
  ASPECT_GROUPS.forEach((group) => {
    if (settings[group].aspects !== initial[group].aspects) query[`${group}Aspects`] = settings[group].aspects
    if (settings[group].orb !== initial[group].orb) query[`${group}Orb`] = String(settings[group].orb)
  })
  return query
}
