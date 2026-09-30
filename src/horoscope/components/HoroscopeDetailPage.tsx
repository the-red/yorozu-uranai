import type { FC } from 'react'
import dynamic from 'next/dynamic'
import { Horoscope, HoroscopeSettings } from '../models'
import AspectOptions from './AspectOptions'
import DisplayOptions from './DisplayOptions'
import PlanetPositions from './PlanetPositions'
import HouseCusp from './HouseCusp'
import SignTable from './SignTable'
import AspectChart from './AspectChart'
import { HoroscopeForm } from './HoroscopeForm'
import { FormProps } from '../../hooks/useYorozuUranaiForm'
const HoroscopeCircle = dynamic(() => import('./HoroscopeCircle'), { ssr: false })

// horoscope は、まだ求まっていないときと、求められなかったときは無い
type Props = {
  horoscope?: Horoscope
  settings: HoroscopeSettings
  onChangeSettings: (settings: HoroscopeSettings) => void
  loading: boolean
} & FormProps

const HoroscopeDetailPage: FC<Props> = ({
  horoscope,
  settings,
  onChangeSettings,
  loading,
  onSubmit,
  defaultValues,
  errorMessage,
}) => {
  const { visibility, aspects } = settings

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
              <HoroscopeCircle horoscope={horoscope} radius={220} settings={aspects} visibility={visibility} />
            </div>
            <div className="content circle sp">
              <HoroscopeCircle horoscope={horoscope} radius={170} settings={aspects} visibility={visibility} />
            </div>
          </>
        ) : (
          loading && <div className="content loading">読み込み中…</div>
        )}
      </div>
      {horoscope && <HoroscopeTables horoscope={horoscope} settings={settings} onChangeSettings={onChangeSettings} />}
    </div>
  )
}

type TablesProps = {
  horoscope: Horoscope
  settings: HoroscopeSettings
  onChangeSettings: (settings: HoroscopeSettings) => void
}

const HoroscopeTables: FC<TablesProps> = ({ horoscope, settings, onChangeSettings }) => {
  const { visibility, aspects } = settings
  return (
    <>
      <div className="content-row">
        <div className="content">
          <div className="content-inner">
            <DisplayOptions
              visibility={visibility}
              onChange={(key, visible) =>
                onChangeSettings({ ...settings, visibility: { ...visibility, [key]: visible } })
              }
              hasAsteroids={horoscope.asteroids !== undefined}
            />
          </div>
        </div>
        <div className="content">
          <div className="content-inner">
            <AspectOptions settings={aspects} onChange={(aspects) => onChangeSettings({ ...settings, aspects })} />
          </div>
        </div>
      </div>
      <div className="content-row">
        <div className="content">
          <div className="content-inner">
            <PlanetPositions horoscope={horoscope} visibility={visibility} />
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
            <AspectChart horoscope={horoscope} settings={aspects} visibility={visibility} />
          </div>
        </div>
      </div>
    </>
  )
}

export default HoroscopeDetailPage
