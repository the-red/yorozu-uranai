// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { NextApiRequest, NextApiResponse } from 'next'
import { julday, equationOfTime as calcEquationOfTime } from '../../astronomy'
import { getSekkiPair } from '../../suimei/models/SekkiUtil'
import { Daiun, generateDaiun } from '../../suimei/models/Daiun'
import { toSolarTime } from '../../suimei/models/SolarTime'
import { getThisYear } from '../../suimei/models/ThisYear'
import { DateTime } from 'luxon'
import { SekkiPair } from '../../suimei/models'

type Data =
  | {
      sekkiPair: SekkiPair
      equationOfTime: number // 均時差（分）
      daiun: Daiun[]
    }
  | { errorMessage: string }

const suimeiProps = async (req: NextApiRequest, res: NextApiResponse<Data>) => {
  const birthday = new Date(req.body.dateTime as string)
  if (birthday.toString() === 'Invalid Date') {
    return res.status(400).json({ errorMessage: 'Invalid birthday' })
  }

  // 生まれた場所の経度（真太陽時の計算に使う）
  const lng = Number(req.body.lng)
  if (req.body.lng == null || isNaN(lng)) {
    return res.status(400).json({ errorMessage: 'Invalid longitude' })
  }

  // 出生地の暦で計算するので、サーバーのタイムゾーンに変換せず、送られてきたオフセットのまま扱う
  const dateTime = DateTime.fromISO(req.body.dateTime, { setZone: true })

  const sekkiPair = await getSekkiPair(dateTime)
  const equationOfTime = await calcEquationOfTime(await julday(birthday))
  const solarTime = toSolarTime(dateTime, lng, equationOfTime)
  const daiunDetail = await generateDaiun(
    birthday,
    dateTime,
    req.body.gender,
    sekkiPair,
    getThisYear(dateTime),
    solarTime.dateTime
  )
  res.status(200).json({
    sekkiPair: sekkiPair,
    equationOfTime,
    daiun: daiunDetail,
  })
}

export default suimeiProps
