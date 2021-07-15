import useSWR from 'swr'
import Link from 'next/link'
import { pagesPath } from '../../lib/$path'

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

  const planets = Object.entries(data).map(([key, value]) => ({ name: key, longitude: value.longitude }))

  return (
    <>
      <p>Horoscope</p>
      <Link href={pagesPath.horoscope.foo.$url()}>foo</Link>
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
    </>
  )
}

export default Horoscope
