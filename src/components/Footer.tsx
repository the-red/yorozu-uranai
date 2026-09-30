import GitHubLogo from '../../public/images/index/github-logo.svg'
import XLogo from '../../public/images/index/x-logo.svg'

export default function Footer() {
  return (
    <footer className="footer">
      <p className="contact">
        <a href="https://x.com/YorozuUranai" target="_blank" rel="noreferrer" aria-label="よろず占いのX">
          <XLogo className="x-logo" width={25} height={25} aria-hidden="true" />
        </a>
        <a
          href="https://github.com/the-red/yorozu-uranai"
          target="_blank"
          rel="noreferrer"
          aria-label="よろず占いのGitHub"
        >
          <GitHubLogo className="github-logo" width={25} height={25} aria-hidden="true" />
        </a>
      </p>
    </footer>
  )
}
