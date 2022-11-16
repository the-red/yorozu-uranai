import Head from 'next/head'
import Link from 'next/link'
import Image from 'next/image'
import { FormEventHandler, ReactNode } from 'react'
import { pagesPath, staticPath } from '../lib/$path'
import { Query } from '../lib/params'
import SuimeiIcon from '../../public/images/index/suimei.svg'
import NumerologyIcon from '../../public/images/index/numerology.svg'
import Header from '../components/Header'
import Footer from '../components/Footer'

export type OptionalQuery = Query

export default function Home() {
  return (
    <div className="header-and-body">
      <Head>
        <title>よろず占い</title>
        <meta name="description" content="Fortune Telling" />
        <link rel="icon" href={staticPath.images.index.logo_svg} />
      </Head>

      <Header />

      <main className="main">
        <div className="menu-outer-container">
          {/* TODO: スマホ対応する */}
          <div className="tw-hidden sm:tw-block">
            <div className="tw-flex tw-justify-center tw-mb-20">
              <TopPageForm />
            </div>
          </div>

          <div className="menu-container">
            <div className="menu menu-horoscope">
              <Link href={pagesPath.horoscope.$url()}>
                <a className="menu-link">
                  <div className="menu-link-block-1">
                    <h2 className="menu-title">西洋占星術</h2>
                    {/* TODO: horoscopeIcon はコンポーネントとして表示すると何故か消えるのでなんとかする */}
                    <Image src={staticPath.images.index.horoscope_svg} width={40} height={40} alt="西洋占星術" />
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
            <div className="menu menu-suimei coming-soon">
              <a className="menu-link">
                <div className="menu-link-block-1">
                  <h2 className="menu-title">四柱推命</h2>
                  <SuimeiIcon width={40} height={40} alt="四柱推命" />
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

type TopPageFormProps = {}

const TopPageForm = (props: TopPageFormProps) => {
  const handleSubmit: FormEventHandler = (e) => {
    e.preventDefault()
  }

  const Label = ({ children }: { children: ReactNode }) => {
    return <label className="tw-space-y-1 tw-w-280px">{children}</label>
  }

  const WrappedHoroscopeIcon = () => (
    <Image src={staticPath.images.index.horoscope_svg} width="16" height="16" alt="西洋占星術" />
  )

  const WrappedNumerologyIcon = () => <NumerologyIcon width="16" height="16" alt="数秘術" />

  const WrappedSuimeiIcon = () => <SuimeiIcon width="18" height="18" alt="四柱推命" />

  return (
    <form className="tw-space-y-10 tw-w-680px" onSubmit={handleSubmit}>
      <div className="tw-flex">
        <Label>
          <div>生年月日</div>
          <div className="tw-space-x-1">
            <WrappedHoroscopeIcon />
            <WrappedNumerologyIcon />
            <WrappedSuimeiIcon />
          </div>
        </Label>

        <div className="tw-space-y-4">
          <input type="date" />
          <div className="tw-flex tw-space-x-2">
            <input type="number" min="0" max="23" className="tw-w-50px" />
            <div>時</div>
            <input type="number" min="0" max="59" className="tw-w-50px" />
            <div>分</div>
            <div>(JST)</div>
          </div>
          <div className="tw-flex tw-space-x-2">
            <input id="time_unknown" type="checkbox" />
            <label htmlFor="time_unknown">時刻不明</label>
          </div>
        </div>
      </div>
      <hr />

      <div className="tw-flex">
        <Label>
          <div>出生場所</div>
          <div className="tw-space-x-1">
            <WrappedHoroscopeIcon />
            <WrappedSuimeiIcon />
          </div>
        </Label>

        <div className="tw-self-start tw-flex tw-space-x-4">
          <div className="tw-flex tw-space-x-2">
            <div>緯度</div>
            <input type="number" min="-90" max="90" step="0.0001" className="tw-w-120px" />
          </div>

          <div className="tw-flex tw-space-x-2">
            <div>経度</div>
            <input type="number" min="-180" max="180" step="0.0001" className="tw-w-120px" />
          </div>
        </div>
      </div>
      <hr />

      <div className="tw-flex">
        <Label>
          <div>名前</div>
          <div>
            <WrappedNumerologyIcon />
          </div>
        </Label>

        <div>
          <input type="text" />
          <div className="tw-text-gray-500 tw-text-sm">*ひらがなかローマ字で入力してください</div>
          <div>funadayu</div>
        </div>
      </div>
      <hr />
    </form>
  )
}
