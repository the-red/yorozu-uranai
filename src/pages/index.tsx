import Head from 'next/head'
import Link from 'next/link'
import Image from 'next/image'
import { pagesPath } from '../lib/$path'
import FourPillarsOfDestinyIcon from '../../public/images/index/four-pillars-of-destiny.svg'
// @ts-expect-error
import horoscopeIcon from '../../public/images/index/horoscope.svg?url'
import NumerologyIcon from '../../public/images/index/numerology.svg'
import Header from '../components/Header'
import Footer from '../components/Footer'

export default function Home() {
  return (
    <div className="header-and-body">
      <Head>
        <title>よろず占い</title>
        <meta name="description" content="Fortune Telling" />
        {/* TODO:アイコンは別途設定する */}
        {/* <link rel="icon" href="/favicon.ico" /> */}
      </Head>

      <Header />

      <main className="main">
        <div className="menu-outer-container">
          <div className="menu-container">
            <div className="menu menu-horoscope">
              <Link href={pagesPath.horoscope.$url()}>
                <a className="menu-link">
                  <div className="menu-link-block-1">
                    <h2 className="menu-title">西洋占星術</h2>
                    {/* TODO: horoscopeIcon はコンポーネントとして表示すると何故か消えるのでなんとかする */}
                    <Image src={horoscopeIcon} width={40} height={40} alt="西洋占星術" />
                    <p className="menu-text">ホロスコープを作成する</p>
                  </div>
                </a>
              </Link>
            </div>
            <div className="menu menu-numerology">
              <Link href={pagesPath.numerology.$url()}>
                <a className="menu-link">
                  <div className="menu-link-block-1">
                    <h2 className="menu-title">数秘術</h2>
                    <NumerologyIcon width={40} height={40} alt="数秘術" />
                    <p className="menu-text">数字を計算する</p>
                  </div>
                </a>
              </Link>
            </div>
            <div className="menu menu-four-pillars-of-destiny coming-soon">
              <a className="menu-link">
                <div className="menu-link-block-1">
                  <h2 className="menu-title">四柱推命</h2>
                  <FourPillarsOfDestinyIcon width={40} height={40} alt="四柱推命" />
                  <p className="menu-text">命式を計算する</p>
                </div>
              </a>
            </div>
          </div>
        </div>
      </main>
      <div className="footer-spacer"></div>
      <Footer />
    </div>
  )
}
