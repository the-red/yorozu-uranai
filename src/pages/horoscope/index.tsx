import useSWR from 'swr'

type Planet = {
  longitude: number
  INTERVAL: number
}
type Horoscope = {
  horoscope: {
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
    return horoscope
  })

  if (error) return <div>failed to load: {JSON.stringify(error.message)}</div>
  if (!data) return <div>loading...</div>

  const planets = [
    { name: '太陽', longitude: 15.12345 },
    { name: '月', longitude: 8.12345 },
  ]

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
      <pre>{JSON.stringify(data, null, 2)}</pre>
    </>
  )
}

export default Horoscope
