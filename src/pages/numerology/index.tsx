import { NextPage } from 'next'
import { FC, FormEventHandler, useState, VFC } from 'react'
import { Numerology } from '../../numerology/Numerology'

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

      <div className="tw-bg-white tw-p-8 tw-rounded-bl-3xl tw-rounded-tr-3xl tw-border-2 tw-border-solid">
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
    <div style={{ width: '200px', padding: '16px', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
      {children}
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
      <div className="tw-bg-white tw-p-8 tw-rounded-bl-3xl tw-rounded-tr-3xl tw-border-2 tw-border-solid">
        <div style={{ width: 'max-content', margin: '0 auto' }}>
          <div style={{ display: 'flex' }}>
            <CoreNumber>
              <div>{numerology.lifePathNumber}</div>
              <div>ライフパス</div>
            </CoreNumber>

            <CoreNumber>
              <div>{numerology.destinyNumber}</div>
              <div>ディスティニー</div>
            </CoreNumber>

            <CoreNumber>
              <div>{numerology.soulNumber}</div>
              <div>ソウル</div>
            </CoreNumber>
          </div>

          <div style={{ display: 'flex' }}>
            <CoreNumber>
              <div>{numerology.personalityNumber}</div>
              <div>パーソナリティー</div>
            </CoreNumber>

            <CoreNumber>
              <div>{numerology.maturityNumber}</div>
              <div>マチュリティー</div>
            </CoreNumber>

            <CoreNumber>
              <div>{numerology.birthdayNumber}</div>
              <div>バースデー</div>
            </CoreNumber>
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
    <div className="tw-min-h-screen" style={{ backgroundColor: '#EBEBC1' }}>
      <div className="tw-w-screen-md tw-mx-auto tw-space-y-8">
        <div style={{ fontSize: '60px', textAlign: 'center' }}>Numerology</div>
        <NumerologyForm onSubmit={handleSubmit} />
        {numerology && <CoreNumbers numerology={numerology} />}
      </div>
    </div>
  )
}

export default NumerologyPage
