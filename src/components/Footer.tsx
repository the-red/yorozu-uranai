import TwitterLogo from '../../public/images/index/twitter-logo.svg'

export default function Footer() {
  return (
    <footer className="footer">
      <p className="contact">
        <a href="https://twitter.com/YorozuUranai" target="_blank">
          <TwitterLogo className="twitter-logo" width={25} height={25} alt="Twitterアイコン" />
        </a>
      </p>
      <p className="copyright">
        <small>
          <a href="https://www.sonicgarden.jp" target="_blank" rel="noopener noreferrer">
            Copyright © SonicGarden All rights reserved.
          </a>
        </small>
      </p>
    </footer>
  )
}
