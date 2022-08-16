import type { OptionalQuery as OptionalQuery0 } from '../pages'
import type { OptionalQuery as OptionalQuery1 } from '../pages/horoscope'
import type { OptionalQuery as OptionalQuery2 } from '../pages/numerology'
import type { OptionalQuery as OptionalQuery3 } from '../pages/suimei'

export const pagesPath = {
  "horoscope": {
    $url: (url?: { query?: OptionalQuery1, hash?: string }) => ({ pathname: '/horoscope' as const, query: url?.query, hash: url?.hash }),

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
    astro_sign_1_png: '/images/astro-sign-1.png',
    astro_sign_10_png: '/images/astro-sign-10.png',
    astro_sign_11_png: '/images/astro-sign-11.png',
    astro_sign_12_png: '/images/astro-sign-12.png',
    astro_sign_2_png: '/images/astro-sign-2.png',
    astro_sign_3_png: '/images/astro-sign-3.png',
    astro_sign_4_png: '/images/astro-sign-4.png',
    astro_sign_5_png: '/images/astro-sign-5.png',
    astro_sign_6_png: '/images/astro-sign-6.png',
    astro_sign_7_png: '/images/astro-sign-7.png',
    astro_sign_8_png: '/images/astro-sign-8.png',
    astro_sign_9_png: '/images/astro-sign-9.png',
    index: {
      horoscope_white_svg: '/images/index/horoscope-white.svg',
      horoscope_svg: '/images/index/horoscope.svg',
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
    },
    starry_sky_jpeg: '/images/starry-sky.jpeg'
  }
} as const

export type StaticPath = typeof staticPath
