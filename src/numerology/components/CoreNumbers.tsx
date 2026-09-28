import { FC, ReactNode } from 'react'
import { Numerology } from '../models/Numerology'

const CoreNumber: FC<{ children: ReactNode }> = ({ children }) => {
  return (
    <div className="core_number">
      <div className="core_number_inner_position">
        <div className="core_number_inner" />
      </div>

      <div className="core_number_value_position">
        <div className="core_number_value">{children}</div>
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
