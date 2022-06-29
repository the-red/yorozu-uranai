import Link from 'next/link'
import { pagesPath } from '../lib/$path'
import styles from '../styles/Home.module.css'

export default function Header() {
  return (
    <header className={styles.header}>
      <div className={styles.header_wrapper}>
        <h1>よろず占い</h1>
        <nav>
          <ul>
            <li>
              <Link href={pagesPath.horoscope.$url()}>
                <a>西洋占星術</a>
              </Link>
            </li>
            <li>
              <Link href={pagesPath.numerology.$url()}>
                <a>数秘術</a>
              </Link>
            </li>
          </ul>
        </nav>
      </div>
    </header>
  )
}
