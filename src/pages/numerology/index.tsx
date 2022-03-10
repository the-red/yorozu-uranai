import { NextPage } from 'next'
import Image from 'next/image'
import { FC, FormEventHandler, useState, VFC } from 'react'
import { Numerology } from '../../numerology/Numerology'

import leaf from '../../../public/images/numerology/leaf.png'
import flower from '../../../public/images/numerology/flower.png'
import bird1 from '../../../public/images/numerology/bird-1.png'
import bird2 from '../../../public/images/numerology/bird-2.png'

type FormValues = {
  birthday: Date
  name: string
}

type NumerologyFormProps = {
  onSubmit: (v: FormValues) => void
}

const NumerologyForm: VFC<NumerologyFormProps> = ({ onSubmit }) => {
  const [birthday, setBirthday] = useState('')
  const [name, setName] = useState('')

  const handleSubmit: FormEventHandler = (e) => {
    e.preventDefault()
    onSubmit({ birthday: new Date(birthday), name })
  }

  return (
    <div>
      <div style={{ fontWeight: 'bold', fontSize: '20px', textAlign: 'center', marginBottom: '20px' }}>情報入力</div>

      <div className="tw-relative tw-bg-white tw-p-8 tw-rounded-tl-2xl tw-rounded-tr-5xl tw-rounded-br-2xl tw-rounded-bl-5xl tw-border-2 tw-border-solid">
        <div className="tw-absolute tw-top-0 tw-left-0 tw-w-20" style={{ transform: 'rotate(12deg)' }}>
          <Image src={leaf} />
        </div>
        <div className="tw-absolute tw-bottom-0 tw-right-0 tw-w-20" style={{ transform: 'rotate(12deg)' }}>
          <Image src={flower} />
        </div>

        <form onSubmit={handleSubmit} className="tw-flex tw-flex-col tw-items-center">
          <div style={{ display: 'flex', marginBottom: '32px' }}>
            <label style={{ width: '200px' }}>生年月日</label>
            <input type="date" required style={{ width: '200px' }} onChange={(e) => setBirthday(e.target.value)} />
          </div>

          <div style={{ display: 'flex', marginBottom: '32px' }}>
            <label style={{ width: '200px' }}>名前（ローマ字）</label>

            <div style={{ width: '200px' }}>
              <input type="text" required style={{ width: '100%' }} onChange={(e) => setName(e.target.value)} />
            </div>
          </div>

          <div style={{ marginLeft: '200px', width: '200px' }}>
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
          </div>
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

type CoreNumbersProps = {
  numerology: Numerology
}

const CoreNumbers: VFC<CoreNumbersProps> = ({ numerology }) => {
  return (
    <div>
      <div style={{ fontWeight: 'bold', fontSize: '20px', textAlign: 'center', marginBottom: '20px' }}>
        コアナンバー
      </div>
      <div className="tw-relative tw-bg-white tw-p-8 tw-rounded-tl-2xl tw-rounded-tr-5xl tw-rounded-br-2xl tw-rounded-bl-5xl tw-border-2 tw-border-solid">
        <div className="tw-absolute tw-top-1 tw-left-2  tw-w-20">
          <Image src={bird1} />
        </div>
        <div className="tw-absolute tw-bottom-1 tw-right-2 tw-w-20">
          <Image src={bird2} />
        </div>

        <div className="tw-flex tw-flex-col tw-space-y-6" style={{ width: 'max-content', margin: '0 auto' }}>
          <div className="tw-flex tw-space-x-12">
            <div className="tw-flex tw-flex-col tw-items-center tw-space-y-4">
              <CoreNumber>{numerology.lifePathNumber}</CoreNumber>
              <div>ライフパス</div>
            </div>

            <div className="tw-flex tw-flex-col tw-items-center tw-space-y-4">
              <CoreNumber>{numerology.destinyNumber}</CoreNumber>
              <div>ディスティニー</div>
            </div>

            <div className="tw-flex tw-flex-col tw-items-center tw-space-y-4">
              <CoreNumber>{numerology.soulNumber}</CoreNumber>
              <div>ソウル</div>
            </div>
          </div>

          <div className="tw-flex tw-space-x-12">
            <div className="tw-flex tw-flex-col tw-items-center tw-space-y-4">
              <CoreNumber>{numerology.personalityNumber}</CoreNumber>
              <div>パーソナリティー</div>
            </div>

            <div className="tw-flex tw-flex-col tw-items-center tw-space-y-4">
              <CoreNumber>{numerology.maturityNumber}</CoreNumber>
              <div>マチュリティー</div>
            </div>

            <div className="tw-flex tw-flex-col tw-items-center tw-space-y-4">
              <CoreNumber>{numerology.birthdayNumber}</CoreNumber>
              <div>バースデー</div>
            </div>
          </div>
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
      className="tw-min-h-screen tw-pb-8 tw--mt-6"
      style={{ backgroundColor: '#EBEBC1', fontFamily: 'Lato Regular, Noto Sans JP Regular' }}
    >
      <div className="tw-w-screen-md tw-mx-auto tw-space-y-8">
        <div style={{ fontFamily: 'MTF Wildflower' }} className="tw-text-center tw-text-10xl">
          numerology
        </div>

        <NumerologyForm onSubmit={handleSubmit} />
        {numerology && <CoreNumbers numerology={numerology} />}
      </div>
    </div>
  )
}

export default NumerologyPage
