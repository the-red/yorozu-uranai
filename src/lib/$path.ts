import type { OptionalQuery as OptionalQuery_1d3p916 } from '../pages';
import type { OptionalQuery as OptionalQuery_gsr7gf } from '../pages/horoscope';
import type { OptionalQuery as OptionalQuery_5y4mrz } from '../pages/map';
import type { OptionalQuery as OptionalQuery_1wivhwu } from '../pages/numerology';
import type { OptionalQuery as OptionalQuery_1f1onws } from '../pages/suimei/saiun';
import type { OptionalQuery as OptionalQuery_134lqjr } from '../pages/suimei';

export const pagesPath = {
  'horoscope': {
    $url: (url?: { query?: OptionalQuery_gsr7gf | undefined, hash?: string | undefined } | undefined) => ({ pathname: '/horoscope' as const, query: url?.query, hash: url?.hash })
  },
  'map': {
    $url: (url?: { query?: OptionalQuery_5y4mrz | undefined, hash?: string | undefined } | undefined) => ({ pathname: '/map' as const, query: url?.query, hash: url?.hash })
  },
  'numerology': {
    $url: (url?: { query?: OptionalQuery_1wivhwu | undefined, hash?: string | undefined } | undefined) => ({ pathname: '/numerology' as const, query: url?.query, hash: url?.hash })
  },
  'suimei': {
    $url: (url?: { query?: OptionalQuery_134lqjr | undefined, hash?: string | undefined } | undefined) => ({ pathname: '/suimei' as const, query: url?.query, hash: url?.hash }),
    'saiun': {
      $url: (url?: { query?: OptionalQuery_1f1onws | undefined, hash?: string | undefined } | undefined) => ({ pathname: '/suimei/saiun' as const, query: url?.query, hash: url?.hash })
    }
  },
  $url: (url?: { query?: OptionalQuery_1d3p916 | undefined, hash?: string | undefined } | undefined) => ({ pathname: '/' as const, query: url?.query, hash: url?.hash })
};

export type PagesPath = typeof pagesPath;

export const staticPath = {
  'fonts': {
    'Farewell_Pro_Regular_ttf': '/fonts/Farewell Pro Regular.ttf',
    'Khand_Regular_ttf': '/fonts/Khand-Regular.ttf',
    'Lato_Regular_ttf': '/fonts/Lato Regular.ttf',
    'MTF_Wildflower_ttf': '/fonts/MTF Wildflower.ttf',
    'Noto_Sans_JP_Regular_woff2': '/fonts/Noto Sans JP Regular.woff2',
    'YujiSyuku_Regular_woff2': '/fonts/YujiSyuku-Regular.woff2',
    'ZenOldMincho_Bold_woff2': '/fonts/ZenOldMincho-Bold.woff2',
    'ZenOldMincho_Regular_woff2': '/fonts/ZenOldMincho-Regular.woff2'
  },
  'images': {
    'horoscope': {
      'astro_sign_01_png': '/images/horoscope/astro-sign-01.png',
      'astro_sign_02_png': '/images/horoscope/astro-sign-02.png',
      'astro_sign_03_png': '/images/horoscope/astro-sign-03.png',
      'astro_sign_04_png': '/images/horoscope/astro-sign-04.png',
      'astro_sign_05_png': '/images/horoscope/astro-sign-05.png',
      'astro_sign_06_png': '/images/horoscope/astro-sign-06.png',
      'astro_sign_07_png': '/images/horoscope/astro-sign-07.png',
      'astro_sign_08_png': '/images/horoscope/astro-sign-08.png',
      'astro_sign_09_png': '/images/horoscope/astro-sign-09.png',
      'astro_sign_10_png': '/images/horoscope/astro-sign-10.png',
      'astro_sign_11_png': '/images/horoscope/astro-sign-11.png',
      'astro_sign_12_png': '/images/horoscope/astro-sign-12.png',
      'starry_sky_jpeg': '/images/horoscope/starry-sky.jpeg'
    },
    'index': {
      'github_logo_svg': '/images/index/github-logo.svg',
      'horoscope_white_svg': '/images/index/horoscope-white.svg',
      'horoscope_svg': '/images/index/horoscope.svg',
      'logo_svg': '/images/index/logo.svg',
      'logo_mark_svg': '/images/index/logo_mark.svg',
      'numerology_svg': '/images/index/numerology.svg',
      'open_in_new_svg': '/images/index/open_in_new.svg',
      'suimei_svg': '/images/index/suimei.svg',
      'suimei_white_svg': '/images/index/suimei_white.svg',
      'x_logo_svg': '/images/index/x-logo.svg'
    },
    'map': {
      'back_blue_svg': '/images/map/back_blue.svg',
      'back_white_svg': '/images/map/back_white.svg',
      'current_location_svg': '/images/map/current_location.svg',
      'search_svg': '/images/map/search.svg'
    },
    'numerology': {
      'bird_1_svg': '/images/numerology/bird-1.svg',
      'bird_2_svg': '/images/numerology/bird-2.svg',
      'flower_svg': '/images/numerology/flower.svg',
      'leaf_svg': '/images/numerology/leaf.svg',
      'title_png': '/images/numerology/title.png'
    },
    'suimei': {
      'fun_svg': '/images/suimei/fun.svg',
      'help_svg': '/images/suimei/help.svg',
      'kintoun_svg': '/images/suimei/kintoun.svg',
      'lantern_red_svg': '/images/suimei/lantern_red.svg',
      'lantern_yellow_svg': '/images/suimei/lantern_yellow.svg',
      'logo_suimei_svg': '/images/suimei/logo_suimei.svg',
      'lotus_svg': '/images/suimei/lotus.svg',
      'peach_svg': '/images/suimei/peach.svg'
    }
  }
} as const;

export type StaticPath = typeof staticPath;
