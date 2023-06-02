import { Fragment } from 'react'

// 文字列配列を <br /> で区切るコンポーネント
const StringArrayWithBreaks = ({ strings }: { strings: string[] }) => (
  <>
    {strings.map((str, index) => {
      if (index === 0)
        return (
          <Fragment key={index}>
            <span>{str}</span>
          </Fragment>
        )
      return (
        <Fragment key={index}>
          <br />
          <span>{str}</span>
        </Fragment>
      )
    })}
  </>
)

export default StringArrayWithBreaks
