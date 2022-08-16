/* eslint-disable */
// prettier-ignore
import { OptionalQuery as OptionalQuery0 } from '../pages'
// prettier-ignore
import { OptionalQuery as OptionalQuery1 } from '../pages/horoscope'
// prettier-ignore
import { OptionalQuery as OptionalQuery2 } from '../pages/numerology'
// prettier-ignore
import { OptionalQuery as OptionalQuery3 } from '../pages/suimei'

// prettier-ignore
export const pagesPath = {
  horoscope: {
    $url: (url?: { query?: OptionalQuery1, hash?: string }) => ({ pathname: '/horoscope' as const, query: url?.query, hash: url?.hash }),

  },
  numerology: {
    $url: (url?: { query?: OptionalQuery2, hash?: string }) => ({ pathname: '/numerology' as const, query: url?.query, hash: url?.hash })
  },
  suimei: {
    $url: (url?: { query?: OptionalQuery3, hash?: string }) => ({ pathname: '/suimei' as const, query: url?.query, hash: url?.hash })
  },
  $url: (url?: { query?: OptionalQuery0, hash?: string }) => ({ pathname: '/' as const, query: url?.query, hash: url?.hash })
}

// prettier-ignore
export type PagesPath = typeof pagesPath
