import Link from 'next/link'
import { FC } from 'react'
import { pagesPath } from '../../lib/$path'
import { FormProps, useYorozuUranaiForm } from '../../hooks/useYorozuUranaiForm'
import { buildMapQuery } from '../../lib/map-return'
import { HOUSE_SYSTEMS, HOUSE_SYSTEM_NAMES_JA, HouseSystem, MAIN_HOUSE_SYSTEMS } from '../models'

const HouseOption = ({ house }: { house: HouseSystem }) => <option value={house}>{HOUSE_SYSTEM_NAMES_JA[house]}</option>

export const HoroscopeForm: FC<FormProps> = (props) => {
  const { register, hookFormHandleSubmit, values, handleSubmit, isTimeUnknownChecked, zone, lat, lng } =
    useYorozuUranaiForm(props)

  return (
    <form onSubmit={hookFormHandleSubmit(handleSubmit)} className="horoscope-form">
      <div className="form-row">
        <label className="form-label">生年月日</label>
        <div>
          <div>
            <input type="date" {...register('date')} />
            <input type="time" {...register('time')} disabled={isTimeUnknownChecked} />
          </div>
          <div>
            <span>{zone}</span>
            <span className="time-unknown">
              <input id="horoscope[time_unknown]" type="checkbox" {...register('timeUnknown')} />
              <label htmlFor="horoscope[time_unknown]">時刻不明</label>
            </span>
          </div>
        </div>
      </div>

      <hr />

      <div className="form-row">
        <label className="form-label">出生場所</label>
        <div>
          <div>
            <label className="lat-lng-label">緯度</label>
            <input disabled type="text" className="lat-lng-input" {...register('lat', { valueAsNumber: true })} />
          </div>
          <div>
            <label className="lat-lng-label">経度</label>
            <input disabled type="text" className="lat-lng-input" {...register('lng', { valueAsNumber: true })} />
          </div>
          <div className="map-link">
            <Link href={pagesPath.map.$url({ query: buildMapQuery('horoscope', values) })} target="_blank" rel="opener">
              地図から検索
            </Link>
          </div>
          <div>{values.address}</div>
        </div>
      </div>

      <hr />

      <div className="form-row">
        <label className="form-label" htmlFor="horoscope[house]">
          ハウス
        </label>
        <div>
          <select id="horoscope[house]" className="house-select" {...register('house')}>
            {/* 主なものを、先に出す */}
            {MAIN_HOUSE_SYSTEMS.map((_) => (
              <HouseOption key={_} house={_} />
            ))}
            <optgroup label="そのほか">
              {HOUSE_SYSTEMS.filter((_) => !MAIN_HOUSE_SYSTEMS.includes(_)).map((_) => (
                <HouseOption key={_} house={_} />
              ))}
            </optgroup>
          </select>
        </div>
      </div>

      <hr />

      {props.errorMessage && (
        <p className="form-error" role="alert">
          {props.errorMessage}
        </p>
      )}

      <div className="submit-row">
        <button type="submit" className="submit-button">
          ホロスコープを作成する
        </button>
      </div>
    </form>
  )
}
