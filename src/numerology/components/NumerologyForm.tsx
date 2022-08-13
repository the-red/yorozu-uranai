import Image from 'next/image'
import { VFC } from 'react'
import { useForm } from 'react-hook-form'

import leaf from '../../../public/images/numerology/leaf.png'
import flower from '../../../public/images/numerology/flower.png'

type FormValues = {
  birthday: Date
  name: string
}

export type NumerologyFormProps = {
  onSubmit: (v: FormValues) => void
}

export const NumerologyForm: VFC<NumerologyFormProps> = ({ onSubmit }) => {
  const { register, handleSubmit } = useForm<FormValues>()

  const birthdayInput = (
    <div style={{ display: 'flex', marginBottom: '32px' }}>
      <label style={{ width: '180px' }}>生年月日</label>
      <input type="date" required style={{ width: '200px' }} {...register('birthday', { valueAsDate: true })} />
    </div>
  )

  const nameInput = (
    <div style={{ display: 'flex', marginBottom: '32px' }}>
      <label style={{ width: '180px' }}>名前（ローマ字）</label>
      <div style={{ width: '200px' }}>
        <input type="text" required style={{ width: '100%' }} {...register('name')} />
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

      <div className="tw-relative tw-bg-white tw-p-8 tw-rounded-tl-2xl tw-rounded-tr-5xl tw-rounded-br-2xl tw-rounded-bl-5xl tw-border-2 tw-border-solid">
        <div className="tw-absolute tw-top-0 tw-left-0 tw-w-20" style={{ transform: 'rotate(12deg)' }}>
          <Image src={leaf} />
        </div>
        <div className="tw-absolute tw-bottom-0 tw-right-0 tw-w-20" style={{ transform: 'rotate(12deg)' }}>
          <Image src={flower} />
        </div>

        <form
          onSubmit={handleSubmit(onSubmit)}
          className="tw-py-16 sm:tw-py-0 sm:tw-flex sm:tw-flex-col sm:tw-items-center"
        >
          {birthdayInput}
          {nameInput}
          <div className="">{submitButton}</div>
        </form>
      </div>
    </div>
  )
}
