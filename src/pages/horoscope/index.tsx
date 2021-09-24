import HoroscopeDetailPage from '../../components/HoroscopeDetailPage'

function HoroscopePage() {
  return (
    <div style={{ width: '960px', margin: '20px auto' }}>
      <div style={{ fontFamily: 'Farewell Pro Regular', fontSize: '60px', marginBottom: '20px' }}>Horoscope</div>
      <HoroscopeDetailPage />
    </div>
  )
}

export default HoroscopePage
