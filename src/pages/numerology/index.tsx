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
      <div style={{ fontWeight: 'bold', fontSize: '20px', textAlign: 'center', marginBottom: '32px' }}>情報入力</div>

      <form onSubmit={handleSubmit}>
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

        <button type="submit" style={{ marginLeft: '200px', width: '200px', padding: '8px' }}>
          計算する
        </button>
      </form>
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
      <div style={{ fontWeight: 'bold', fontSize: '20px', textAlign: 'center', marginBottom: '32px' }}>
        コアナンバー
      </div>

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
  )
}

const NumerologyPage: NextPage = () => {
  const [numerology, setNumerology] = useState<Numerology>()

  const handleSubmit: NumerologyFormProps['onSubmit'] = ({ birthday, name }) => {
    setNumerology(new Numerology({ birthDate: birthday, fullName: name, maxSameNumber: 22 }))
  }

  return (
    <div style={{ width: '720px', margin: '0 auto', padding: '20px 0' }}>
      <div style={{ fontSize: '60px', textAlign: 'center', marginBottom: '20px' }}>Numerology</div>

      <div style={{ width: '480px', margin: '0 auto 80px' }}>
        <NumerologyForm onSubmit={handleSubmit} />
      </div>

      {numerology && <CoreNumbers numerology={numerology} />}
    </div>
  )
}

export default NumerologyPage
