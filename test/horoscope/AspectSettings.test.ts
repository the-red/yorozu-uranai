import { describe, it, expect } from 'vitest'
import {
  AspectSettings,
  DEFAULT_ASPECT_SETTINGS,
  Horoscope,
  HoroscopeProps,
  PlanetName,
  getAngleAspects,
  getAsteroidAspects,
  getPlanetAspect,
  getPlanetAspects,
  getPointAspects,
  parseAspectQuery,
  toAspectQuery,
} from '../../src/horoscope/models'

const position = (longitude: number, isRetrograde = false) =>
  ({ longitude, isRetrograde }) as HoroscopeProps['positions'][number][1]

// 1987-09-08 08:53 札幌生まれ
const props: HoroscopeProps = {
  positions: [
    ['sun', position(164.817337)],
    ['moon', position(348.062352)],
    ['mercury', position(180.67738)],
    ['venus', position(169.112858)],
    ['mars', position(160.29299)],
    ['jupiter', position(29.125698, true)],
    ['saturn', position(254.845661)],
    ['uranus', position(262.735112)],
    ['neptune', position(275.253885, true)],
    ['pluto', position(217.890372)],
  ],
  houses: {
    house: [
      207.908591, 235.781911, 268.307258, 303.803709, 337.205891, 5.251311, 27.908591, 55.781911, 88.307258, 123.803709,
      157.205891, 185.251311,
    ],
    ascendant: 207.908591,
    mc: 123.803709,
    armc: 126.121101,
    vertex: 61.847894,
    equatorialAscendant: 218.500087,
    kochCoAscendant: 237.939031,
    munkaseyCoAscendant: 206.8052,
    munkaseyPolarAscendant: 57.939031,
  },
  node: position(2.374847, true),
  lilith: position(122.301895),
  asteroids: [
    ['chiron', position(88.267609)],
    ['ceres', position(264.007801)],
    ['pallas', position(234.541626)],
    ['juno', position(326.419658, true)],
    ['vesta', position(108.71123)],
  ],
}
const horoscope = new Horoscope(props)
const SETTINGS = DEFAULT_ASPECT_SETTINGS

// 2つの惑星の位置だけを変える
const withPlanets = (positions: Partial<Record<PlanetName, number>>) =>
  new Horoscope({
    ...props,
    positions: props.positions.map(([name, current]) => [
      name,
      positions[name] === undefined ? current : position(positions[name]),
    ]),
  })

describe('最初の状態', () => {
  it('惑星どうしは、メジャーアスペクトだけを、オーブ 6度で求める', () => {
    expect(SETTINGS).toMatchObject({ orb: 6, sunMoonPlus: 0, minor: [], minorOrb: 2 })
  })
  it('Asc・Mc は、メジャーアスペクト。小惑星と感受点は、コンジャンクションだけ', () => {
    expect(SETTINGS.ascMc).toEqual({ aspects: 'major', orb: 6 })
    expect(SETTINGS.asteroid).toEqual({ aspects: 'conjunction', orb: 3 })
    expect(SETTINGS.point).toEqual({ aspects: 'conjunction', orb: 3 })
  })
})

describe('惑星どうしのアスペクト', () => {
  const names = (settings: AspectSettings, target = horoscope) =>
    getPlanetAspects(target, settings).map(({ planets, aspect }) => `${planets.join('-')} ${aspect.degrees}`)

  it('惑星の組み合わせごとに1つ。前の惑星から順に並ぶ', () => {
    expect(names(SETTINGS)).toEqual([
      'sun-moon 180',
      'sun-venus 0',
      'sun-mars 0',
      'sun-saturn 90',
      'moon-venus 180',
      'moon-saturn 90',
      'moon-uranus 90',
      'mercury-neptune 90',
      'venus-saturn 90',
      'venus-uranus 90',
      'mars-saturn 90',
      'mars-neptune 120',
      'mars-pluto 60',
      'neptune-pluto 60',
    ])
  })

  it('オーブを狭めると、減る', () => {
    expect(names({ ...SETTINGS, orb: 1 })).toEqual(['sun-saturn 90'])
    expect(names({ ...SETTINGS, orb: 0 })).toEqual([])
  })

  describe('太陽と月のオーブ', () => {
    // 太陽（164.82度）と冥王星（217.89度）の差は、53.07度。セクスタイルから 6.93度
    // 水星（180.68度）と土星（254.85度）の差は、74.17度。スクエアから 15.83度
    const sunPluto = (settings: AspectSettings) => getPlanetAspect(horoscope, 'sun', 'pluto', settings)?.name

    it('太陽か月を含む組み合わせだけ、広げる', () => {
      expect(sunPluto(SETTINGS)).toBeUndefined()
      expect(sunPluto({ ...SETTINGS, sunMoonPlus: 1 })).toEqual('sextile')
      expect(sunPluto({ ...SETTINGS, sunMoonPlus: 0.9 })).toBeUndefined()
      expect(getPlanetAspect(horoscope, 'pluto', 'sun', { ...SETTINGS, sunMoonPlus: 1 })?.name).toEqual('sextile')
    })
    it('ほかの惑星どうしは、広げない', () => {
      // 金星（169.11度）と冥王星（217.89度）の差は、48.78度。セクスタイルから 11.22度
      const venusPluto = withPlanets({ venus: 217.890372 - 53 })
      expect(getPlanetAspect(venusPluto, 'venus', 'pluto', { ...SETTINGS, sunMoonPlus: 5 })).toBeUndefined()
      expect(getPlanetAspect(venusPluto, 'venus', 'pluto', { ...SETTINGS, orb: 7 })?.name).toEqual('sextile')
    })
    it('マイナーアスペクトは、広げない', () => {
      // 差は 33度。セミセクスタイルから 3度
      const target = withPlanets({ sun: 100, mercury: 133 })
      const settings: AspectSettings = { ...SETTINGS, minor: [30], sunMoonPlus: 5 }
      expect(getPlanetAspect(target, 'sun', 'mercury', settings)).toBeUndefined()
      expect(getPlanetAspect(target, 'sun', 'mercury', { ...settings, minorOrb: 3 })?.name).toEqual('semi-sextile')
    })
  })

  describe('マイナーアスペクト', () => {
    it('選んだものだけを求める', () => {
      // 水星（180.68度）と木星（29.13度）の差は、151.55度。クインカンクスから 1.55度
      expect(getPlanetAspect(horoscope, 'mercury', 'jupiter', SETTINGS)).toBeUndefined()
      expect(getPlanetAspect(horoscope, 'mercury', 'jupiter', { ...SETTINGS, minor: [30, 45] })).toBeUndefined()
      expect(getPlanetAspect(horoscope, 'mercury', 'jupiter', { ...SETTINGS, minor: [150] })).toEqual({
        degrees: 150,
        name: 'quincunx',
        type: 'minor',
      })
    })
    it('マイナーアスペクトのオーブで求める', () => {
      const settings: AspectSettings = { ...SETTINGS, minor: [150], minorOrb: 1.5 }
      expect(getPlanetAspect(horoscope, 'mercury', 'jupiter', settings)).toBeUndefined()
      expect(getPlanetAspect(horoscope, 'mercury', 'jupiter', { ...settings, minorOrb: 1.6 })?.degrees).toEqual(150)
    })
    it('メジャーアスペクトは、そのまま', () => {
      const all: AspectSettings = { ...SETTINGS, minor: [30, 45, 72, 135, 144, 150] }
      expect(names(all).filter((_) => !/ (30|45|72|135|144|150)$/.test(_))).toEqual(names(SETTINGS))
    })
    it('メジャーとマイナーの両方に収まるときは、ずれの小さいほうにする', () => {
      // 差は 47度。セクスタイルから 13度、セミスクエアから 2度
      const target = withPlanets({ mars: 100, jupiter: 147 })
      const settings: AspectSettings = { ...SETTINGS, orb: 15, minor: [45] }
      expect(getPlanetAspect(target, 'mars', 'jupiter', settings)?.name).toEqual('semi-square')
      // 差は 58度。セクスタイルから 2度、セミスクエアから 13度
      const wide: AspectSettings = { ...SETTINGS, minor: [45], minorOrb: 15 }
      expect(getPlanetAspect(withPlanets({ mars: 100, jupiter: 158 }), 'mars', 'jupiter', wide)?.name).toEqual(
        'sextile'
      )
    })
  })
})

describe('Asc・Mc と、惑星のアスペクト', () => {
  const names = (settings: AspectSettings['ascMc']) =>
    getAngleAspects(horoscope, settings).map(({ angle, planet, aspect }) => `${angle}-${planet} ${aspect.degrees}`)

  it('メジャーアスペクト', () => {
    // Asc は 207.91度、Mc は 123.80度
    // - Asc と木星（29.13度）: 差は 178.78度
    // - Asc と天王星（262.74度）: 差は 54.83度
    // - Mc と水星（180.68度）: 差は 56.87度
    // - Mc と木星: 差は 94.68度
    // - Mc と冥王星（217.89度）: 差は 94.09度
    expect(names({ aspects: 'major', orb: 6 })).toEqual([
      'ascendant-jupiter 180',
      'ascendant-uranus 60',
      'mc-mercury 60',
      'mc-jupiter 90',
      'mc-pluto 90',
    ])
  })
  it('オーブ', () => {
    expect(names({ aspects: 'major', orb: 4 })).toEqual(['ascendant-jupiter 180', 'mc-mercury 60'])
    expect(names({ aspects: 'major', orb: 1.22 })).toEqual(['ascendant-jupiter 180'])
    expect(names({ aspects: 'major', orb: 1.21 })).toEqual([])
  })
  it('コンジャンクションだけ', () => {
    expect(names({ aspects: 'conjunction', orb: 6 })).toEqual([])
    // Asc と冥王星の差は、9.98度
    expect(names({ aspects: 'conjunction', orb: 10 })).toEqual(['ascendant-pluto 0'])
  })
})

describe('小惑星と、惑星のアスペクト', () => {
  const names = (settings: AspectSettings['asteroid'], target = horoscope) =>
    getAsteroidAspects(target, settings).map(
      ({ asteroid, planet, aspect }) => `${asteroid}-${planet} ${aspect.degrees}`
    )

  it('コンジャンクションだけ', () => {
    expect(names(SETTINGS.asteroid)).toEqual(['ceres-uranus 0'])
  })
  it('メジャーアスペクト', () => {
    // 小惑星の並び順（セレス、パラス、ジュノ、ベスタ、キロン）に求める
    // - セレス（264.01度）と天王星（262.74度）: 差は 1.27度
    // - ジュノ（326.42度）と木星（29.13度）: 差は 62.71度
    // - ベスタ（108.71度）と月（348.06度）: 差は 120.65度
    // - ベスタと金星（169.11度）: 差は 60.40度
    // - キロン（88.27度）と水星（180.68度）: 差は 92.41度
    // - キロンと木星: 差は 59.14度
    expect(names({ aspects: 'major', orb: 3 })).toEqual([
      'ceres-uranus 0',
      'juno-jupiter 60',
      'vesta-moon 120',
      'vesta-venus 60',
      'chiron-mercury 90',
      'chiron-jupiter 60',
    ])
  })
  it('計算できない日付では、空', () => {
    expect(names({ aspects: 'major', orb: 3 }, new Horoscope({ ...props, asteroids: null }))).toEqual([])
  })
})

describe('感受点と、惑星のアスペクト', () => {
  const names = (settings: AspectSettings['point']) =>
    getPointAspects(horoscope, settings).map(({ point, planet, aspect }) => `${point}-${planet} ${aspect.degrees}`)

  it('コンジャンクションだけ', () => {
    expect(names(SETTINGS.point)).toEqual(['southNode-mercury 0', 'partOfFortune-jupiter 0'])
  })
  it('メジャーアスペクトにすると、ヘッドとテイルで、同じ組み合わせが2回ずつ出る', () => {
    const nodes = names({ aspects: 'major', orb: 3 }).filter((_) => /Node/.test(_))
    // テイル（182.37度）と水星（180.68度）のコンジャンクションは、ヘッドとのオポジション。
    // 海王星（275.25度）は、ヘッドとも、テイルとも、スクエア
    expect(nodes).toEqual([
      'northNode-mercury 180',
      'northNode-neptune 90',
      'southNode-mercury 0',
      'southNode-neptune 90',
    ])
  })
})

describe('URLのクエリ', () => {
  const custom: AspectSettings = {
    orb: 8,
    sunMoonPlus: 2,
    minor: [30, 150],
    minorOrb: 1.5,
    ascMc: { aspects: 'conjunction', orb: 4 },
    asteroid: { aspects: 'major', orb: 2 },
    point: { aspects: 'major', orb: 1 },
  }

  it('最初の状態は、空のクエリ', () => {
    expect(toAspectQuery(SETTINGS)).toEqual({})
    expect(parseAspectQuery({})).toEqual({ settings: SETTINGS, invalid: [] })
  })
  it('最初の状態と違う項目だけを、クエリに入れる', () => {
    expect(toAspectQuery({ ...SETTINGS, orb: 8 })).toEqual({ orb: '8' })
    expect(toAspectQuery({ ...SETTINGS, point: { aspects: 'major', orb: 3 } })).toEqual({ pointAspects: 'major' })
  })
  it('すべての項目', () => {
    expect(toAspectQuery(custom)).toEqual({
      orb: '8',
      sunMoonPlus: '2',
      minor: '30,150',
      minorOrb: '1.5',
      ascMcAspects: 'conjunction',
      ascMcOrb: '4',
      asteroidAspects: 'major',
      asteroidOrb: '2',
      pointAspects: 'major',
      pointOrb: '1',
    })
  })
  it('クエリにして、読み取ると、元に戻る', () => {
    expect(parseAspectQuery(toAspectQuery(custom))).toEqual({ settings: custom, invalid: [] })
  })
  it('マイナーアスペクトは、角度の小さい順にそろえて、重複を除く', () => {
    expect(parseAspectQuery({ minor: '150,30,150' }).settings.minor).toEqual([30, 150])
  })
  it('空の値と、関係のないパラメータは、無視する', () => {
    expect(parseAspectQuery({ orb: '', minor: '', date: '19870908', foo: 'bar' })).toEqual({
      settings: SETTINGS,
      invalid: [],
    })
  })
  it('同じパラメータが複数あるときは、最初の値を使う', () => {
    expect(parseAspectQuery({ orb: ['4', '8'] }).settings.orb).toEqual(4)
  })

  describe('読み取れない値', () => {
    it.each([
      ['orb', 'abc'],
      ['orb', '-1'],
      ['orb', '15.1'],
      ['orb', '1e1'],
      ['orb', ' 6'],
      ['orb', '6.'],
      ['sunMoonPlus', '16'],
      ['minorOrb', 'NaN'],
      ['minor', '60'],
      ['minor', '30,abc'],
      ['minor', '30,'],
      ['minor', 'all'],
      ['ascMcAspects', 'minor'],
      ['asteroidAspects', 'Major'],
      ['pointAspects', 'none'],
      ['pointOrb', 'Infinity'],
    ])('%s=%s は、最初の状態のままにして、invalid に入れる', (key, value) => {
      expect(parseAspectQuery({ [key]: value })).toEqual({ settings: SETTINGS, invalid: [key] })
    })
    it('読み取れた項目は、反映する', () => {
      expect(parseAspectQuery({ orb: '8', minorOrb: 'x' })).toEqual({
        settings: { ...SETTINGS, orb: 8 },
        invalid: ['minorOrb'],
      })
    })
  })

  describe('オーブの範囲', () => {
    it.each(['0', '0.5', '15', '15.0', '007'])('%s は、読み取れる', (value) => {
      expect(parseAspectQuery({ orb: value })).toEqual({ settings: { ...SETTINGS, orb: Number(value) }, invalid: [] })
    })
  })
})
