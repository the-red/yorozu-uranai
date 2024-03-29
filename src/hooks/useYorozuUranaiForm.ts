import { useForm } from 'react-hook-form'
import { FormValuesBase } from '../lib/params'
import { fetchAddressFromLatLng } from '../lib/fetch-geocode'

export type FormValues = Required<Omit<FormValuesBase, 'name'>> & { address: string }

export type FormProps = {
  onSubmit: (formValues: FormValues) => void
  defaultValues?: Partial<FormValues>
}

export const useYorozuUranaiForm = ({ onSubmit, defaultValues }: FormProps) => {
  const { register, handleSubmit: hookFormHandleSubmit, watch, setValue } = useForm<FormValues>({ defaultValues })

  const isTimeUnknownChecked = watch('timeUnknown')
  const zone = watch('zone')
  const lat = watch('lat')
  const lng = watch('lng')

  const handleSubmit = async ({ lat, lng, ...rest }: FormValues) => {
    lat = typeof lat === 'number' && !isNaN(lat) ? lat : 0
    lng = typeof lng === 'number' && !isNaN(lng) ? lng : 0

    onSubmit({ lat, lng, ...rest })
  }

  // @ts-expect-error
  window.setLocation = async (lat: number, lng: number) => {
    setValue('lat', lat)
    setValue('lng', lng)
    const address = await fetchAddressFromLatLng(lat, lng)
    setValue('address', address)
    return true
  }

  return { register, hookFormHandleSubmit, watch, handleSubmit, isTimeUnknownChecked, zone, lat, lng }
}
