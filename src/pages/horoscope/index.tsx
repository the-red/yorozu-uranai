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

  type Position = typeof planets

  const makeElementSingleSentence = (planets: Position, type: string) => {
    return planets
      .filter((planet) => planet.element === type)
      .map((planet) => planet.name)
      .join(' ')
  }
  const makeQualitySingleSentence = (planets: Position, type: string) => {
    return planets
      .filter((planet) => planet.quality === type)
      .map((planet) => planet.name)
      .join(' ')
  }
  const makePolaritySingleSentence = (planets: Position, type: string) => {
    return planets
      .filter((planet) => planet.polarity === type)
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
              <td>{makeElementSingleSentence(planets, 'fire')}</td>
            </tr>
            <tr>
              <td>土：</td>
              <td>{makeElementSingleSentence(planets, 'earth')}</td>
            </tr>
            <tr>
              <td>風：</td>
              <td>{makeElementSingleSentence(planets, 'air')}</td>
            </tr>
            <tr>
              <td>水：</td>
              <td>{makeElementSingleSentence(planets, 'water')}</td>
            </tr>
            <tr>
              <th colSpan={2}>３区分</th>
            </tr>
            <tr>
              <td>活動宮：</td>
              <td>{makeQualitySingleSentence(planets, 'cardinal')}</td>
            </tr>
            <tr>
              <td>不動宮：</td>
              <td>{makeQualitySingleSentence(planets, 'fixed')}</td>
            </tr>
            <tr>
              <td>柔軟宮：</td>
              <td>{makeQualitySingleSentence(planets, 'mutable')}</td>
            </tr>
            <tr>
              <th colSpan={2}>２区分</th>
            </tr>
            <tr>
              <td>男性宮：</td>
              <td>{makePolaritySingleSentence(planets, 'masculine')}</td>
            </tr>
            <tr>
              <td>女性宮：</td>
              <td>{makePolaritySingleSentence(planets, 'feminine')}</td>
            </tr>
          </tbody>
        </table>
      </div>
    </>
  )
}

export default Horoscope
