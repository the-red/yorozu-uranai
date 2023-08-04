import type { FC } from 'react'
import { Suimei } from '../models'
import { TitleArea } from './TitleArea'
import { FormProps } from '../../hooks/useYorozuUranaiForm'
import { SuimeiForm } from './SuimeiForm'
import { Meisiki } from './Meisiki'
import { GogyoBalance } from './GogyoBalance'
import { DaiunContent } from './Daiun'
import { SaiunContent } from './Saiun'
import { Query } from '../../lib/params'

type Props = { suimei: Suimei; query: Query } & FormProps

export const SuimeiContent: FC<Props> = ({ suimei, query, onSubmit, defaultValues }) => {
  return (
    <div className="main">
      <TitleArea />
      <SuimeiForm onSubmit={onSubmit} defaultValues={defaultValues} />
      <Meisiki suimei={suimei} />
      <GogyoBalance kanshi={suimei.kanshi} />
      <DaiunContent daiun={suimei.daiun} />
      <SaiunContent saiun={suimei.saiun} query={query} />
    </div>
  )
}
