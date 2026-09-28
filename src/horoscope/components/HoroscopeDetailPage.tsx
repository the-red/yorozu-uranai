import type { FC } from 'react'
import dynamic from 'next/dynamic'
import { Horoscope } from '../models'
import PlanetPositions from './PlanetPositions'
import HouseCusp from './HouseCusp'
import SignTable from './SignTable'
import AspectChart from './AspectChart'
import { HoroscopeForm } from './HoroscopeForm'
import { FormProps } from '../../hooks/useYorozuUranaiForm'
const HoroscopeCircle = dynamic(() => import('./HoroscopeCircle'), { ssr: false })

// horoscope は、まだ求まっていないときと、求められなかったときは無い
type Props = { horoscope?: Horoscope; orb: number; loading: boolean } & FormProps

const HoroscopeDetailPage: FC<Props> = ({ horoscope, orb, loading, onSubmit, defaultValues, errorMessage }) => {
  return (
    <div>
      <div className="content-row">
        <div className="content form">
          <div className="content-inner">
            <HoroscopeForm onSubmit={onSubmit} defaultValues={defaultValues} errorMessage={errorMessage} />
          </div>
        </div>
        {horoscope ? (
          <>
            <div className="content circle pc">
              <HoroscopeCircle horoscope={horoscope} radius={220} orb={orb} />
            </div>
            <div className="content circle sp">
              <HoroscopeCircle horoscope={horoscope} radius={170} orb={orb} />
            </div>
          </>
        ) : (
          loading && <div className="content loading">読み込み中…</div>
        )}
      </div>
      {horoscope && <HoroscopeTables horoscope={horoscope} orb={orb} />}
    </div>
  )
}

const HoroscopeTables: FC<{ horoscope: Horoscope; orb: number }> = ({ horoscope, orb }) => {
  return (
    <>
      <div className="content-row">
        <div className="content">
          <div className="content-inner">
            <PlanetPositions horoscope={horoscope} />
          </div>
        </div>
        <div className="content">
          <div className="content-inner">
            <HouseCusp horoscope={horoscope} />
          </div>
        </div>
      </div>
      <div className="content-row">
        <div className="content">
          <div className="content-inner">
            <SignTable planets={Object.values(horoscope.planets)} />
          </div>
        </div>
        <div className="content">
          <div className="content-inner">
            <AspectChart horoscope={horoscope} orb={orb} />
          </div>
        </div>
      </div>
    </>
  )
}

export default HoroscopeDetailPage
