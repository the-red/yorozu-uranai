import React, { useState } from 'react'
import { slide as Burger } from 'react-burger-menu'
import Link from 'next/link'
import { pagesPath } from '../lib/$path'
import type { PathpidaValue } from '../lib/$path.types'
import { useRouter } from 'next/router'

type Icon = 'horoscope' | 'numerology' | 'suimei'

type SideBarLinkProps = {
  path: PathpidaValue
  icon?: Icon
  onClick: () => void
  children: string
}
// 入力中の内容を引き継いで、ほかの占いに移動するリンク
const SideBarLink = ({ path, icon, onClick, children }: SideBarLinkProps) => {
  const { query } = useRouter()
  return (
    <Link href={path.$url({ query })} onClick={onClick}>
      {/* アイコンが無い項目も、ラベルの位置を揃えるために同じ幅を空けておく */}
      <span className={`bm-icon bm-icon-${icon ?? 'none'}`} aria-hidden="true" />
      {children}
    </Link>
  )
}

export default function Menu() {
  const [isOpen, setOpen] = useState(false)
  const handleIsOpen = () => {
    setOpen(!isOpen)
  }
  const closeSideBar = () => {
    setOpen(false)
  }

  return (
    <Burger right width={'100%'} isOpen={isOpen} onOpen={handleIsOpen} onClose={handleIsOpen}>
      <ul>
        <li>
          <SideBarLink path={pagesPath} onClick={closeSideBar}>
            HOME
          </SideBarLink>
        </li>
        <li>
          <SideBarLink path={pagesPath.horoscope} icon="horoscope" onClick={closeSideBar}>
            西洋占星術
          </SideBarLink>
        </li>
        <li>
          <SideBarLink path={pagesPath.numerology} icon="numerology" onClick={closeSideBar}>
            数秘術
          </SideBarLink>
        </li>
        <li>
          <SideBarLink path={pagesPath.suimei} icon="suimei" onClick={closeSideBar}>
            四柱推命
          </SideBarLink>
        </li>
      </ul>
    </Burger>
  )
}
