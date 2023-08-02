import { getSekkiPair, getSetsuIri } from './SekkiUtil'
import { Kanshi, SekkiPair } from './Kanshi'
import { DateTime } from 'luxon'
import { 十干, 干支, 十二支 } from './Kanshi'
import { calcZoukan } from './Zoukan'
import { 通変星, calcTsuhensei } from './Tsuhensei'
import { Juniun, juuniun } from './Juuniun'

export type Saiun = {
  age: number
  year: number
  yearKanshi: 干支
  tenkan: 十干
  tishi: 十二支
  tenkanTsuhensei: 通変星
  zoukan: 十干
  zoukanTsuhensei: 通変星
  thisYear: boolean
  juuniun: Juniun
}

export const generateSaiun = (kanshi: Kanshi, datetime: DateTime, sekki: SekkiPair, thisYear: number) => {
  const nikkan = kanshi.日干
  const birthYear = datetime.year
  // 算出したい年を作成
  // 当年から前後5年ずつ、算出するので最初の年は当年-5年
  const saiun1stYear = thisYear - 5

  const saiun: Saiun[] = []

  for (let i = 0; i < 16; i++) {
    // 誕生日ではないので12/31の年干支を取ることにする
    const saiunTargetYear = saiun1stYear + i
    const age = saiunTargetYear - birthYear

    // 昨年以前のマイナス年齢は表示しない
    if (age < 0 && saiunTargetYear < thisYear) {
      continue
    }

    const saiunTargetDate = DateTime.fromISO(`${saiunTargetYear}-12-31`)
    const yearKanshi = new Kanshi(saiunTargetDate, sekki)
    const tenkan = yearKanshi.年干
    const tishi = yearKanshi.年支
    const zoukanHonki = calcZoukan(tishi).honki

    const saiunDetail: Saiun = {
      age,
      year: saiunTargetYear,
      yearKanshi: yearKanshi.年柱,
      tenkan,
      tishi,
      tenkanTsuhensei: calcTsuhensei(nikkan, tenkan),
      zoukan: zoukanHonki,
      zoukanTsuhensei: calcTsuhensei(nikkan, zoukanHonki),
      thisYear: saiunTargetYear === thisYear,
      juuniun: juuniun(nikkan, tishi),
    }
    saiun.push(saiunDetail)
  }
  return saiun
}
