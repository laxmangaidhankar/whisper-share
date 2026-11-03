
import { Logo } from './Ui'
import './Footer.css'

function Footer() {
  return (
    <footer className="site-footer">
      <div className="footer-inner page-shell">

        {/* CTA */}
        <div className="footer-cta">
          <div>
            <p className="eyebrow">SHARING MADE SIMPLE</p>
            <h2>
              YOUR FILES.<br />
              <em>ONE SECURE SPACE.</em>
            </h2>
          </div>

          <a className="footer-cta-link" href="/create-room">
            Start Sharing <span aria-hidden="true">↗</span>
          </a>
        </div>

        {/* Footer Content */}
        <div className="footer-content">

          <div className="footer-brand">
            <Logo light />

            <p>Share files. Skip the hassle. Keep it simple.</p>

            
          </div>

          <div className="footer-links">

            <div>
              <strong>Explore</strong>
              <a href="/#features">Features</a>
              <a href="/#how-it-works">How It Works</a>
            </div>

            <div>
              <strong>Get Started</strong>
              <a href="/create-room">Create a Room</a>
              <a href="/join-room">Join a Room</a>
            </div>

            <div>
              <strong>Connect</strong>
              <a href="mailto:hello@whispershare.app">Contact</a>
              <a href="/#top">
                Back to top <span aria-hidden="true">↑</span>
              </a>
            </div>

          </div>
        </div>

        {/* Bottom */}
        <div className="footer-bottom">
          <p className="copyright">© 2026 WHISPERSHARE</p>
          <p className="footer-note">
            Files shared. Hassle spared.
          </p>
        </div>

      </div>
    </footer>
  )
}

export default Footer
