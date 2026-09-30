import type { FC } from 'react'
import dynamic from 'next/dynamic'
import { AspectSettings, Horoscope, Visibility, VisibilityKey } from '../models'
import AspectOptions from './AspectOptions'
import DisplayOptions from './DisplayOptions'
import PlanetPositions from './PlanetPositions'
import HouseCusp from './HouseCusp'
import SignTable from './SignTable'
import AspectChart from './AspectChart'
import { HoroscopeForm } from './HoroscopeForm'
import { FormProps } from '../../hooks/useYorozuUranaiForm'
import { useVisibility } from '../../hooks/useVisibility'
const HoroscopeCircle = dynamic(() => import('./HoroscopeCircle'), { ssr: false })

// horoscope は、まだ求まっていないときと、求められなかったときは無い
type Props = {
  horoscope?: Horoscope
  aspectSettings: AspectSettings
  onChangeAspectSettings: (settings: AspectSettings) => void
  loading: boolean
} & FormProps

const HoroscopeDetailPage: FC<Props> = ({
  horoscope,
  aspectSettings,
  onChangeAspectSettings,
  loading,
  onSubmit,
  defaultValues,
  errorMessage,
}) => {
  const [visibility, setVisible] = useVisibility()

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
              <HoroscopeCircle horoscope={horoscope} radius={220} settings={aspectSettings} visibility={visibility} />
            </div>
            <div className="content circle sp">
              <HoroscopeCircle horoscope={horoscope} radius={170} settings={aspectSettings} visibility={visibility} />
            </div>
          </>
        ) : (
          loading && <div className="content loading">読み込み中…</div>
        )}
      </div>
      {horoscope && (
        <HoroscopeTables
          horoscope={horoscope}
          aspectSettings={aspectSettings}
          onChangeAspectSettings={onChangeAspectSettings}
          visibility={visibility}
          onChangeVisibility={setVisible}
        />
      )}
    </div>
  )
}

type TablesProps = {
  horoscope: Horoscope
  aspectSettings: AspectSettings
  onChangeAspectSettings: (settings: AspectSettings) => void
  visibility: Visibility
  onChangeVisibility: (key: VisibilityKey, visible: boolean) => void
}

const HoroscopeTables: FC<TablesProps> = ({
  horoscope,
  aspectSettings,
  onChangeAspectSettings,
  visibility,
  onChangeVisibility,
}) => {
  return (
    <>
      <div className="content-row">
        <div className="content">
          <div className="content-inner">
            <DisplayOptions
              visibility={visibility}
              onChange={onChangeVisibility}
              hasAsteroids={horoscope.asteroids !== undefined}
            />
          </div>
        </div>
        <div className="content">
          <div className="content-inner">
            <AspectOptions settings={aspectSettings} onChange={onChangeAspectSettings} />
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
            <AspectChart horoscope={horoscope} settings={aspectSettings} visibility={visibility} />
          </div>
        </div>
      </div>
    </>
  )
}

export default HoroscopeDetailPage
