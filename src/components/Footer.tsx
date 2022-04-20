import styles from '../styles/Home.module.css'

export default function Footer() {
  return (
    <footer className={styles.footer}>
      <p className={styles.copyright}>
        <small>
          <a href="https://www.sonicgarden.jp" target="_blank" rel="noopener noreferrer">
            Copyright © SonicGarden All rights reserved.
          </a>
        </small>
      </p>
    </footer>
  )
}
