import Link from 'next/link'
import { FC } from 'react'
import { pagesPath } from '../../lib/$path'
import { FormProps, useYorozuUranaiForm } from '../../hooks/useYorozuUranaiForm'

export const HoroscopeForm: FC<FormProps> = (props) => {
  const { register, hookFormHandleSubmit, watch, handleSubmit, isTimeUnknownChecked, zone, lat, lng } =
    useYorozuUranaiForm(props)

  return (
    <form onSubmit={hookFormHandleSubmit(handleSubmit)} style={{ width: '100%' }}>
      <div style={{ display: 'flex' }}>
        <label style={{ width: '100px' }}>生年月日</label>
        <div>
          <div>
            <input type="date" {...register('date')} />
            <input type="time" {...register('time')} disabled={isTimeUnknownChecked} />
          </div>
          <div>
            <span>{zone}</span>
            <span style={{ marginLeft: '12px' }}>
              <input id="horoscope[time_unknown]" type="checkbox" {...register('timeUnknown')} />
              <label htmlFor="horoscope[time_unknown]">時刻不明</label>
            </span>
          </div>
        </div>
      </div>

      <hr style={{ margin: '20px 0' }} />

      <div style={{ display: 'flex' }}>
        <label style={{ width: 100 }}>出生場所</label>
        <div>
          <div>
            <label style={{ marginRight: '8px' }}>緯度</label>
            <input
              disabled
              type="text"
              {...register('lat', { valueAsNumber: true })}
              style={{
                width: 110,
              }}
            />
          </div>
          <div>
            <label style={{ marginRight: '8px' }}>経度</label>
            <input
              disabled
              type="text"
              {...register('lng', { valueAsNumber: true })}
              style={{
                width: 110,
              }}
            />
          </div>
          <div style={{ textDecoration: 'underline', marginBottom: '5px' }}>
            {/* eslint-disable-next-line react/jsx-no-target-blank */}
            <Link href={pagesPath.map.$url({ query: { lat: lat, lng: lng } })} target="_blank" rel="opener">
              地図から検索
            </Link>
          </div>
          <div>{watch('address')}</div>
        </div>
      </div>

      <hr style={{ margin: '20px 0' }} />

      <div style={{ display: 'flex', justifyContent: 'center' }}>
        <button
          type="submit"
          style={{
            padding: '16px 20px',
            backgroundColor: '#918879',
            color: '#fff',
            fontWeight: 'bold',
            border: 'none',
            borderRadius: '3px',
            cursor: 'pointer',
            outline: 'none',
          }}
        >
          ホロスコープを作成する
        </button>
      </div>
    </form>
  )
}
