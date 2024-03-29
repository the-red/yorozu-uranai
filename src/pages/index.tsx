import Head from 'next/head'
import Link from 'next/link'
import Image from 'next/image'
import { pagesPath, staticPath } from '../lib/$path'
import { Query } from '../lib/params'
import SuimeiIcon from '../../public/images/index/suimei.svg'
import NumerologyIcon from '../../public/images/index/numerology.svg'
import Header from '../components/Header'
import Footer from '../components/Footer'
import Menu from '../components/Menu'

export type OptionalQuery = Query

export default function Home() {
  return (
    <div className="header-and-body">
      <Head>
        <title>よろず占い</title>
        <meta
          name="description"
          content="西洋占星術のホロスコープ、四柱推命の命式、数秘術のパーソナルチャートを無料で作成できます。"
        />
        <link rel="icon" href={staticPath.images.index.logo_mark_svg} />
      </Head>

      <Menu />

      <Header />

      <main className="main">
        <div className="menu-outer-container">
          <div className="menu-container">
            <div className="menu menu-horoscope">
              <Link href={pagesPath.horoscope.$url()}>
                <div className="menu-link">
                  <div className="menu-link-block-1">
                    <h2 className="menu-title">西洋占星術</h2>
                    {/* TODO: horoscopeIcon はコンポーネントとして表示すると何故か消えるのでなんとかする */}
                    <Image src={staticPath.images.index.horoscope_svg} width={40} height={40} alt="西洋占星術" />
                    <p className="menu-text">ホロスコープを作成する</p>
                  </div>
                </div>
              </Link>
            </div>
            <div className="menu menu-numerology">
              <Link href={pagesPath.numerology.$url()}>
                <div className="menu-link">
                  <div className="menu-link-block-1">
                    <h2 className="menu-title">数秘術</h2>
                    <NumerologyIcon width={40} height={40} alt="数秘術" />
                    <p className="menu-text">数字を計算する</p>
                  </div>
                </div>
              </Link>
            </div>
            <div className="menu menu-suimei">
              <Link href={pagesPath.suimei.$url()}>
                <div className="menu-link">
                  <div className="menu-link-block-1">
                    <h2 className="menu-title">四柱推命</h2>
                    <SuimeiIcon width={40} height={40} alt="四柱推命" />
                    <p className="menu-text">命式を計算する</p>
                  </div>
                </div>
              </Link>
            </div>
          </div>
        </div>
      </main>
      <div className="footer-spacer"></div>
      <Footer />
    </div>
  )
}
