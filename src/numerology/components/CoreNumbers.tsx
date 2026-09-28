import { FC, ReactNode } from 'react'
import { Numerology } from '../models/Numerology'

const CoreNumber: FC<{ children: ReactNode }> = ({ children }) => {
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
        <div className="core_number_value" style={{ color: '#9A8EB6' }}>
          {children}
        </div>
      </div>
    </div>
  )
}

const CoreNumberItem: FC<{ children: ReactNode }> = ({ children }) => {
  return <div className="core_number_item">{children}</div>
}

type CoreNumbersProps = {
  numerology: Numerology
}

export const CoreNumbers: FC<CoreNumbersProps> = ({ numerology }) => {
  return (
    <div>
      <div className="section_title">コアナンバー</div>

      <div className="card core_numbers_outer">
        <div className="core_numbers">
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
