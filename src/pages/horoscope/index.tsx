import type { GetServerSideProps, InferGetServerSidePropsType } from 'next'

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

export const getServerSideProps: GetServerSideProps<{ horoscope: Horoscope }> = async (context) => {
  const origin = context.req.headers.referer?.replace(context.resolvedUrl, '')
  const res = await fetch(`${origin}/api/horoscope`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ birthday: '1987-09-08T08:53:00+09:00' }),
  })
  const horoscope: Horoscope = await res.json()
  return { props: { horoscope } }
}

function Horoscope({ horoscope }: InferGetServerSidePropsType<typeof getServerSideProps>) {
  console.log(horoscope)
  return (
    <>
      <p>Horoscope</p>
      <pre>{JSON.stringify(horoscope, null, 2)}</pre>
    </>
  )
}

export default Horoscope
