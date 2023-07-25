import { Daiun } from './Daiun'
import type { Kanshi } from './Kanshi'
import { Saiun } from './Saiun'
import type { 節 } from './Sekki'
import type { TenkanTsuhensei } from './Tsuhensei'
import type { Zoukan, ZoukanTsuhensei } from './Zoukan'
import type { Tokushusei } from './tokushusei'

export type Suimei = {
  sekki: 節
  kanshi: Kanshi
  tenkanTsuhensei: TenkanTsuhensei
  zoukan: Zoukan
  zoukanTsuhensei: ZoukanTsuhensei
  tokushusei: Tokushusei
  daiun: Daiun[]
  saiun: Saiun[]
}
