import type { FC } from 'react'
import { Suimei } from '../models'
import { TitleArea } from './TitleArea'
import { FormProps } from '../../hooks/useYorozuUranaiForm'
import { SuimeiForm } from './SuimeiForm'
import { Meisiki } from './Meisiki'
import { GogyoBalance } from './GogyoBalance'
import { DaiunContent } from './Daiun'
import { Saiun } from './Saiun'

type Props = { suimei: Suimei } & FormProps

export const SuimeiContent: FC<Props> = ({ suimei, onSubmit, defaultValues }) => {
  return (
    <div className="main">
      <TitleArea />
      <SuimeiForm onSubmit={onSubmit} defaultValues={defaultValues} />
      <Meisiki suimei={suimei} />
      <GogyoBalance kanshi={suimei.kanshi} />
      <DaiunContent daiun={suimei.daiun} />
      <Saiun />
    </div>
  )
}
