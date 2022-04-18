import Head from 'next/head'
import Link from 'next/link'
import styles from '../styles/Home.module.css'
import { pagesPath } from '../lib/$path'

export default function Home() {
  return (
    <div className={styles.container}>
      <Head>
        <title>Fortune Telling</title>
        <meta name="description" content="Fortune Telling" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <main className={styles.main}>
        <h1 className={styles.title}>🔮 Fortune Telling</h1>

        <p className={styles.description}>
          Get started by editing <code className={styles.code}>pages/index.js</code>
        </p>

        <div className={styles.grid}>
          <Link href={pagesPath.horoscope.$url()}>
            <a className={styles.card}>
              <h2>Horoscope &rarr;</h2>
              <p>西洋占星術</p>
            </a>
          </Link>

          <Link href={pagesPath.numerology.$url()}>
            <a className={styles.card}>
              <h2>Numerology &rarr;</h2>
              <p>数秘術</p>
            </a>
          </Link>
        </div>
      </main>

      <footer className={styles.footer}>
        <a href="https://www.sonicgarden.jp" target="_blank" rel="noopener noreferrer">
          Copyright © SonicGarden All rights reserved.
        </a>
      </footer>
    </div>
  )
}
