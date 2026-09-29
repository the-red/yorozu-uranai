import XLogo from '../../public/images/index/x-logo.svg'

export default function Footer() {
  return (
    <footer className="footer">
      <p className="contact">
        <a href="https://x.com/YorozuUranai" target="_blank" rel="noreferrer" aria-label="よろず占いのX">
          <XLogo className="x-logo" width={25} height={25} aria-hidden="true" />
        </a>
      </p>
    </footer>
  )
}
