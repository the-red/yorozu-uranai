import { useMemo, FC } from 'react'
import { useForm } from 'react-hook-form'
import { DateTime } from 'luxon'

export type HoroscopeFormProps = {
  onSubmit: (formValues: FormValues) => void
  defaultValues: FormValues
}

export type FormValues = {
  birthday: DateTime
  lat: number
  lon: number
  timeUnknown: boolean
  zone: string
}

type _FormValues = {
  date: string
  hours: number
  minutes: number
  timeUnknown: boolean
  lat: number
  lon: number
  zone: string
}

export const HoroscopeForm: FC<HoroscopeFormProps> = ({ onSubmit, defaultValues }) => {
  const defaultDateTime = useMemo(() => defaultValues.birthday, [])

  const {
    register,
    handleSubmit: hookFormHandleSubmit,
    watch,
  } = useForm<_FormValues>({
    defaultValues: {
      date: defaultDateTime.toFormat('yyyy-MM-dd'),
      hours: defaultDateTime.hour,
      minutes: defaultDateTime.minute,
      timeUnknown: false,
      lat: defaultValues.lat,
      lon: defaultValues.lon,
      zone: defaultValues.zone,
    },
  })

  const isTimeUnknownChecked = watch('timeUnknown')

  const handleSubmit = ({ date, hours, minutes, timeUnknown, lat, lon, zone }: _FormValues) => {
    const isoDate = timeUnknown
      ? `${date}T12:00`
      : `${date}T${String(hours).padStart(2, '0')}:${String(minutes).padStart(2, '0')}`
    const dateTime = DateTime.fromISO(isoDate)

    lat = typeof lat == 'number' && !isNaN(lat) ? lat : 0
    lon = typeof lon == 'number' && !isNaN(lon) ? lon : 0

    onSubmit({ birthday: dateTime, lat, lon, timeUnknown, zone })
  }

  return (
    <form onSubmit={hookFormHandleSubmit(handleSubmit)} style={{ width: '100%' }}>
      <div style={{ display: 'flex' }}>
        <label style={{ width: '100px' }}>生年月日</label>
        <div>
          <input type="date" {...register('date')} />
          <div>
            <input
              type="number"
              min="0"
              max="23"
              {...register('hours', { valueAsNumber: true })}
              disabled={isTimeUnknownChecked}
              style={{ marginRight: '8px' }}
            />
            <span style={{ marginRight: '8px' }}>時</span>
            <input
              type="number"
              min="0"
              max="59"
              {...register('minutes', { valueAsNumber: true })}
              disabled={isTimeUnknownChecked}
              style={{ marginRight: '8px' }}
            />
            <span>分</span>
            <span> ({defaultValues.zone})</span>
          </div>
          <div>
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
              type="number"
              step="0.0000000000000001"
              min="-90"
              max="90"
              {...register('lat', { valueAsNumber: true })}
              style={{
                width: 80,
              }}
            />
          </div>
          <div>
            <label style={{ marginRight: '8px' }}>経度</label>
            <input
              type="number"
              step="0.0000000000000001"
              min="-180"
              max="180"
              {...register('lon', { valueAsNumber: true })}
              style={{
                width: 80,
              }}
            />
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
