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
      <header>
        <h1>よろず占い</h1>
      </header>
      <main>
        <div>
          <Link href={pagesPath.horoscope.$url()}>
            <a>
              <h2>西洋占星術</h2>
              <Image src={horoscopeIcon} />
              <p>ホロスコープを作成する</p>
            </a>
          </Link>

          <Link href={pagesPath.numerology.$url()}>
            <a>
              <h2>数秘術</h2>
              <Image src={numerologyIcon} />
              <p>数字を計算する</p>
            </a>
          </Link>

          <Link href={pagesPath.numerology.$url()}>
            <a>
              <h2>四柱推命</h2>
              <Image src={fourPillarsOfDestinyIcon} />
              <p>命式を計算する</p>
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
