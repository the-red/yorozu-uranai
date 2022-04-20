import Image from 'next/image'
import styles from '../styles/Home.module.css'
import twitterLogo from '../../public/images/index/twitter-logo.svg'

export default function Footer() {
  return (
    <footer className={styles.footer}>
      <p className={styles.contact}>
        <a href="https://twitter.com/YorozuUranai" target="_blank">
          <Image src={twitterLogo} width={25} height={25} alt="Twitterアイコン" />
        </a>
      </p>
      <p className={styles.copyright}>
        <small>
          <a href="https://www.sonicgarden.jp" target="_blank" rel="noopener noreferrecr">
            Copyright © SonicGarden All rights reserved.
          </a>
        </small>
      </p>
    </footer>
  )
}
