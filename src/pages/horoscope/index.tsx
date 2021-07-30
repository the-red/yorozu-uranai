import useSWR from 'swr'
import type { Planet as PlanetClass } from '../../horoscope'
import type { Houses } from '../../horoscope'

type Planet = ReturnType<PlanetClass['toJSON']>
type Horoscope = {
  houses: Houses
  planets: {
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

function HoroscopePage() {
  const { data: horoscope, error } = useSWR('/api/horoscope', async (url) => {
    const res = await fetch(url, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        birthday: '1987-09-08T08:53:00+09:00',
        lat: 43.0666666666666666,
        lon: 141.35,
        // hsys: 'Placidus(default)',
      }),
    })
    if (!res.ok) {
      const { errorMessage } = await res.json()
      throw new Error(errorMessage)
    }
    const json = await res.json()
    const { houses, ...planets } = json.data
    console.log({ houses, planets })
    return { houses, planets } as Horoscope
  })

  if (error) return <div>failed to load: {JSON.stringify(error.message)}</div>
  if (!horoscope) return <div>loading...</div>

  const planets = Object.values<Planet>(horoscope.planets).map<Planet>((value) => ({
    name: value.name,
    degrees: value.degrees,
    element: value.element,
    formattedDegrees: value.formattedDegrees,
    longitude: value.longitude,
    polarity: value.polarity,
    quality: value.quality,
    sign: value.sign,
  }))

  const makeElementSingleSentence = (type: 'fire' | 'earth' | 'air' | 'water') =>
    makeSignSingleSentence(type, 'element')
  const makeQualitySingleSentence = (type: 'cardinal' | 'fixed' | 'mutable') => makeSignSingleSentence(type, 'quality')
  const makePolaritySingleSentence = (type: 'masculine' | 'feminine') => makeSignSingleSentence(type, 'polarity')

  const makeSignSingleSentence = (type: string, key: 'element' | 'quality' | 'polarity') => {
    return planets
      .filter((planet) => planet[key] === type)
      .map((planet) => planet.name)
      .join(' ')
  }

  return (
    <>
      <p>Horoscope</p>
      <div>
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
      </div>

      <div>
        <p>【ハウスのカスプ】</p>
        <table>
          <tbody>
            {horoscope.houses.house.map((longitude, i) => (
              <tr>
                <td>{i + 1}ハウス</td>
                <td>{longitude}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

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
              <td>{makeElementSingleSentence('fire')}</td>
            </tr>
            <tr>
              <td>土：</td>
              <td>{makeElementSingleSentence('earth')}</td>
            </tr>
            <tr>
              <td>風：</td>
              <td>{makeElementSingleSentence('air')}</td>
            </tr>
            <tr>
              <td>水：</td>
              <td>{makeElementSingleSentence('water')}</td>
            </tr>
            <tr>
              <th colSpan={2}>３区分</th>
            </tr>
            <tr>
              <td>活動宮：</td>
              <td>{makeQualitySingleSentence('cardinal')}</td>
            </tr>
            <tr>
              <td>不動宮：</td>
              <td>{makeQualitySingleSentence('fixed')}</td>
            </tr>
            <tr>
              <td>柔軟宮：</td>
              <td>{makeQualitySingleSentence('mutable')}</td>
            </tr>
            <tr>
              <th colSpan={2}>２区分</th>
            </tr>
            <tr>
              <td>男性宮：</td>
              <td>{makePolaritySingleSentence('masculine')}</td>
            </tr>
            <tr>
              <td>女性宮：</td>
              <td>{makePolaritySingleSentence('feminine')}</td>
            </tr>
          </tbody>
        </table>
      </div>
    </>
  )
}

export default HoroscopePage
