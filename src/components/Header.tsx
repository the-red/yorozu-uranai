import Link from 'next/link'
import Image from 'next/image'
import { pagesPath } from '../lib/$path'
import styles from '../styles/Home.module.css'
import horoscopeIcon from '../../public/images/index/horoscope.svg'
import numerologyIcon from '../../public/images/index/numerology.svg'

export default function Header() {
  return (
    <header className={styles.header}>
      <div className={styles.header_wrapper}>
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
                  <Image src={horoscopeIcon} width={16} height={16} alt="西洋占星術アイコン" />
                </a>
              </Link>
            </li>
            <li>
              <Link href={pagesPath.numerology.$url()}>
                <a>
                  <Image src={numerologyIcon} width={16} height={16} alt="西洋占星術アイコン" />
                </a>
              </Link>
            </li>
          </ul>
        </nav>
      </div>
    </header>
  )
}
