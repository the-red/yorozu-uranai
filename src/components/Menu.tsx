import React, { useState } from 'react'
import { slide as Burger } from 'react-burger-menu'
import Link from 'next/link'
import { pagesPath, staticPath } from '../lib/$path'
import type { PathpidaValue } from '../lib/$path.types'
import { useRouter } from 'next/router'

export default function Menu() {
  const { query } = useRouter()

  const [isOpen, setOpen] = useState(false)
  const handleIsOpen = () => {
    setOpen(!isOpen)
  }
  const closeSideBar = () => {
    setOpen(false)
  }
  const SideBarLink = ({ path, children }: { path: PathpidaValue; children: string }) => (
    <Link href={path.$url({ query })} onClick={closeSideBar}>
      {children}
    </Link>
  )

  return (
    <Burger right width={'100%'} isOpen={isOpen} onOpen={handleIsOpen} onClose={handleIsOpen}>
      <ul>
        <li>
          <SideBarLink path={pagesPath}>HOME</SideBarLink>
        </li>
        <li>
          <SideBarLink path={pagesPath.horoscope}>西洋占星術</SideBarLink>
        </li>
        <li>
          <SideBarLink path={pagesPath.numerology}>数秘術</SideBarLink>
        </li>
        <li>
          <SideBarLink path={pagesPath.suimei}>四柱推命</SideBarLink>
        </li>
      </ul>
    </Burger>
  )
}
