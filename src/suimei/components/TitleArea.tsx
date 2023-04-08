import Image from 'next/image'
import { staticPath } from '../../lib/$path'

export const TitleArea = () => (
  <div className="title_area">
    <div className="lantern_outer yellow left">
      <div className="lantern_inner">
        <Image src={staticPath.images.suimei.lantern_yellow_svg} className="image" fill alt="黄色のランタン"></Image>
      </div>
    </div>
    <div className="lantern_outer red left">
      <div className="lantern_inner">
        <Image src={staticPath.images.suimei.lantern_red_svg} className="image" fill alt="赤色のランタン"></Image>
      </div>
    </div>
    <h2>
      <div className="title_logo">
        <Image src={staticPath.images.suimei.logo_suimei_svg} className="image" fill alt="四柱推命"></Image>
      </div>
    </h2>
    <div className="lantern_outer red right">
      <div className="lantern_inner">
        <Image src={staticPath.images.suimei.lantern_red_svg} className="image" fill alt="赤色のランタン"></Image>
      </div>
    </div>
    <div className="lantern_outer yellow right">
      <div className="lantern_inner">
        <Image src={staticPath.images.suimei.lantern_yellow_svg} className="image" fill alt="黄色のランタン"></Image>
      </div>
    </div>
  </div>
)
