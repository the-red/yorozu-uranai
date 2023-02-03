import Link from 'next/link'
import { FC } from 'react'
import { useForm } from 'react-hook-form'
import { pagesPath } from '../../lib/$path'

export type HoroscopeFormValues = {
  date: string
  time: string
  zone: string
  timeUnknown: boolean
  lat: number
  lng: number
}

export type HoroscopeFormProps = {
  onSubmit: (formValues: HoroscopeFormValues) => void
  defaultValues?: Partial<HoroscopeFormValues>
}

export const HoroscopeForm: FC<HoroscopeFormProps> = ({ onSubmit, defaultValues }) => {
  const {
    register,
    handleSubmit: hookFormHandleSubmit,
    watch,
    setValue,
  } = useForm<HoroscopeFormValues>({ defaultValues })

  const isTimeUnknownChecked = watch('timeUnknown')
  const zone = watch('zone')
  const lat = watch('lat')
  const lng = watch('lng')

  const handleSubmit = ({ date, time, zone, timeUnknown, lat, lng }: HoroscopeFormValues) => {
    lat = typeof lat === 'number' && !isNaN(lat) ? lat : 0
    lng = typeof lng === 'number' && !isNaN(lng) ? lng : 0

    onSubmit({ date, time, zone, timeUnknown, lat, lng })
  }

  // @ts-expect-error
  window.setLocation = (lat, lng) => {
    setValue('lat', lat)
    setValue('lng', lng)
    return true
  }

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
              id="lat-input"
              type="number"
              step="0.0000001"
              min="-90"
              max="90"
              {...register('lat', { valueAsNumber: true })}
              style={{
                width: 110,
              }}
            />
          </div>
          <div>
            <label style={{ marginRight: '8px' }}>経度</label>
            <input
              id="lng-input"
              type="number"
              step="0.0000001"
              min="-180"
              max="180"
              {...register('lng', { valueAsNumber: true })}
              style={{
                width: 110,
              }}
            />
          </div>
          <div style={{ textDecoration: 'underline' }}>
            {/* eslint-disable-next-line react/jsx-no-target-blank */}
            <Link href={pagesPath.map.$url({ query: { lat: lat, lng: lng } })} target="_blank" rel="opener">
              緯度経度を検索
            </Link>
          </div>
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
