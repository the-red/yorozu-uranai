import Head from 'next/head'
import Link from 'next/link'
import Image from 'next/image'
import styles from '../styles/Home.module.css'
import { pagesPath } from '../lib/$path'
import fourPillarsOfDestinyIcon from '../../public/images/index/four-pillars-of-destiny.svg'
import horoscopeIcon from '../../public/images/index/horoscope.svg'
import numerologyIcon from '../../public/images/index/numerology.svg'

export default function Home() {
  return (
    <div>
      <Head>
        <title>よろず占い</title>
        <meta name="description" content="Fortune Telling" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <header className={styles.header}>
        <h1 className={styles.title}>よろず占い</h1>
      </header>
      <main className={styles.main}>
        <div className={styles.menu}>
          <Link href={pagesPath.horoscope.$url()}>
            <a className={styles['menu-link']}>
              <div></div>
              <div>
                <h2 className={styles['menu-title']}>西洋占星術</h2>
                <Image src={horoscopeIcon} width={40} height={40} alt="西洋占星術アイコン" />
                <p className={styles['menu-text']}>ホロスコープを作成する</p>
              </div>
              <div></div>
            </a>
          </Link>
        </div>
        <div className={styles.menu}>
          <Link href={pagesPath.numerology.$url()}>
            <a>
              <h2 className={styles['menu-title']}>数秘術</h2>
              <Image src={numerologyIcon} width={40} height={40} alt="数秘術アイコン" />
              <p className={styles['menu-text']}>数字を計算する</p>
            </a>
          </Link>
        </div>
        <div className={styles.menu}>
          <Link href={pagesPath.numerology.$url()}>
            <a>
              <h2 className={styles['menu-title']}>四柱推命</h2>
              <Image src={fourPillarsOfDestinyIcon} width={46} height={53} alt="西洋占星術アイコン" />
              <p className={styles['menu-text']}>命式を計算する</p>
            </a>
          </Link>
        </div>
      </main>

      <footer>
        <a href="https://www.sonicgarden.jp" target="_blank" rel="noopener noreferrer">
          Copyright © SonicGarden All rights reserved.
        </a>
      </footer>
    </div>
  )
}
