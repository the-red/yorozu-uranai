/* eslint-disable */
// prettier-ignore
export const pagesPath = {
  env_vars: {
    $url: (url?: { hash?: string }) => ({ pathname: '/env-vars' as const, hash: url?.hash })
  },
  horoscope: {
    $url: (url?: { hash?: string }) => ({ pathname: '/horoscope' as const, hash: url?.hash })
  },
  numerology: {
    $url: (url?: { hash?: string }) => ({ pathname: '/numerology' as const, hash: url?.hash })
  },
  $url: (url?: { hash?: string }) => ({ pathname: '/' as const, hash: url?.hash })
}

// prettier-ignore
export type PagesPath = typeof pagesPath
