import type { NextApiRequest, NextApiResponse } from 'next'
import { ErrorJson, NumerologyJson, allowGet, pageUrl, sendInvalidQuery, sendResult } from '../../lib/json-api'
import { parseNumerologyQuery, toDate } from '../../lib/json-query'
import { Numerology } from '../../numerology/models/Numerology'
import { toNumerologyResult } from '../../numerology/models/json'

const numerology = (req: NextApiRequest, res: NextApiResponse<NumerologyJson | ErrorJson>) => {
  if (!allowGet(req, res)) return

  const parsed = parseNumerologyQuery(req.query)
  if (!parsed.ok) {
    return sendInvalidQuery(res, parsed.error)
  }
  const { input } = parsed

  const { name, maxSameNumber } = input
  const result = toNumerologyResult(new Numerology({ birthDate: toDate(input), fullName: name, maxSameNumber }))
  sendResult(res, { type: 'numerology', input, page: pageUrl(req, '/numerology', input), raw: null, result })
}

export default numerology
