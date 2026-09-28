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

// suimei は、まだ求まっていないときと、求められなかったときは無い
type Props = { suimei?: Suimei; query: Query; loading: boolean } & FormProps

export const SuimeiContent: FC<Props> = ({ suimei, query, loading, onSubmit, defaultValues, errorMessage }) => {
  return (
    <div className="main">
      <TitleArea />
      <SuimeiForm onSubmit={onSubmit} defaultValues={defaultValues} errorMessage={errorMessage} />
      {suimei ? (
        <>
          <Meisiki suimei={suimei} />
          <GogyoBalance kanshi={suimei.kanshi} />
          <DaiunContent daiun={suimei.daiun} />
          <SaiunContent saiun={suimei.saiun} query={query} />
        </>
      ) : (
        loading && <div className="loading">読み込み中…</div>
      )}
    </div>
  )
}
