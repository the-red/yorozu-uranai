import type { Planet as PlanetClass } from '../horoscope'
type Planet = ReturnType<PlanetClass['toJSON']>

type Props = {
  planets: Planet[]
}

export default function SignTable({ planets }: Props) {
  const makeElementSingleSentence = (type: 'fire' | 'earth' | 'air' | 'water') =>
    makeSignSingleSentence(type, 'element')
  const makeQualitySingleSentence = (type: 'cardinal' | 'fixed' | 'mutable') => makeSignSingleSentence(type, 'quality')
  const makePolaritySingleSentence = (type: 'masculine' | 'feminine') => makeSignSingleSentence(type, 'polarity')

  const makeSignSingleSentence = (type: string, key: 'element' | 'quality' | 'polarity') => {
    return planets
      .filter((planet) => planet[key] === type)
      .map((planet) => planet.name)
      .join(' ')
  }

  return (
    <div style={{ width: '100%' }}>
      <div style={{ fontSize: '30px' }}>Sign Classification</div>
      <table style={{ width: '100%' }}>
        <tbody>
          {/* ４区分 */}
          <tr>
            <td>火　　</td>
            <td>{makeElementSingleSentence('fire')}</td>
          </tr>
          <tr>
            <td>土　　</td>
            <td>{makeElementSingleSentence('earth')}</td>
          </tr>
          <tr>
            <td>風　　</td>
            <td>{makeElementSingleSentence('air')}</td>
          </tr>
          <tr>
            <td>水　　</td>
            <td>{makeElementSingleSentence('water')}</td>
          </tr>

          {/* ３区分 */}
          <tr>
            <td>活動宮</td>
            <td>{makeQualitySingleSentence('cardinal')}</td>
          </tr>
          <tr>
            <td>不動宮</td>
            <td>{makeQualitySingleSentence('fixed')}</td>
          </tr>
          <tr>
            <td>柔軟宮</td>
            <td>{makeQualitySingleSentence('mutable')}</td>
          </tr>

          {/* ２区分 */}
          <tr>
            <td>男性宮</td>
            <td>{makePolaritySingleSentence('masculine')}</td>
          </tr>
          <tr>
            <td>女性宮</td>
            <td>{makePolaritySingleSentence('feminine')}</td>
          </tr>
        </tbody>
      </table>
    </div>
  )
}
