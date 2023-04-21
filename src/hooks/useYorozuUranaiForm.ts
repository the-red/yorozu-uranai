import { useForm } from 'react-hook-form'
import { reverseGeocodeByLatLng } from '../lib/geocode'

export type FormValues = {
  date: string
  time: string
  zone: string
  timeUnknown: boolean
  lat: number
  lng: number
  address: string
}

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

  const handleSubmit = async ({ date, time, zone, timeUnknown, lat, lng, address }: FormValues) => {
    lat = typeof lat === 'number' && !isNaN(lat) ? lat : 0
    lng = typeof lng === 'number' && !isNaN(lng) ? lng : 0

    onSubmit({ date, time, zone, timeUnknown, lat, lng, address })
  }

  // @ts-expect-error
  window.setLocation = async (lat, lng) => {
    setValue('lat', lat)
    setValue('lng', lng)
    setValue('address', await reverseGeocodeByLatLng({ lat, lng }))
    return true
  }

  return { register, hookFormHandleSubmit, watch, handleSubmit, isTimeUnknownChecked, zone, lat, lng }
}
