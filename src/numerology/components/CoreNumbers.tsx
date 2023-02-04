import Image from 'next/image'
import { FC, ReactNode } from 'react'
import { Numerology } from '../Numerology'

import bird1 from '../../../public/images/numerology/bird-1.png'
import bird2 from '../../../public/images/numerology/bird-2.png'

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
        <div className="tw-text-5xl tw-font-thin" style={{ color: '#9A8EB6' }}>
          {children}
        </div>
      </div>
    </div>
  )
}

const CoreNumberItem: FC<{ children: ReactNode }> = ({ children }) => {
  return <div className="tw-flex tw-flex-col tw-items-center tw-space-y-4">{children}</div>
}

type CoreNumbersProps = {
  numerology: Numerology
}

export const CoreNumbers: FC<CoreNumbersProps> = ({ numerology }) => {
  return (
    <div>
      <div className="tw-text-center tw-text-lg sm:tw-text-xl tw-mb-2">コアナンバー</div>

      <div className="tw-relative tw-bg-white tw-p-8 tw-rounded-tl-2xl tw-rounded-tr-5xl tw-rounded-br-2xl tw-rounded-bl-5xl tw-border-2 tw-border-solid core_numbers_outer">
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
