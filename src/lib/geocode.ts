export const geocode = async (...props: Parameters<google.maps.Geocoder['geocode']>) => {
  const geocoder = new window.google.maps.Geocoder()
  return geocoder.geocode(...props)
}
