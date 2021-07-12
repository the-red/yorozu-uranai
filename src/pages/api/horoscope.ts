// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { NextApiRequest, NextApiResponse } from 'next'
import { Horoscope } from '../../horoscope/Horoscope'

type Data = { horoscope: Horoscope } | { errorMessage: string }

export default async (req: NextApiRequest, res: NextApiResponse<Data>) => {
  console.log(req.body.birthday)
  const birthday = new Date(req.body.birthday as string)
  if (birthday.toString() === 'Invalid Date') {
    return res.status(400).json({ errorMessage: 'Invalid birthday' })
  }
  const horoscope = await Horoscope.getInstance(birthday)
  res.status(200).json({ horoscope })
}
