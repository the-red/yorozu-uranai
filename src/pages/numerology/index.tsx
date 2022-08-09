import { NextPage } from 'next'
import Image from 'next/image'
import { FC, useState, VFC } from 'react'
import { useForm } from 'react-hook-form'
import { Numerology } from '../../numerology/Numerology'

import leaf from '../../../public/images/numerology/leaf.png'
import flower from '../../../public/images/numerology/flower.png'
import bird1 from '../../../public/images/numerology/bird-1.png'
import bird2 from '../../../public/images/numerology/bird-2.png'
import Header from '../../components/Header'
import Footer from '../../components/Footer'

type FormValues = {
  birthday: Date
  name: string
}

type NumerologyFormProps = {
  onSubmit: (v: FormValues) => void
}

const NumerologyForm: VFC<NumerologyFormProps> = ({ onSubmit }) => {
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

const CoreNumber: FC = ({ children }) => {
  return (
    <div
      style={{
        position: 'relative',
        width: 'calc(120px * 1.05)',
        height: '120px',
        background: '#9A8EB6',
        clipPath: 'polygon( 50% 0, 100% 38%, 81% 100%, 19% 100%, 0 38%)',
      }}
    >
      <div
        style={{
          position: 'absolute',
          top: '50%',
          left: '50%',
          transform: 'translate(-50%, -50%)',
        }}
      >
        <div
          style={{
            width: 'calc(114px * 1.05)',
            height: '114px',
            background: '#fff',
            clipPath: 'polygon( 50% 0, 100% 38%, 81% 100%, 19% 100%, 0 38%)',
          }}
        />
      </div>

      <div style={{ position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -35%)' }}>
        <div className="tw-text-5xl tw-font-thin" style={{ color: '#9A8EB6' }}>
          {children}
        </div>
      </div>
    </div>
  )
}

const CoreNumberItem: FC = ({ children }) => {
  return <div className="tw-flex tw-flex-col tw-items-center tw-space-y-4">{children}</div>
}

type CoreNumbersProps = {
  numerology: Numerology
}

const CoreNumbers: VFC<CoreNumbersProps> = ({ numerology }) => {
  return (
    <div>
      <div className="tw-text-center tw-text-lg sm:tw-text-xl tw-mb-2">コアナンバー</div>

      <div className="tw-relative tw-bg-white tw-p-8 tw-rounded-tl-2xl tw-rounded-tr-5xl tw-rounded-br-2xl tw-rounded-bl-5xl tw-border-2 tw-border-solid">
        <div className="tw-absolute tw-top-1 tw-left-2  tw-w-20">
          <Image src={bird1} />
        </div>
        <div className="tw-absolute tw-bottom-1 tw-right-2 tw-w-20">
          <Image src={bird2} />
        </div>

        <div className="tw-grid tw-grid-cols-2 sm:tw-grid-cols-3 tw-gap-4 sm:tw-gap-8 sm:tw-w-md tw-py-12 sm:tw-py-0 tw-mx-auto">
          <CoreNumberItem key="0">
            <CoreNumber>{numerology.lifePathNumber}</CoreNumber>
            <div>ライフパス</div>
          </CoreNumberItem>
          <CoreNumberItem key="1">
            <CoreNumber>{numerology.destinyNumber}</CoreNumber>
            <div>ディスティニー</div>
          </CoreNumberItem>
          <CoreNumberItem key="2">
            <CoreNumber>{numerology.soulNumber}</CoreNumber>
            <div>ソウル</div>
          </CoreNumberItem>
          <CoreNumberItem key="3">
            <CoreNumber>{numerology.personalityNumber}</CoreNumber>
            <div>パーソナリティー</div>
          </CoreNumberItem>
          <CoreNumberItem key="4">
            <CoreNumber>{numerology.maturityNumber}</CoreNumber>
            <div>マチュリティー</div>
          </CoreNumberItem>
          <CoreNumberItem key="5">
            <CoreNumber>{numerology.birthdayNumber}</CoreNumber>
            <div>バースデー</div>
          </CoreNumberItem>
        </div>
      </div>
    </div>
  )
}

const NumerologyPage: NextPage = () => {
  const [numerology, setNumerology] = useState<Numerology>()

  const handleSubmit: NumerologyFormProps['onSubmit'] = ({ birthday, name }) => {
    setNumerology(new Numerology({ birthDate: birthday, fullName: name, maxSameNumber: 22 }))
  }

  return (
    <div
      className="numerology tw-min-h-screen tw-pb-8 tw-flex tw-flex-col tw-justify-between tw-items-center tw-space-y-4"
      style={{ backgroundColor: '#EBEBC1', fontFamily: 'Lato Regular, Noto Sans JP Regular' }}
    >
      <Header />
      <div className="tw-w-full tw-max-w-screen-md tw-px-4 tw-mx-auto tw-space-y-8">
        <div style={{ fontFamily: 'MTF Wildflower' }} className="tw-text-center tw-text-7xl sm:tw-text-10xl">
          numerology
        </div>

        <NumerologyForm onSubmit={handleSubmit} />
        {numerology && <CoreNumbers numerology={numerology} />}
      </div>
      <Footer />
    </div>
  )
}

export default NumerologyPage
