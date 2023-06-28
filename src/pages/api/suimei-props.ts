// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { NextApiRequest, NextApiResponse } from 'next'
import { getSekkiPair } from '../../suimei/models/SekkiUtil'
import { Daiun, daiun } from '../../suimei/models/Daiun'
import { DateTime } from 'luxon'

type Data = { data: any; daiun: Daiun[] } | { errorMessage: string }

const suimeiProps = async (req: NextApiRequest, res: NextApiResponse<Data>) => {
  const birthday = new Date(req.body.dateTime as string)
  if (birthday.toString() === 'Invalid Date') {
    return res.status(400).json({ errorMessage: 'Invalid birthday' })
  }

  const dateTime = DateTime.fromISO(req.body.dateTime)

  const sekkiPair = await getSekkiPair(birthday)
  const daiunDetail = await daiun(birthday, dateTime, req.body.gender)
  res.status(200).json({
    data: sekkiPair,
    daiun: daiunDetail,
  })
}

export default suimeiProps
