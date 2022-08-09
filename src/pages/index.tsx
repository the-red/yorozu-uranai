import Head from 'next/head'
import Link from 'next/link'
import Image from 'next/image'
import styles from '../styles/Home.module.css'
import { pagesPath } from '../lib/$path'
import FourPillarsOfDestinyIcon from '../../public/images/index/four-pillars-of-destiny.svg'
// @ts-expect-error
import horoscopeIcon from '../../public/images/index/horoscope.svg?url'
import NumerologyIcon from '../../public/images/index/numerology.svg'
import Header from '../components/Header'
import Footer from '../components/Footer'

export default function Home() {
  return (
    <div className={styles['header-and-body']}>
      <Head>
        <title>よろず占い</title>
        <meta name="description" content="Fortune Telling" />
        {/* TODO:アイコンは別途設定する */}
        {/* <link rel="icon" href="/favicon.ico" /> */}
      </Head>

      <Header />

      <main className={styles.main}>
        <div className={styles['menu-outer-container']}>
          <div className={styles['menu-container']}>
            <div className={`${styles.menu} ${styles['menu-horoscope']}`}>
              <Link href={pagesPath.horoscope.$url()}>
                <a className={styles['menu-link']}>
                  <div className={styles['menu-link-block-1']}>
                    <h2 className={styles['menu-title']}>西洋占星術</h2>
                    {/* TODO: horoscopeIcon はコンポーネントとして表示すると何故か消えるのでなんとかする */}
                    <Image src={horoscopeIcon} width={40} height={40} alt="西洋占星術アイコン" />
                    <p className={styles['menu-text']}>ホロスコープを作成する</p>
                  </div>
                </a>
              </Link>
            </div>
            <div className={`${styles.menu} ${styles['menu-numerology']}`}>
              <Link href={pagesPath.numerology.$url()}>
                <a className={styles['menu-link']}>
                  <div className={styles['menu-link-block-1']}>
                    <h2 className={styles['menu-title']}>数秘術</h2>
                    <NumerologyIcon width={40} height={40} alt="数秘術アイコン" />
                    <p className={styles['menu-text']}>数字を計算する</p>
                  </div>
                </a>
              </Link>
            </div>
            <div className={`${styles.menu} ${styles['menu-four-pillars-of-destiny']} ${styles['coming-soon']}`}>
              <a className={styles['menu-link']}>
                <div className={styles['menu-link-block-1']}>
                  <h2 className={styles['menu-title']}>四柱推命</h2>
                  <FourPillarsOfDestinyIcon width={40} height={40} alt="四柱推命アイコン" />
                  <p className={styles['menu-text']}>命式を計算する</p>
                </div>
              </a>
            </div>
          </div>
        </div>
      </main>
      <div className={styles['footer-spacer']}></div>
      <Footer />
    </div>
  )
}
