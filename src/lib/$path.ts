import type { OptionalQuery as OptionalQuery0 } from '../pages'
import type { OptionalQuery as OptionalQuery1 } from '../pages/horoscope'
import type { OptionalQuery as OptionalQuery2 } from '../pages/numerology'
import type { OptionalQuery as OptionalQuery3 } from '../pages/suimei'

export const pagesPath = {
  "horoscope": {
    $url: (url?: { query?: OptionalQuery1, hash?: string }) => ({ pathname: '/horoscope' as const, query: url?.query, hash: url?.hash })
  },
  "map": {
    $url: (url?: { hash?: string }) => ({ pathname: '/map' as const, hash: url?.hash })
  },
  "numerology": {
    $url: (url?: { query?: OptionalQuery2, hash?: string }) => ({ pathname: '/numerology' as const, query: url?.query, hash: url?.hash })
  },
  "suimei": {
    $url: (url?: { query?: OptionalQuery3, hash?: string }) => ({ pathname: '/suimei' as const, query: url?.query, hash: url?.hash })
  },
  $url: (url?: { query?: OptionalQuery0, hash?: string }) => ({ pathname: '/' as const, query: url?.query, hash: url?.hash })
}

export type PagesPath = typeof pagesPath

export const staticPath = {
  fonts: {
    $001Shirokuma_Regular_otf: '/fonts/001Shirokuma-Regular.otf',
    Farewell_Pro_Regular_ttf: '/fonts/Farewell Pro Regular.ttf',
    Khand_Regular_ttf: '/fonts/Khand-Regular.ttf',
    Lato_Regular_ttf: '/fonts/Lato Regular.ttf',
    MTF_Wildflower_ttf: '/fonts/MTF Wildflower.ttf',
    Noto_Sans_JP_Regular_otf: '/fonts/Noto Sans JP Regular.otf'
  },
  images: {
    horoscope: {
      astro_sign_01_png: '/images/horoscope/astro-sign-01.png',
      astro_sign_02_png: '/images/horoscope/astro-sign-02.png',
      astro_sign_03_png: '/images/horoscope/astro-sign-03.png',
      astro_sign_04_png: '/images/horoscope/astro-sign-04.png',
      astro_sign_05_png: '/images/horoscope/astro-sign-05.png',
      astro_sign_06_png: '/images/horoscope/astro-sign-06.png',
      astro_sign_07_png: '/images/horoscope/astro-sign-07.png',
      astro_sign_08_png: '/images/horoscope/astro-sign-08.png',
      astro_sign_09_png: '/images/horoscope/astro-sign-09.png',
      astro_sign_10_png: '/images/horoscope/astro-sign-10.png',
      astro_sign_11_png: '/images/horoscope/astro-sign-11.png',
      astro_sign_12_png: '/images/horoscope/astro-sign-12.png',
      starry_sky_jpeg: '/images/horoscope/starry-sky.jpeg'
    },
    index: {
      horoscope_white_svg: '/images/index/horoscope-white.svg',
      horoscope_svg: '/images/index/horoscope.svg',
      logo_png: '/images/index/logo.png',
      logo_svg: '/images/index/logo.svg',
      logo_white_png: '/images/index/logo_white.png',
      numerology_svg: '/images/index/numerology.svg',
      suimei_svg: '/images/index/suimei.svg',
      twitter_logo_svg: '/images/index/twitter-logo.svg'
    },
    numerology: {
      bird_1_png: '/images/numerology/bird-1.png',
      bird_2_png: '/images/numerology/bird-2.png',
      flower_png: '/images/numerology/flower.png',
      leaf_png: '/images/numerology/leaf.png',
      title_png: '/images/numerology/title.png'
    }
  },
  map_test: {
    index_html: '/map-test/index.html',
    index_js: '/map-test/index.js',
    style_css: '/map-test/style.css'
  }
} as const

export type StaticPath = typeof staticPath
