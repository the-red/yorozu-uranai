import { ChangeEventHandler, FormEventHandler, useMemo, useState, VFC } from 'react'
import { DateTime } from 'luxon'
type HoroscopeFormProps = {
  onSubmit: (formValues: FormValues) => void
}

export type FormValues = {
  dateTime: Date
  longitude: number
  latitude: number
}

export const HoroscopeForm: VFC<HoroscopeFormProps> = ({ onSubmit }) => {
  const now = useMemo(() => DateTime.fromJSDate(new Date()), [])

  const [date, setDate] = useState(now.toFormat('yyyy-MM-dd'))
  const handleChangeDate: ChangeEventHandler<HTMLInputElement> = (e) => setDate(e.target.value)

  const [hours, setHours] = useState(now.hour)
  const handleChangeHours: ChangeEventHandler<HTMLInputElement> = (e) => setHours(Number(e.target.value))

  const [minutes, setMinutes] = useState(now.minute)
  const handleChangeMinutes: ChangeEventHandler<HTMLInputElement> = (e) => setMinutes(Number(e.target.value))

  const [timeUnknown, setTimeUnknown] = useState(false)
  const handleCheckTimeUnknown: ChangeEventHandler<HTMLInputElement> = (e) => setTimeUnknown(e.target.checked)

  const JWP = { latitude: 35.604839, longitude: 139.667717 }
  const [longitude, setLongitude] = useState<number>(JWP.longitude)
  const [latitude, setLatitude] = useState<number>(JWP.latitude)

  const handleChangeLatitude: ChangeEventHandler<HTMLInputElement> = (e) => {
    setLatitude(Number(e.target.value))
  }

  const handleChangeLongitude: ChangeEventHandler<HTMLInputElement> = (e) => {
    // TODO: input側で 0 を入力できず、空文字が 0 になる
    setLongitude(Number(e.target.value))
  }

  const handleSubmit: FormEventHandler<HTMLFormElement> = (e) => {
    e.preventDefault()
    if (timeUnknown) {
      setHours(12)
      setMinutes(0)
    }
    const isoDate = `${date}T${String(hours).padStart(2, '0')}:${String(minutes).padStart(2, '0')}+09:00`
    const dateTime = new Date(isoDate)
    onSubmit({ dateTime, longitude, latitude })
  }

  return (
    <form onSubmit={handleSubmit} style={{ width: '360px', padding: '16px 8px' }}>
      <div style={{ display: 'flex' }}>
        <label style={{ width: '100px' }}>生年月日</label>
        <div>
          <input type="date" value={date} onChange={handleChangeDate} />
          <div>
            <input
              type="number"
              min="0"
              max="24"
              value={hours}
              onChange={handleChangeHours}
              style={{ marginRight: '8px' }}
            />
            <span style={{ marginRight: '8px' }}>時</span>
            <input
              type="number"
              min="0"
              max="60"
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
              value={latitude || ''}
              onChange={handleChangeLatitude}
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
              value={longitude || ''}
              onChange={handleChangeLongitude}
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
