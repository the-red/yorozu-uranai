import { NextApiRequest, NextApiResponse } from 'next'
import {
  AddressType,
  Client,
  GeocodeResult,
  Language,
  ReverseGeocodeRequest,
} from '@googlemaps/google-maps-services-js'

type ReverseGeocodeProps = Omit<ReverseGeocodeRequest['params'], 'key'>
const reverseGeocode = async (props: ReverseGeocodeProps) => {
  const client = new Client()
  const { data } = await client.reverseGeocode({
    params: {
      key: process.env.NEXT_PUBLIC_GOOGLE_GEOCODING_API_KEY!,
      language: Language.ja,
      ...props,
    },
  })
  return data.results
}

export const formatAddress = (addresses: GeocodeResult[]): string => {
  const localityAddress = addresses.find((_) => _.types.includes(AddressType.locality))
  const politicalAddress = addresses.find((_) => _.types.includes(AddressType.political))
  const [formattedAddress] = [localityAddress, politicalAddress].filter(Boolean).map((_) => _?.formatted_address)
  return formattedAddress ?? ''
}

export const reverseGeocodeByLatLng = async (latlng: { lat: number; lng: number }): Promise<string> => {
  const addresses = await reverseGeocode({ latlng })
  const formattedAddress = formatAddress(addresses)
  return formattedAddress
}

type Data = { address: string } | { errorMessage: string }

const geocode = async (req: NextApiRequest, res: NextApiResponse<Data>) => {
  const lat = Number(req.body.lat as string)
  const lng = Number(req.body.lng as string)

  if (isNaN(lat) || isNaN(lng)) {
    return res.status(400).json({ errorMessage: 'Invalid LatLng' })
  }

  const address = await reverseGeocodeByLatLng({ lat, lng })
  res.status(200).json({ address })
}

export default geocode
