import { ChangeEventHandler, FormEventHandler, useMemo, useState, VFC } from 'react'
import { format, getHours, getMinutes } from 'date-fns'

type HoroscopeFormProps = {
  onSubmit: (formValues: FormValues) => void
}

type FormValues = {
  date: string
  hours: number
  minutes: number
  timeUnknown: boolean
  longitude?: number
  latitude?: number
}

export const HoroscopeForm: VFC<HoroscopeFormProps> = ({ onSubmit }) => {
  const now = useMemo(() => new Date(), [])

  const [date, setDate] = useState(format(now, 'yyyy-MM-dd'))
  const handleChangeDate: ChangeEventHandler<HTMLInputElement> = (e) => setDate(e.target.value)

  const [hours, setHours] = useState(getHours(now))
  const handleChangeHours: ChangeEventHandler<HTMLInputElement> = (e) => setHours(Number(e.target.value))

  const [minutes, setMinutes] = useState(getMinutes(now))
  const handleChangeMinutes: ChangeEventHandler<HTMLInputElement> = (e) => setMinutes(Number(e.target.value))

  const [timeUnknown, setTimeUnknown] = useState(false)
  const handleCheckTimeUnknown: ChangeEventHandler<HTMLInputElement> = (e) => setTimeUnknown(e.target.checked)

  const [longitude, setLongitude] = useState<number>()
  const handleChangeLongitude: ChangeEventHandler<HTMLInputElement> = (e) => setLongitude(Number(e.target.value))

  const [latitude, setLatitude] = useState<number>()
  const handleChangeLatitude: ChangeEventHandler<HTMLInputElement> = (e) => setLatitude(Number(e.target.value))

  const handleSubmit: FormEventHandler<HTMLFormElement> = (e) => {
    e.preventDefault()
    onSubmit({ date, hours, minutes, timeUnknown, longitude, latitude })
  }

  return (
    <form onSubmit={handleSubmit} style={{ width: '360px', padding: '16px 8px', fontFamily: 'Noto Sans JP' }}>
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
            <label style={{ marginRight: '8px' }}>経度</label>
            <input
              type="number"
              step="0.001"
              min="0"
              max="180"
              value={longitude || ''}
              onChange={handleChangeLongitude}
              style={{
                width: 80,
              }}
            />
          </div>
          <div>
            <label style={{ marginRight: '8px' }}>緯度</label>
            <input
              type="number"
              step="0.001"
              min="0"
              max="90"
              value={latitude || ''}
              onChange={handleChangeLatitude}
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
