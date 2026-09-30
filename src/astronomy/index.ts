import path from 'path'
import { calc_ut, constants, house_name, houses, julday as toJulday, set_ephe_path, time_equ } from 'sweph'
import type { AsteroidName, Body, EclipticPosition, Houses } from './types'

// 天体暦のファイルの場所。小惑星とキロンの計算に使う
// NOTE: ファイルは、リポジトリの ephe に置いている（ライブラリには、同梱されていない）。
// Vercelなど、必要なファイルだけを切り出して動かす環境には、next.config.js の outputFileTracingIncludes で含めている。
// ここでは、ビルドのときに、パスを調べられないようにする（turbopackIgnore）。
// 調べられると、天体暦のファイルを使わないAPIにも、ファイルが入る
set_ephe_path(path.join(/* turbopackIgnore: true */ process.cwd(), 'ephe'))

// 計算に失敗したかどうか
// NOTE: error の有無では、判定しない。成功しても、知らせの文が入ることがある
// （天体暦のファイルが無いので、計算式で求めた、など）
const isFailed = ({ flag }: { flag: number }) => flag < 0

const round6 = (num: number) => Math.trunc(num * 10 ** 6) / 10 ** 6

// ユリウス日の計算
export const julday = (date: Date): Promise<number> => {
  // NOTE: 実行環境のタイムゾーンに依らないように、UTCの値から求める。
  // ローカルの値と getTimezoneOffset() から求めると、オフセットに秒の端数がある古い日付でずれる
  const year = date.getUTCFullYear()
  const month = date.getUTCMonth() + 1
  const day = date.getUTCDate()

  const hour = date.getUTCHours()
  const minute = date.getUTCMinutes()
  const second = date.getUTCSeconds() + date.getUTCMilliseconds() / 1000
  const utcHourMinuteSecond = hour + (minute + second / 60) / 60

  return Promise.resolve(toJulday(year, month, day, utcHourMinuteSecond, constants.SE_GREG_CAL))
}

// Swiss Ephemeris での番号
const BODIES: Record<Body, number> = {
  sun: constants.SE_SUN,
  moon: constants.SE_MOON,
  mercury: constants.SE_MERCURY,
  venus: constants.SE_VENUS,
  mars: constants.SE_MARS,
  jupiter: constants.SE_JUPITER,
  saturn: constants.SE_SATURN,
  uranus: constants.SE_URANUS,
  neptune: constants.SE_NEPTUNE,
  pluto: constants.SE_PLUTO,
  // NOTE: 平均の位置にするなら、SE_MEAN_NODE
  trueNode: constants.SE_TRUE_NODE,
  // NOTE: 真位置にするなら、SE_OSCU_APOG
  meanApogee: constants.SE_MEAN_APOG,
  chiron: constants.SE_CHIRON,
  ceres: constants.SE_CERES,
  pallas: constants.SE_PALLAS,
  juno: constants.SE_JUNO,
  vesta: constants.SE_VESTA,
}

const ASTEROIDS: readonly Body[] = ['chiron', 'ceres', 'pallas', 'juno', 'vesta'] satisfies AsteroidName[]

// 計算方法
// - 小惑星とキロンは、天体暦のファイル（Swiss Ephemeris）で計算する。ほかの方法では、計算できない
// - それ以外は、計算式（Moshier）で計算する
// NOTE: 天体暦のファイルの場所を指定すると、指定が無ければ、惑星もファイルで計算するようになり、
// 値がわずかに変わる（月で 0.8秒、ヘッドで 7.6秒）。今までの値を保つために、計算式を指定する
const toFlag = (body: Body) =>
  constants.SEFLG_SPEED | (ASTEROIDS.includes(body) ? constants.SEFLG_SWIEPH : constants.SEFLG_MOSEPH)

// 小惑星とキロンを、計算できる日付かどうか
// NOTE: 天体暦のファイル（seas_18.se1）は、1800年から 2399年まで。
// 光が届くまでの時間をさかのぼって計算するので、最初の日は計算できない
const ASTEROID_RANGE = [2378497.5, 2597641.5] // 1800-01-02 から、2400-01-01 の手前まで（世界時）
export const isAsteroidRange = (julday_ut: number): boolean =>
  ASTEROID_RANGE[0] <= julday_ut && julday_ut < ASTEROID_RANGE[1]

// 黄道座標の計算
export const eclipticPosition = async (julday_ut: number, body: Body): Promise<EclipticPosition> => {
  const result = calc_ut(julday_ut, BODIES[body], toFlag(body))
  if (isFailed(result)) {
    throw new Error(result.error)
  }

  // 処理系が変わると少し誤差が出るので丸めておく
  const [longitude, latitude, distance, longitudeSpeed, latitudeSpeed, distanceSpeed] = result.data.map(round6)

  return {
    longitude,
    latitude,
    distance,
    longitudeSpeed,
    latitudeSpeed,
    distanceSpeed,
    rflag: result.flag,
    isRetrograde: longitudeSpeed < 0,
  }
}

// 日付から黄経だけを算出
export const getEclipticLongitude = async (date: Date) => {
  const julday_ut = await julday(date)
  const { longitude } = await eclipticPosition(julday_ut, 'sun')
  return longitude
}

// 均時差（視太陽時 − 平均太陽時）を分単位で算出
export const equationOfTime = async (julday_ut: number): Promise<number> => {
  const result = time_equ(julday_ut)
  if (isFailed(result)) {
    throw new Error(result.error)
  }

  // 日単位で返ってくるので分に直す
  return result.data * 24 * 60
}

// カスプが、Asc や Mc と、計算の誤差だけ違うときは、Asc や Mc の値にそろえる
// NOTE: ハウスシステムによっては、1ハウスのカスプと Asc（10ハウスのカスプと Mc）が、別々に計算されて、
// 最後の桁だけ違う（Krusinski、APC、Meridian）。そろえないと、小数第6位に切り捨てたときに、まれに値が分かれて、
// Asc が 12ハウスに、Mc が 9ハウスに入ってしまう
const CUSP_TOLERANCE = 1e-9
export const snapCusps = (cusps: number[], points: number[]): number[] =>
  cusps.map((cusp) => points.find((point) => Math.abs(point - cusp) < CUSP_TOLERANCE) ?? cusp)

// ハウスを計算できなかったときのメッセージ
// NOTE: プラシーダスとコッホは、極圏では計算できない。APIは、このメッセージで、緯度の問題かどうかを見分ける
const HOUSES_ERROR = `Can't calculate houses.`

// ハウスの計算
export const calcHouses = async (
  julday_ut: number,
  geolat: number,
  geolon: number,
  hsys: string = ''
): Promise<Houses> => {
  const result = houses(julday_ut, geolat, geolon, hsys)
  // NOTE: 計算できなかったときも、別のハウスシステム（ポーフィリー）の値が入っている。使わずに、エラーにする
  if (isFailed(result)) {
    throw new Error(HOUSES_ERROR)
  }

  // 処理系が変わると少し誤差が出るので丸めておく
  const [
    ascendant,
    mc,
    armc,
    vertex,
    equatorialAscendant,
    kochCoAscendant,
    munkaseyCoAscendant,
    munkaseyPolarAscendant,
  ] = result.data.points.map(round6)

  return {
    house: snapCusps(result.data.houses, result.data.points.slice(0, 2)).map(round6),
    ascendant,
    mc,
    armc,
    vertex,
    equatorialAscendant,
    kochCoAscendant,
    munkaseyCoAscendant,
    munkaseyPolarAscendant,
  }
}

// ハウスシステム名を略称から引く。知らない値は、プラシーダス
export const houseSystemName = (hsys: string = '') => house_name(hsys)

// 黄経から日付を算出
export const longitudeToDate = async (
  targetLongitude: number,
  nearbyDate: Date, // この日付に一番近い日付を探す
  forward: boolean = true, // 順行ならtrue、逆行ならfalse
  count: number = 0
): Promise<Date> => {
  const secondsOfYear = 365.2422 / 24 / 60 / 60
  const longitudesOfSeconds = secondsOfYear / 360 // 1秒で黄経が進む度数

  const currentLongitude = await getEclipticLongitude(nearbyDate)
  const sign = forward ? 1 : -1

  let longitudeDiff = targetLongitude - currentLongitude
  if (count === 0 && sign * longitudeDiff < 0) {
    longitudeDiff += sign * 360
  }
  const diffSeconds = longitudeDiff / longitudesOfSeconds
  const diffSecondsInt = Math.trunc(diffSeconds)

  if (diffSecondsInt === 0) {
    return nearbyDate
  }

  if (count > 10) {
    // 無限再帰の防止
    return nearbyDate
  }

  const newDate = new Date(nearbyDate.getTime() + diffSecondsInt * 1000)
  return longitudeToDate(targetLongitude, newDate, forward, count + 1)
}
