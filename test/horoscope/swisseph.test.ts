import { julday, houses, houseName } from '../../src/horoscope/swisseph'

describe('swisseph', () => {
  it('Houses', async () => {
    const funadyBirthday = await julday(new Date('1987-09-08T08:53:00+09:00'))
    expect(await houses(funadyBirthday)).toEqual({
      armc: 344.77110120936857,
      ascendant: 75.97652436522719,
      equatorialAscendant: 75.97652436522719,
      house: [
        75.97652436522719,
        105.4932191207119,
        134.26397918272784,
        163.4727945776035,
        193.92081041421886,
        225.1964179401407,
        255.9765243652272,
        285.4932191207119,
        314.26397918272784,
        343.4727945776035,
        13.920810414218863,
        45.19641794014069,
      ],
      kochCoAscendant: 75.97652436522719,
      mc: 343.47279457760345,
      munkaseyCoAscendant: 180,
      munkaseyPolarAscendant: 255.9765243652272,
      vertex: 180,
    })
  })

  it('House name', async () => {
    expect(houseName('A')).toEqual('equal')
    expect(houseName()).toEqual('Placidus')
  })
})
