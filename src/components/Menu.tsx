import React, { useState } from 'react'
import { slide as Burger } from 'react-burger-menu'
import Link from 'next/link'
import { pagesPath } from '../lib/$path'
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
  type Icon = 'horoscope' | 'numerology' | 'suimei'
  const SideBarLink = ({ path, icon, children }: { path: PathpidaValue; icon?: Icon; children: string }) => (
    <Link href={path.$url({ query })} onClick={closeSideBar}>
      {/* アイコンが無い項目も、ラベルの位置を揃えるために同じ幅を空けておく */}
      <span className={`bm-icon bm-icon-${icon ?? 'none'}`} aria-hidden="true" />
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
          <SideBarLink path={pagesPath.horoscope} icon="horoscope">
            西洋占星術
          </SideBarLink>
        </li>
        <li>
          <SideBarLink path={pagesPath.numerology} icon="numerology">
            数秘術
          </SideBarLink>
        </li>
        <li>
          <SideBarLink path={pagesPath.suimei} icon="suimei">
            四柱推命
          </SideBarLink>
        </li>
      </ul>
    </Burger>
  )
}
