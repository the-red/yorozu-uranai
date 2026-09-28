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
  const SideBarLink = ({ path, icon, children }: { path: PathpidaValue; icon?: string; children: string }) => (
    <Link href={path.$url({ query })} onClick={closeSideBar}>
      {/* NOTE: アイコンを文字と同じ色にするため、画像をマスクとして使い、背景色で塗っている */}
      {/* アイコンが無い項目も、ラベルの位置を揃えるために同じ幅を空けておく */}
      <span
        className="bm-icon"
        style={icon ? { maskImage: `url(${icon})`, WebkitMaskImage: `url(${icon})` } : { visibility: 'hidden' }}
        aria-hidden="true"
      />
      {children}
    </Link>
  )

  const icons = staticPath.images.index

  return (
    <Burger right width={'100%'} isOpen={isOpen} onOpen={handleIsOpen} onClose={handleIsOpen}>
      <ul>
        <li>
          <SideBarLink path={pagesPath}>HOME</SideBarLink>
        </li>
        <li>
          <SideBarLink path={pagesPath.horoscope} icon={icons.horoscope_svg}>
            西洋占星術
          </SideBarLink>
        </li>
        <li>
          <SideBarLink path={pagesPath.numerology} icon={icons.numerology_svg}>
            数秘術
          </SideBarLink>
        </li>
        <li>
          <SideBarLink path={pagesPath.suimei} icon={icons.suimei_svg}>
            四柱推命
          </SideBarLink>
        </li>
      </ul>
    </Burger>
  )
}
