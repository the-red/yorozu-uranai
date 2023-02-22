import { AddressType, Client, ReverseGeocodeRequest } from '@googlemaps/google-maps-services-js'

type Props = Omit<ReverseGeocodeRequest['params'], 'key'>
export const reverseGeocode = async (props: Props): Promise<string> => {
  const client = new Client()
  const { data } = await client.reverseGeocode({
    params: {
      key: process.env.NEXT_PUBLIC_GOOGLE_GEOCODING_API_KEY!,
      ...props,
    },
  })
  const addresses = data.results

  const localityAddress = addresses.find((_) => _.types.includes(AddressType.locality))
  const politicalAddress = addresses.find((_) => _.types.includes(AddressType.political))
  const [address] = [localityAddress, politicalAddress].map((_) => _?.formatted_address)

  return address ?? ''
}
