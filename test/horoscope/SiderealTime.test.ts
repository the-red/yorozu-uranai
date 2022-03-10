import { julday, calcHouses } from '../../src/horoscope/swisseph'

describe('SiderealTime', () => {
  const okinaMegumiBirthday = new Date('1979-08-06T14:55:00+09:00')
  const okinaMegumiBirthLat = 34.38333333333333 // 34°23′
  const okinaMegumiBirthLon = 132.45 // 132°27′

  it('ユリウス日', async () => {
    const julday_ut = await julday(okinaMegumiBirthday)
    expect(julday_ut).toEqual(2444091.746527778)
  })

  it('ハウス', async () => {
    const julday_ut = await julday(okinaMegumiBirthday)
    const houses = await calcHouses(julday_ut, okinaMegumiBirthLat, okinaMegumiBirthLon)
    expect(houses).toMatchObject({
      armc: 175.379772,
      ascendant: 250.851563,
      equatorialAscendant: 265.759577,
      house: [
        250.851563, 283.105661, 319.44199, 354.96627, 24.983843, 49.473013, 70.851563, 103.105661, 139.44199, 174.96627,
        204.983843, 229.473013,
      ],
      kochCoAscendant: 281.251442,
      mc: 174.96627,
      munkaseyCoAscendant: 236.681241,
      munkaseyPolarAscendant: 101.251442,
      vertex: 116.978663,
    })
  })

  it('地方恒星時（度）', async () => {
    const julday_ut = await julday(okinaMegumiBirthday)
    const { armc } = await calcHouses(julday_ut, okinaMegumiBirthLat, okinaMegumiBirthLon)
    expect(armc).toBe(175.379772)
  })

  it('地方恒星時（時間）', async () => {
    const julday_ut = await julday(okinaMegumiBirthday)
    const { armc } = await calcHouses(julday_ut, okinaMegumiBirthLat, okinaMegumiBirthLon)
    const siderealTime = armc / 15
    expect(siderealTime).toBe(11.6919848)
  })
})
