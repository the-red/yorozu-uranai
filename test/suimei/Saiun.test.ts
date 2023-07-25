import { DateTime } from 'luxon'
import { getKanshiInstance } from './test-util'
import { generateSaiun } from '../../src/suimei/models/Saiun'
import { getSekkiPair } from '../../src/suimei/models/SekkiUtil'

describe('Daiun', () => {
  it('1983-05-17T18:15.000+9:00の歳運', async () => {
    const dateTime = DateTime.fromISO('1983-05-17T18:15:00+09:00')
    const date = dateTime.toJSDate()
    const kanshi = await getKanshiInstance(date)
    const sekki = await getSekkiPair(date)
    const saiunDetail = generateSaiun(kanshi, dateTime, sekki)
    expect(saiunDetail[3]).toEqual({
      age: 38,
      year: 2021,
      tenkanTsuhensei: '偏官',
      yearKanshi: '辛丑',
      zoukan: '己',
      zoukanTsuhensei: '偏財',
      juuniun: '衰',
      thisYear: false,
      tenkan: '辛',
      tishi: '丑',
    })
    expect(saiunDetail[4]).toEqual({
      age: 39,
      year: 2022,
      tenkanTsuhensei: '印綬',
      yearKanshi: '壬寅',
      zoukan: '甲',
      zoukanTsuhensei: '劫財',
      juuniun: '帝旺',
      thisYear: false,
      tenkan: '壬',
      tishi: '寅',
    })
    expect(saiunDetail[5]).toEqual({
      age: 40,
      year: 2023,
      tenkanTsuhensei: '偏印',
      yearKanshi: '癸卯',
      zoukan: '乙',
      zoukanTsuhensei: '比肩',
      juuniun: '建禄',
      thisYear: true,
      tenkan: '癸',
      tishi: '卯',
    })
    expect(saiunDetail[6]).toEqual({
      age: 41,
      year: 2024,
      tenkanTsuhensei: '劫財',
      yearKanshi: '甲辰',
      zoukan: '戊',
      zoukanTsuhensei: '正財',
      juuniun: '冠帯',
      thisYear: false,
      tenkan: '甲',
      tishi: '辰',
    })
    expect(saiunDetail[7]).toEqual({
      age: 42,
      year: 2025,
      tenkanTsuhensei: '比肩',
      yearKanshi: '乙巳',
      zoukan: '丙',
      zoukanTsuhensei: '傷官',
      juuniun: '沐浴',
      thisYear: false,
      tenkan: '乙',
      tishi: '巳',
    })
  })
})
