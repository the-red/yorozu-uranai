import { AddressType, Client, ReverseGeocodeRequest } from '@googlemaps/google-maps-services-js'
import { roundLatLng } from './math'

export const geocodeByAddress = async (address: string) => {
  const client = new Client()
  const { data } = await client.geocode({
    params: {
      key: process.env.NEXT_PUBLIC_GOOGLE_GEOCODING_API_KEY!,
      address,
    },
  })
  const [result] = data.results

  return {
    formattedAddress: result.formatted_address,
    lat: roundLatLng(result.geometry.location.lat),
    lng: roundLatLng(result.geometry.location.lng),
  }
}

type ReverseGeocodeProps = Omit<ReverseGeocodeRequest['params'], 'key'>
const reverseGeocode = async (props: ReverseGeocodeProps) => {
  const client = new Client()
  const { data } = await client.reverseGeocode({
    params: {
      key: process.env.NEXT_PUBLIC_GOOGLE_GEOCODING_API_KEY!,
      ...props,
    },
  })
  return data.results
}

export const reverseGeocodeByLatLng = async (latlng: { lat: number; lng: number }): Promise<string> => {
  const addresses = await reverseGeocode({ latlng })

  const localityAddress = addresses.find((_) => _.types.includes(AddressType.locality))
  const politicalAddress = addresses.find((_) => _.types.includes(AddressType.political))
  const [formattedAddress] = [localityAddress, politicalAddress].map((_) => _?.formatted_address)

  return formattedAddress ?? ''
}

export const reverseGeocodeByPlaceId = async (place_id: string): Promise<string> => {
  const [address] = await reverseGeocode({ place_id })
  const formattedAddress = address?.formatted_address
  return formattedAddress ?? ''
}
