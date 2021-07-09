import useSWR from 'swr'

type PlanetName = 'sun' | 'moon' | 'mercury' | 'venus' | 'mars' | 'jupiter' | 'saturn' | 'uranus' | 'neptune' | 'pluto'
type Planet = {
  name: PlanetName
  longitude: number
  degrees: number
  formattedDegrees: string
  sign:
    | '牡羊座'
    | '牡牛座'
    | '双子座'
    | '蟹座'
    | '獅子座'
    | '乙女座'
    | '天秤座'
    | '蠍座'
    | '射手座'
    | '山羊座'
    | '水瓶座'
    | '魚座'
  element: string
  quality: string
  polarity: string
}
type Horoscope = {
  horoscope: {
    all: any
    sun: Planet
    moon: Planet
    mercury: Planet
    venus: Planet
    mars: Planet
    jupiter: Planet
    saturn: Planet
    uranus: Planet
    neptune: Planet
    pluto: Planet
  }
}

function Horoscope() {
  const { data, error } = useSWR('/api/horoscope', async (url) => {
    const res = await fetch(url, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ birthday: '1987-09-08T08:53:00+09:00' }),
    })
    if (!res.ok) {
      const { errorMessage } = await res.json()
      throw new Error(errorMessage)
    }
    const horoscope: Horoscope = await res.json()
    delete horoscope.horoscope.all
    return horoscope.horoscope
  })

  if (error) return <div>failed to load: {JSON.stringify(error.message)}</div>
  if (!data) return <div>loading...</div>

  const planets = Object.entries(data).map(([key, value]) => ({
    name: key,
    degrees: value.degrees,
    element: value.element,
    formattedDegrees: value.formattedDegrees,
    longitude: value.longitude,
    polarity: value.polarity,
    quality: value.quality,
    sign: value.sign,
  }))

  type A = typeof planets

  const hoge = (planets: A, type: string) => {
    return planets
      .filter((planet) => planet.element === type)
      .map((planet) => planet.name)
      .join(' ')
  }

  return (
    <>
      <p>Horoscope</p>
      <p>【天体の位置】</p>
      <table>
        <thead>
          <tr>
            <th>惑星</th>
            <th>星座</th>
            <th>角度</th>
            <th>ハウス</th>
          </tr>
        </thead>
        <tbody>
          {planets.map((planet) => (
            <tr>
              <td>{planet.name}</td>
              <td>{planet.sign}</td>
              <td>{planet.formattedDegrees}</td>
              <td>1ハウス</td>
            </tr>
          ))}
        </tbody>
      </table>
      <div>
        <p>【サイン区分】</p>
        <table>
          <thead>
            <tr>
              <th>区分</th>
              <th>惑星</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <th colSpan={2}>４区分</th>
            </tr>
            <tr>
              <td>火：</td>
              <td>
                {planets
                  .filter((planet) => planet.element === 'fire')
                  .map((planet) => planet.name)
                  .join(' ')}
              </td>
            </tr>
            <tr>
              <td>土：</td>
              <td>{planets.flatMap((planet) => (planet.element === 'earth' ? planet.name : [])).join(' ')}</td>
            </tr>
            <tr>
              <td>風：</td>
              <td>{planets.map((planet) => (planet.element === 'air' ? planet.name : '')).join('  ')}</td>
            </tr>
            <tr>
              <td>水：</td>
              <td>{planets.map((planet) => (planet.element === 'water' ? planet.name : '')).join('  ')}</td>
            </tr>
            <tr>
              <th colSpan={2}>３区分</th>
            </tr>
            <tr>
              <td>活動宮：</td>
              <td>{planets.map((planet) => (planet.quality === 'cardinal' ? planet.name : '')).join('  ')}</td>
            </tr>
            <tr>
              <td>不動宮：</td>
              <td>{planets.map((planet) => (planet.quality === 'fixed' ? planet.name : '')).join('  ')}</td>
            </tr>
            <tr>
              <td>柔軟宮：</td>
              <td>{planets.map((planet) => (planet.quality === 'mutable' ? planet.name : '')).join(' ')}</td>
            </tr>
            <tr>
              <th colSpan={2}>２区分</th>
            </tr>
            <tr>
              <td>男性宮：</td>
              <td>{planets.map((planet) => (planet.polarity === 'masculine' ? planet.name : '')).join('  ')}</td>
            </tr>
            <tr>
              <td>女性宮：</td>
              <td>{planets.map((planet) => (planet.polarity === 'feminine' ? planet.name : '')).join(' ')}</td>
            </tr>
          </tbody>
        </table>
      </div>
    </>
  )
}

export default Horoscope
