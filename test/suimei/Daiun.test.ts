import { DateTime } from 'luxon'
import { getDaiun } from './test-util'

describe('Daiun', () => {
  it('1983-05-17T18:15.000+9:00の大運', async () => {
    const dateTime = DateTime.fromISO('1983-05-17T18:15:00+09:00')
    const date = dateTime.toJSDate()
    const daiunDetail = await getDaiun(date, dateTime, 'woman')
    expect(daiunDetail).toEqual([
      {
        fromAge: 0,
        toAge: 6,
        kanshi: '丁巳',
        tenkan: '丁',
        tishi: '巳',
        tenkanTsuhensei: '食神',
        zoukan: '丙',
        zoukanTsuhensei: '傷官',
        juuniun: '沐浴',
      },
      {
        fromAge: 7,
        toAge: 16,
        kanshi: '戊午',
        tenkan: '戊',
        tishi: '午',
        tenkanTsuhensei: '正財',
        zoukan: '丁',
        zoukanTsuhensei: '食神',
        juuniun: '長生',
      },
      {
        fromAge: 17,
        toAge: 26,
        kanshi: '己未',
        tenkan: '己',
        tishi: '未',
        tenkanTsuhensei: '偏財',
        zoukan: '己',
        zoukanTsuhensei: '偏財',
        juuniun: '養',
      },
      {
        fromAge: 27,
        toAge: 36,
        kanshi: '庚申',
        tenkan: '庚',
        tishi: '申',
        tenkanTsuhensei: '正官',
        zoukan: '庚',
        zoukanTsuhensei: '正官',
        juuniun: '胎',
      },
      {
        fromAge: 37,
        toAge: 46,
        kanshi: '辛酉',
        tenkan: '辛',
        tishi: '酉',
        tenkanTsuhensei: '偏官',
        zoukan: '辛',
        zoukanTsuhensei: '偏官',
        juuniun: '絶',
      },
      {
        fromAge: 47,
        toAge: 56,
        kanshi: '壬戌',
        tenkan: '壬',
        tishi: '戌',
        tenkanTsuhensei: '印綬',
        zoukan: '戊',
        zoukanTsuhensei: '正財',
        juuniun: '墓',
      },
      {
        fromAge: 57,
        toAge: 66,
        kanshi: '癸亥',
        tenkan: '癸',
        tishi: '亥',
        tenkanTsuhensei: '偏印',
        zoukan: '壬',
        zoukanTsuhensei: '印綬',
        juuniun: '死',
      },
      {
        fromAge: 67,
        toAge: 76,
        kanshi: '甲子',
        tenkan: '甲',
        tishi: '子',
        tenkanTsuhensei: '劫財',
        zoukan: '癸',
        zoukanTsuhensei: '偏印',
        juuniun: '病',
      },
    ])
  })
})
