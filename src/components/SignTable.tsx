import { Planet, PLANET_NAMES_JA } from '../horoscope'
import styles from '../pages/horoscope/HoroscopePage.module.css'

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
      .map((planet) => PLANET_NAMES_JA[planet.name])
      .join(' / ')
  }

  return (
    <div style={{ width: '100%' }}>
      <div style={{ fontSize: '30px' }}>Sign Classification</div>
      {/* ４区分 */}
      <table className={styles['sign-classification-list']}>
        <tbody>
          <tr>
            <td className={styles['sign-classification-list-item']}>火</td>
            <td className={styles['sign-classification-list-value']}>{makeElementSingleSentence('fire')}</td>
          </tr>
          <tr>
            <td className={styles['sign-classification-list-item']}>土</td>
            <td className={styles['sign-classification-list-value']}>{makeElementSingleSentence('earth')}</td>
          </tr>
          <tr>
            <td className={styles['sign-classification-list-item']}>風</td>
            <td className={styles['sign-classification-list-value']}>{makeElementSingleSentence('air')}</td>
          </tr>
          <tr>
            <td className={styles['sign-classification-list-item']}>水</td>
            <td className={styles['sign-classification-list-value']}>{makeElementSingleSentence('water')}</td>
          </tr>
        </tbody>
      </table>
      {/* ３区分 */}
      <table className={styles['sign-classification-list']}>
        <tbody>
          <tr>
            <td className={styles['sign-classification-list-item']}>活動宮</td>
            <td className={styles['sign-classification-list-value']}>{makeQualitySingleSentence('cardinal')}</td>
          </tr>
          <tr>
            <td className={styles['sign-classification-list-item']}>不動宮</td>
            <td className={styles['sign-classification-list-value']}>{makeQualitySingleSentence('fixed')}</td>
          </tr>
          <tr>
            <td className={styles['sign-classification-list-item']}>柔軟宮</td>
            <td className={styles['sign-classification-list-value']}>{makeQualitySingleSentence('mutable')}</td>
          </tr>
        </tbody>
      </table>
      {/* ２区分 */}
      <table className={styles['sign-classification-list']}>
        <tbody>
          <tr>
            <td className={styles['sign-classification-list-item']}>男性宮</td>
            <td className={styles['sign-classification-list-value']}>{makePolaritySingleSentence('masculine')}</td>
          </tr>
          <tr>
            <td className={styles['sign-classification-list-item']}>女性宮</td>
            <td className={styles['sign-classification-list-value']}>{makePolaritySingleSentence('feminine')}</td>
          </tr>
        </tbody>
      </table>
    </div>
  )
}
