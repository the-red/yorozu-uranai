import Link from 'next/link'
import { FC } from 'react'
import { pagesPath } from '../../lib/$path'
import { FormProps, useYorozuUranaiForm } from '../../hooks/useYorozuUranaiForm'

export const HoroscopeForm: FC<FormProps> = (props) => {
  const { register, hookFormHandleSubmit, watch, handleSubmit, isTimeUnknownChecked, zone, lat, lng } =
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
            <Link href={pagesPath.map.$url({ query: { lat: lat, lng: lng } })} target="_blank" rel="opener">
              地図から検索
            </Link>
          </div>
          <div>{watch('address')}</div>
        </div>
      </div>

      <hr />

      <div className="submit-row">
        <button type="submit" className="submit-button">
          ホロスコープを作成する
        </button>
      </div>
    </form>
  )
}
