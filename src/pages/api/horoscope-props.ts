// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { NextApiRequest, NextApiResponse } from 'next'
import { HoroscopeProps } from '../../horoscope/models'
import { getHoroscopeProps } from '../../horoscope/models/horoscopeFactory'

type Data = { data: HoroscopeProps } | { errorMessage: string }

const horoscopeProps = async (req: NextApiRequest, res: NextApiResponse<Data>) => {
  const birthday = new Date(req.body.dateTime as string)
  if (birthday.toString() === 'Invalid Date') {
    return res.status(400).json({ errorMessage: 'Invalid birthday' })
  }

  // 生まれた場所とハウスシステム
  const lat = Number(req.body.lat)
  const lng = Number(req.body.lng)
  const hsys = req.body.hsys as string

  try {
    const horoscopeProps = await getHoroscopeProps(birthday, lat, lng, hsys)
    res.status(200).json({ data: horoscopeProps })
  } catch (e) {
    res.status(400).json({ errorMessage: (e as Error).message })
  }
}

export default horoscopeProps
