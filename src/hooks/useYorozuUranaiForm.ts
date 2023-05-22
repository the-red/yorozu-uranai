import { useForm } from 'react-hook-form'
import { reverseGeocodeByLatLng } from '../lib/geocode'
import { FormValuesBase } from '../lib/params'
import { getFixedOffsetZone } from '../lib/zone'

export type FormValues = Required<Omit<FormValuesBase, 'name'>> & { address: string }

export type FormProps = {
  onSubmit: (formValues: FormValues) => void
  defaultValues?: Partial<FormValues>
}

export const useYorozuUranaiForm = ({ onSubmit, defaultValues }: FormProps) => {
  const { register, handleSubmit: hookFormHandleSubmit, watch, setValue } = useForm<FormValues>({ defaultValues })

  const isTimeUnknownChecked = watch('timeUnknown')
  const lat = watch('lat')
  const lng = watch('lng')
  const zone = getFixedOffsetZone(lng)

  const handleSubmit = async ({ lat, lng, ...rest }: FormValues) => {
    lat = typeof lat === 'number' && !isNaN(lat) ? lat : 0
    lng = typeof lng === 'number' && !isNaN(lng) ? lng : 0

    onSubmit({ lat, lng, ...rest })
  }

  // @ts-expect-error
  window.setLocation = async (lat, lng) => {
    setValue('lat', lat)
    setValue('lng', lng)
    setValue('address', await reverseGeocodeByLatLng({ lat, lng }))
    return true
  }

  return { register, hookFormHandleSubmit, watch, handleSubmit, isTimeUnknownChecked, zone: zone.name, lat, lng }
}
