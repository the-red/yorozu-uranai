// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { NextApiRequest, NextApiResponse } from 'next'
import { HoroscopeProps } from '../../horoscope'
import { getHoroscopeProps } from '../../horoscope/horoscopeFactory'

type Data = { data: HoroscopeProps } | { errorMessage: string }

export default async (req: NextApiRequest, res: NextApiResponse<Data>) => {
  const birthday = new Date(req.body.dateTime as string)
  if (birthday.toString() === 'Invalid Date') {
    return res.status(400).json({ errorMessage: 'Invalid birthday' })
  }

  // 生まれた場所とハウスシステム
  const lat = Number(req.body.lat)
  const lon = Number(req.body.lon)
  const hsys = req.body.hsys as string

  const horoscopeProps = await getHoroscopeProps(birthday, lat, lon, hsys)
  res.status(200).json({ data: horoscopeProps })
}
