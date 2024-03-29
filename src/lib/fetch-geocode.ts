export const fetchAddressFromLatLng = async (lat: number, lng: number): Promise<string> => {
  try {
    const res = await fetch('/api/geocode', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ lat, lng }),
    })
    if (!res.ok) {
      const errorText = await res.text()
      try {
      } catch (e) {
        console.error(e)
        alert(errorText)
      } finally {
        return ''
      }
    }
    const json = await res.json()
    return json.address as string
  } catch (e) {
    console.error(e)
    alert('エラーが発生しました\n' + (e as Error)?.message)
    return ''
  }
}
