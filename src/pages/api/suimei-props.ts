// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { NextApiRequest, NextApiResponse } from 'next'
import { getSekkiPair } from '../../suimei/models/SekkiUtil'

type Data = { data: any } | { errorMessage: string }

const suimeiProps = async (req: NextApiRequest, res: NextApiResponse<Data>) => {
  const birthday = new Date(req.body.dateTime as string)
  if (birthday.toString() === 'Invalid Date') {
    return res.status(400).json({ errorMessage: 'Invalid birthday' })
  }

  const sekkiPair = await getSekkiPair(birthday)
  res.status(200).json({ data: sekkiPair })
}

export default suimeiProps
