import Link from 'next/link'
import Image from 'next/image'
import { useRouter } from 'next/router'
import { pagesPath, staticPath } from '../lib/$path'
import NumerologyIcon from '../../public/images/index/numerology.svg'

export default function Header({ whiteIcon = false }: { whiteIcon?: boolean }) {
  const { query } = useRouter()

  return (
    <header className="header">
      <div className="header_wrapper">
        <h1>
          <Link href={pagesPath.$url({ query })}>
            <a>
              {whiteIcon ? (
                <Image
                  src={staticPath.images.index.logo_typo_white_svg}
                  className="icon"
                  width={154.56}
                  height={30}
                  alt="よろず占いロゴ"
                />
              ) : (
                <Image
                  src={staticPath.images.index.logo_typo_svg}
                  className="icon"
                  width={154.56}
                  height={30}
                  alt="よろず占いロゴ"
                />
              )}
            </a>
          </Link>
        </h1>
        <nav>
          <ul>
            <li>
              <Link href={pagesPath.horoscope.$url({ query })}>
                <a title="西洋占星術">
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
                </a>
              </Link>
            </li>
            <li>
              <Link href={pagesPath.numerology.$url({ query })}>
                <a title="数秘術">
                  <NumerologyIcon className="icon" width={16} height={16} alt="数秘術" />
                </a>
              </Link>
            </li>
          </ul>
        </nav>
      </div>
    </header>
  )
}
