import { ChangeEventHandler, FormEventHandler, useMemo, useState, VFC } from 'react'
import { DateTime } from 'luxon'
type HoroscopeFormProps = {
  onSubmit: (formValues: FormValues) => void
  defaultValues: FormValues
}

export type FormValues = {
  birthday: Date
  lat: number
  lon: number
  timeUnknown: boolean
}

export const HoroscopeForm: VFC<HoroscopeFormProps> = ({ onSubmit, defaultValues }) => {
  const defaultDateTime = useMemo(() => DateTime.fromJSDate(defaultValues.birthday), [])
  const defaultPlace = { lat: defaultValues.lat, lon: defaultValues.lon }

  const [date, setDate] = useState(defaultDateTime.toFormat('yyyy-MM-dd'))
  const handleChangeDate: ChangeEventHandler<HTMLInputElement> = (e) => setDate(e.target.value)

  const [hours, setHours] = useState(defaultDateTime.hour)
  const handleChangeHours: ChangeEventHandler<HTMLInputElement> = (e) => setHours(Number(e.target.value))

  const [minutes, setMinutes] = useState(defaultDateTime.minute)
  const handleChangeMinutes: ChangeEventHandler<HTMLInputElement> = (e) => setMinutes(Number(e.target.value))

  // TODO: 時刻不明なら、時・分フィールドをグレーアウトしたいかも
  const [timeUnknown, setTimeUnknown] = useState(defaultValues.timeUnknown)
  const handleCheckTimeUnknown: ChangeEventHandler<HTMLInputElement> = (e) => setTimeUnknown(e.target.checked)

  const [lat, setLat] = useState<number>(defaultPlace.lat)
  const [lon, setLon] = useState<number>(defaultPlace.lon)

  const handleChangeLat: ChangeEventHandler<HTMLInputElement> = (e) => {
    setLat(Number(e.target.value))
  }

  const handleChangeLon: ChangeEventHandler<HTMLInputElement> = (e) => {
    // TODO: input側で 0 を入力できず、空文字が 0 になる
    setLon(Number(e.target.value))
  }

  const handleSubmit: FormEventHandler<HTMLFormElement> = (e) => {
    e.preventDefault()
    const timeZone = '+09:00'
    const isoDate = timeUnknown
      ? `${date}T12:00${timeZone}`
      : `${date}T${String(hours).padStart(2, '0')}:${String(minutes).padStart(2, '0')}${timeZone}`
    const dateTime = new Date(isoDate)
    onSubmit({ birthday: dateTime, lat, lon, timeUnknown })
  }

  return (
    <form onSubmit={handleSubmit} style={{ width: '100%' }}>
      <div style={{ display: 'flex' }}>
        <label style={{ width: '100px' }}>生年月日</label>
        <div>
          <input type="date" value={date} onChange={handleChangeDate} />
          <div>
            <input
              type="number"
              min="0"
              max="23"
              value={hours}
              onChange={handleChangeHours}
              style={{ marginRight: '8px' }}
            />
            <span style={{ marginRight: '8px' }}>時</span>
            <input
              type="number"
              min="0"
              max="59"
              value={minutes}
              onChange={handleChangeMinutes}
              style={{ marginRight: '8px' }}
            />
            <span>分</span>
            <span>（JST）</span>
          </div>
          <div>
            <span style={{ marginLeft: '12px' }}>
              <input type="checkbox" checked={timeUnknown} onChange={handleCheckTimeUnknown} />
              <label>時刻不明</label>
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
              value={lat || ''}
              onChange={handleChangeLat}
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
              value={lon || ''}
              onChange={handleChangeLon}
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
