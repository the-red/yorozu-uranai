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
          className="kana_to_romaji"
          onClick={() => {
            const romajiName = convertKanaToRomaji(name)
            setValue('name', romajiName)
            if (!REGX_NAME_PATTERN.test(romajiName)) {
              alert('ひらがな・カタカナで入力してください。')
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
      className="submit_button"
    >
      計算する
    </button>
  )

  return (
    <div>
      <div className="section_title">情報入力</div>

      <div className="card form_outer">
        <form onSubmit={handleSubmit(onSubmit)}>
          {dateInput}
          {nameInput}
          <div className="">{submitButton}</div>
        </form>
      </div>
    </div>
  )
}
