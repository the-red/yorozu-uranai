import { useMemo, FC } from 'react'
import { useForm } from 'react-hook-form'
import { DateTime } from 'luxon'

export type HoroscopeFormProps = {
  onSubmit: (formValues: FormValues) => void
  defaultValues: FormValues
}

export type FormValues = {
  dateTime: DateTime
  timeUnknown: boolean
  lat: number
  lon: number
}

type _FormValues = {
  date: string
  time: string
  zone: string
  timeUnknown: boolean
  lat: number
  lon: number
}

export const HoroscopeForm: FC<HoroscopeFormProps> = ({ onSubmit, defaultValues }) => {
  const defaultDateTime = useMemo(() => defaultValues.dateTime, [])

  const {
    register,
    handleSubmit: hookFormHandleSubmit,
    watch,
    setValue,
    getValues,
  } = useForm<_FormValues>({
    defaultValues: {
      date: defaultDateTime.toFormat('yyyy-MM-dd'),
      time: defaultDateTime.toFormat('HH:mm'),
      zone: defaultDateTime.zoneName,
      timeUnknown: defaultValues.timeUnknown,
      lat: defaultValues.lat,
      lon: defaultValues.lon,
    },
  })

  const isTimeUnknownChecked = watch('timeUnknown')

  const handleSubmit = ({ date, time, zone, timeUnknown, lat, lon }: _FormValues) => {
    if (isTimeUnknownChecked) {
      time = '12:00'
      setValue('time', time)
    }
    const isoDate = `${date}T${time}`
    const dateTime = DateTime.fromISO(isoDate, { zone })

    lat = typeof lat == 'number' && !isNaN(lat) ? lat : 0
    lon = typeof lon == 'number' && !isNaN(lon) ? lon : 0

    onSubmit({ dateTime, lat, lon, timeUnknown })
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
            <span> ({getValues().zone})</span>
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
