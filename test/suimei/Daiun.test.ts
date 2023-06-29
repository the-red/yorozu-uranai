import { DateTime } from 'luxon'
import { getDaiun } from './test-util'

describe('Daiun', () => {
  it('1983-05-17T18:15.000+9:00の大運', async () => {
    const dateTime = DateTime.fromISO('1983-05-17T18:15:00+09:00')
    const date = dateTime.toJSDate()
    const daiunDetail = await getDaiun(date, dateTime, 'woman')
    expect(daiunDetail[0]).toEqual(6)
  })
})
