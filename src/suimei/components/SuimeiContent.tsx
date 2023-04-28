import type { FC } from 'react'
import { Suimei } from '../'
import { TitleArea } from './TitleArea'
import { SuimeiForm } from './SuimeiForm'
import { Meisiki } from './Meisiki'
import { GogyoBalance } from './GogyoBalance'
import { Daiun } from './Daiun'
import { Saiun } from './Saiun'

export const SuimeiContent: FC<{ suimei: Suimei }> = ({ suimei }) => {
  return (
    <div className="main">
      <TitleArea />
      <SuimeiForm />
      <Meisiki suimei={suimei} />
      <GogyoBalance />
      <Daiun />
      <Saiun />
    </div>
  )
}
