import { DateTime } from 'luxon'
import { 日柱 } from '../../src/suimei/kanshi'

describe('日柱を計算', () => {
  it('2022-02-24（基準日より後）', () => {
    const date = DateTime.fromISO('2022-02-24')
    expect(日柱(date)).toEqual('戊申')
  })

  it('1909-01-03（基準日より前）', () => {
    const date = DateTime.fromISO('1909-01-03')
    expect(日柱(date)).toEqual('癸亥')
  })
})
