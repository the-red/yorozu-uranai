import 'windi.css'
import '../styles/globals.css'
import '../styles/horoscope.css'
import '../styles/numerology.css'
import '../styles/suimei.scss'
import '../styles/map.scss'
import type { AppProps } from 'next/app'
import { googleTagManagerId } from '../lib/gtm'
import GoogleTagManager, { GoogleTagManagerId } from '../components/GoogleTagManager'

function MyApp({ Component, pageProps }: AppProps) {
  return (
    <>
      <GoogleTagManager googleTagManagerId={googleTagManagerId as GoogleTagManagerId} />
      <Component {...pageProps} />
    </>
  )
}

export default MyApp
