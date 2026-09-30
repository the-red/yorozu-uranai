import { ChangeEvent, useCallback, useEffect } from 'react'
import { useForm, useWatch } from 'react-hook-form'
import { FormValuesBase } from '../lib/params'
import { fetchAddressFromLatLng } from '../lib/fetch-geocode'
import { NOT_SELECTED, toLatLng, toPlace } from '../lib/prefectures'

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

  // 選んだ場所を、フォームに入れる
  const setLocation = useCallback(
    async (lat: number, lng: number) => {
      setValue('lat', lat)
      setValue('lng', lng)
      const address = await fetchAddressFromLatLng(lat, lng)
      setValue('address', address)
      return true
    },
    [setValue]
  )

  // 地図のタブから呼ばれる
  useEffect(() => {
    // @ts-expect-error
    window.setLocation = setLocation
  }, [setLocation])

  // 都道府県の選択欄の値。緯度経度から求める
  const place = lat === undefined || lng === undefined ? NOT_SELECTED : toPlace({ lat, lng })
  const handlePlaceChange = (event: ChangeEvent<HTMLSelectElement>) => {
    const latLng = toLatLng(event.target.value)
    if (latLng) {
      setLocation(latLng.lat, latLng.lng)
    }
  }

  return {
    register,
    hookFormHandleSubmit,
    values,
    handleSubmit,
    isTimeUnknownChecked,
    zone,
    lat,
    lng,
    place,
    handlePlaceChange,
  }
}
