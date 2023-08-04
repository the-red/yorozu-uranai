// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { NextApiRequest, NextApiResponse } from 'next'
import { getSekkiPair } from '../../suimei/models/SekkiUtil'
import { Daiun, generateDaiun } from '../../suimei/models/Daiun'
import { DateTime } from 'luxon'
import { SekkiPair } from '../../suimei/models'

type Data =
  | {
      sekkiPair: SekkiPair
      daiun: Daiun[]
    }
  | { errorMessage: string }

const suimeiProps = async (req: NextApiRequest, res: NextApiResponse<Data>) => {
  const birthday = new Date(req.body.dateTime as string)
  if (birthday.toString() === 'Invalid Date') {
    return res.status(400).json({ errorMessage: 'Invalid birthday' })
  }

  const dateTime = DateTime.fromISO(req.body.dateTime)

  const sekkiPair = await getSekkiPair(birthday)
  const daiunDetail = await generateDaiun(birthday, dateTime, req.body.gender, sekkiPair, DateTime.now().year)
  res.status(200).json({
    sekkiPair: sekkiPair,
    daiun: daiunDetail,
  })
}

export default suimeiProps
