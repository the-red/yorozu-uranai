import useSWR from 'swr'

type Planet = {
  longitude: number
  INTERVAL: number
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

  console.log(data)
  const planets = Object.entries(data).map(([key, value]) => ({ name: key, longitude: value.longitude }))

  return (
    <>
      <p>Horoscope</p>
      <table>
        <thead>
          <tr>
            <th>惑星</th>
            <th>角度</th>
          </tr>
        </thead>
        <tbody>
          {planets.map((planet) => (
            <tr>
              <td>{planet.name}</td>
              <td>{planet.longitude}</td>
            </tr>
          ))}
        </tbody>
      </table>
      <p>Sign</p>
      <table>
        <thead>
          <tr>
            <td>区分</td>
            <td>惑星</td>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td>火：</td>
            <td>木星　天王星　海王星</td>
          </tr>
          <tr>
            <td>土：</td>
            <td>太陽　水星</td>
          </tr>
          <tr>
            <td>風：</td>
            <td>火星　土星　冥王星</td>
          </tr>
          <tr>
            <td>水：</td>
            <td>月　金星</td>
          </tr>
        </tbody>
      </table>
      <table>
        <tbody>
          <tr>
            <td>活動宮：</td>
            <td>月　金星　土星　冥王星</td>
          </tr>
          <tr>
            <td>不動宮：</td>
            <td>太陽　水星</td>
          </tr>
          <tr>
            <td>柔軟宮：</td>
            <td>火星　木星　天王星　海王星</td>
          </tr>
        </tbody>
      </table>
      <table>
        <tbody>
          <tr>
            <td>男性宮：</td>
            <td>火星　木星　土星　天王星　海王星　冥王星</td>
          </tr>
          <tr>
            <td>女性宮：</td>
            <td>太陽　月　水星　金星</td>
          </tr>
        </tbody>
      </table>
    </>
  )
}

export default Horoscope
