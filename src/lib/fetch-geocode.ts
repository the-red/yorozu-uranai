export const fetchAddressFromLatLng = async (lat: number, lng: number): Promise<string> => {
  const res = await fetch('/api/geocode', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ lat, lng }),
  })
  if (!res.ok) {
    const errorText = await res.text()
    try {
    } catch (e) {
      alert(errorText)
    } finally {
      return ''
    }
  }
  const json = await res.json()
  return json.address as string
}
