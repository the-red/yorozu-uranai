import type { Kanshi } from './Kanshi'
import type { 節 } from './Sekki'
import type { TenkanTsuhensei } from './Tsuhensei'
import type { Zoukan, ZoukanTsuhensei } from './Zoukan'

export type Suimei = {
  sekki: 節
  kanshi: Kanshi
  tenkanTsuhensei: TenkanTsuhensei
  zoukan: Zoukan
  zoukanTsuhensei: ZoukanTsuhensei
}
