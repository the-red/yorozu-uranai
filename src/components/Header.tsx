import Link from 'next/link'
import Image from 'next/image'
import { pagesPath } from '../lib/$path'
// @ts-expect-error
import horoscopeIcon from '../../public/images/index/horoscope.svg?url'
import NumerologyIcon from '../../public/images/index/numerology.svg'

export default function Header() {
  return (
    <header className="header">
      <div className="header_wrapper">
        <h1>
          <Link href={pagesPath.$url()}>
            <a>よろず占い</a>
          </Link>
        </h1>
        <nav>
          <ul>
            <li>
              <Link href={pagesPath.horoscope.$url()}>
                <a>
                  {/* TODO: horoscopeIcon はコンポーネントとして表示すると何故か消えるのでなんとかする */}
                  <Image src={horoscopeIcon} className="icon" width={16} height={16} alt="西洋占星術アイコン" />
                </a>
              </Link>
            </li>
            <li>
              <Link href={pagesPath.numerology.$url()}>
                <a>
                  <NumerologyIcon className="icon" width={16} height={16} alt="数秘術アイコン" />
                </a>
              </Link>
            </li>
          </ul>
        </nav>
      </div>
    </header>
  )
}
