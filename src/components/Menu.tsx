import React from 'react'
import { slide as Burger } from 'react-burger-menu'
import Link from 'next/link'
import { pagesPath, staticPath } from '../lib/$path'
import { useRouter } from 'next/router'

export default function Menu() {
  const { query } = useRouter()

  return (
    <Burger right width={'100%'}>
      <ul>
        <li>
          <Link href={pagesPath.$url({ query })}>
            <a>HOME</a>
          </Link>
        </li>
        <li>
          <Link href={pagesPath.horoscope.$url({ query })}>
            <a>西洋占星術</a>
          </Link>
        </li>
        <li>
          <Link href={pagesPath.numerology.$url({ query })}>
            <a>数秘術</a>
          </Link>
        </li>
      </ul>
    </Burger>
  )
}
