import Link from 'next/link'
import Image from 'next/image'
import { useRouter } from 'next/router'
import { pagesPath, staticPath } from '../lib/$path'
import NumerologyIcon from '../../public/images/index/numerology.svg'
import SuimeiIcon from '../../public/images/index/suimei.svg'
import Logo from '../svg/Logo'
import { Tooltip } from 'react-tooltip'

export default function Header({ whiteIcon = false }: { whiteIcon?: boolean }) {
  const { query } = useRouter()

  return (
    <header className="header">
      <Tooltip id="tooltip-nav" className="tooltip-nav-style" />
      <div className="header_wrapper">
        <h1>
          <Link href={pagesPath.$url({ query })}>
            <Logo className="logo" width={144.26} height={28} />
          </Link>
        </h1>
        <nav>
          <ul>
            <li>
              <Link
                href={pagesPath.horoscope.$url({ query })}
                data-tooltip-id="tooltip-nav"
                data-tooltip-content="西洋占星術"
              >
                {/* TODO: horoscopeIcon はSVGコンポーネントとして表示すると何故か消えるのでなんとかする */}
                {/* NOTE: SVGコンポーネント化がうまくいくまで、暫定対応として条件分岐で色分けする */}
                {whiteIcon ? (
                  <Image
                    src={staticPath.images.index.horoscope_white_svg}
                    className="icon"
                    width={16}
                    height={16}
                    alt="西洋占星術"
                  />
                ) : (
                  <Image
                    src={staticPath.images.index.horoscope_svg}
                    className="icon"
                    width={16}
                    height={16}
                    alt="西洋占星術"
                  />
                )}
              </Link>
            </li>
            <li>
              <Link
                href={pagesPath.numerology.$url({ query })}
                data-tooltip-id="tooltip-nav"
                data-tooltip-content="数秘術"
              >
                <NumerologyIcon className="icon" width={16} height={16} alt="数秘術" />
              </Link>
            </li>
            <li>
              <Link
                href={pagesPath.suimei.$url({ query })}
                data-tooltip-id="tooltip-nav"
                data-tooltip-content="四柱推命"
              >
                <SuimeiIcon className="icon" width={16} height={16} alt="四柱推命" />
              </Link>
            </li>
          </ul>
        </nav>
      </div>
    </header>
  )
}
