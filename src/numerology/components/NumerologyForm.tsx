import { useEffect, FC } from 'react'
import { useForm } from 'react-hook-form'
import { convertKanaToRomaji } from '../models/romajiKana'

export type NumerologyFormValues = {
  name: string
  date: string
}

export type NumerologyFormProps = {
  onSubmit: (v: NumerologyFormValues) => void
  defaultValues?: Partial<NumerologyFormValues>
}

const REGX_NAME_PATTERN = /^[a-z ]+$/i

export const NumerologyForm: FC<NumerologyFormProps> = ({ onSubmit, defaultValues }) => {
  const {
    register,
    formState: { errors },
    watch,
    setValue,
    handleSubmit,
    reset,
  } = useForm<NumerologyFormValues>()

  // NOTE: クエリパラメータをdefaultValuesにする関係で遅延するので、
  // useForm({ defaultValues })だと値が入らないため、reset APIを使う
  useEffect(() => {
    reset(defaultValues)
  }, [reset, defaultValues])

  const name = watch('name')

  const dateInput = (
    <div style={{ display: 'flex', marginBottom: '32px' }}>
      <label style={{ width: '180px' }}>生年月日</label>
      <input type="date" required style={{ width: '200px' }} {...register('date')} />
    </div>
  )

  const nameInput = (
    <div style={{ display: 'flex', marginBottom: '32px' }}>
      <label style={{ width: '180px' }}>名前（ローマ字）</label>
      <div style={{ width: '200px' }}>
        <input type="text" required style={{ width: '100%' }} {...register('name', { pattern: REGX_NAME_PATTERN })} />
        <div
          className="tw-text-sm tw-underline tw-cursor-pointer"
          onClick={() => {
            const romajiName = convertKanaToRomaji(name)
            setValue('name', romajiName)
            if (!REGX_NAME_PATTERN.test(romajiName)) {
              alert('ひらがな・カタカナ・空白文字のみ自動変換されます。')
            }
          }}
        >
          仮名→ローマ字変換
        </div>
        {errors.name && (
          <div className="error">
            英字と半角スペースのみ
            <br />
            入力可能です。
          </div>
        )}
      </div>
    </div>
  )

  const submitButton = (
    <button
      type="submit"
      style={{
        backgroundColor: 'transparent',
        border: 'solid 2px #BA6F87',
        cursor: 'pointer',
        outline: 'none',
        appearance: 'none',
        color: '#BA6F87',
      }}
      className="tw-px-3 tw-py-2 tw-w-full tw-rounded-md tw-font-bold"
    >
      計算する
    </button>
  )

  return (
    <div>
      <div className="tw-text-center tw-text-lg sm:tw-text-xl tw-mb-2">情報入力</div>

      <div className="tw-relative tw-bg-white tw-p-8 tw-rounded-tl-2xl tw-rounded-tr-5xl tw-rounded-br-2xl tw-rounded-bl-5xl tw-border-2 tw-border-solid form_outer">
        <form
          onSubmit={handleSubmit(onSubmit)}
          className="tw-py-16 sm:tw-py-0 sm:tw-flex sm:tw-flex-col sm:tw-items-center"
        >
          {dateInput}
          {nameInput}
          <div className="">{submitButton}</div>
        </form>
      </div>
    </div>
  )
}
