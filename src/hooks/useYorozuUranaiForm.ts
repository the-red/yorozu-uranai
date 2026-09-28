import { useEffect } from 'react'
import { useForm, useWatch } from 'react-hook-form'
import { FormValuesBase } from '../lib/params'
import { fetchAddressFromLatLng } from '../lib/fetch-geocode'

export type FormValues = Required<Omit<FormValuesBase, 'name'>> & { address: string }

export type FormProps = {
  onSubmit: (formValues: FormValues) => void
  defaultValues?: Partial<FormValues>
  errorMessage?: string // 結果を求められなかったときの案内
}

export const useYorozuUranaiForm = ({ onSubmit, defaultValues }: FormProps) => {
  const { register, handleSubmit: hookFormHandleSubmit, control, setValue } = useForm<FormValues>({ defaultValues })

  // 入力中のフォームの値
  const values = useWatch({ control })
  const { timeUnknown: isTimeUnknownChecked, zone, lat, lng } = values

  const handleSubmit = async ({ lat, lng, ...rest }: FormValues) => {
    lat = typeof lat === 'number' && !isNaN(lat) ? lat : 0
    lng = typeof lng === 'number' && !isNaN(lng) ? lng : 0

    onSubmit({ lat, lng, ...rest })
  }

  // 地図のタブから呼ばれる。選んだ場所を、フォームに入れる
  useEffect(() => {
    // @ts-expect-error
    window.setLocation = async (lat: number, lng: number) => {
      setValue('lat', lat)
      setValue('lng', lng)
      const address = await fetchAddressFromLatLng(lat, lng)
      setValue('address', address)
      return true
    }
  }, [setValue])

  return { register, hookFormHandleSubmit, values, handleSubmit, isTimeUnknownChecked, zone, lat, lng }
}
