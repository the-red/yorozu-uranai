import { useState } from 'react'
import { HoroscopeForm, FormValues } from '../../components/HoroscopeForm'

import HoroscopeDetailPage from '../../components/HoroscopeDetailPage'

type HoroscopeSeed = {
  birthday: Date
  lat: number
  lon: number
  hsys?: string
  timeUnknown: boolean
}
function HoroscopePage() {
  const defaultValues: HoroscopeSeed = {
    birthday: new Date(),
    lat: 35.604839,
    lon: 139.667717,
    // hsys: 'Placidus(default)',
    timeUnknown: false,
  }

  const [horoscopeSeed, setHoroscopeSeed] = useState<HoroscopeSeed>(defaultValues)

  return (
    <div>
      <div style={{ width: '960px', margin: '20px auto' }}>
        <div style={{ fontFamily: 'Farewell Pro Regular', fontSize: '60px', marginBottom: '20px' }}>Horoscope</div>
        <div style={{ width: '50%', display: 'flex', justifyContent: 'center', paddingTop: '50px' }}>
          <HoroscopeForm
            onSubmit={({ birthday: dateTime, lat, lon, timeUnknown }: FormValues) => {
              setHoroscopeSeed({
                birthday: dateTime,
                lat,
                lon,
                timeUnknown,
              })
              console.log('submit', horoscopeSeed.birthday)
            }}
            defaultValues={horoscopeSeed}
          />
        </div>
      </div>
      <HoroscopeDetailPage horoscopeSeed={horoscopeSeed}></HoroscopeDetailPage>
    </div>
  )
}

export default HoroscopePage
