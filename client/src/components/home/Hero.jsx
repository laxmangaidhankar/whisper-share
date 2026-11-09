
import './Hero.css'
import { Link } from 'react-router-dom';


function Hero() {


  return (
    <section className="hero">
      <div className="hero-watermark" aria-hidden="true">
        WHISPERSHARE
      </div>

      <div className="hero-content page-shell">

        {/* LEFT SIDE */}
        <div className="hero-left">
          <h1>
            SHARE FILES.
            <br />
            <em>PRIVATE BY DESIGN.</em>
          </h1>

          <p className="hero-copy">
            Create a temporary space, share your files securely,
            <br />
            and let others access them with a simple key.
          </p>

          <div className="hero-actions">
            <Link
              className="button button--primary"
              to="/create-room"
            >
              Start Sharing <span>→</span>
            </Link>

            <Link
              className="button button--secondary"
              to="/join-room"

            >
              <span className="plus">↗</span> Access Files
            </Link>
          </div>
        </div>

        {/* RIGHT SIDE */}
        <div className="hero-upload">

          <Link
            className="instant-share-panel"
            to="/instant-upload"
          >
            <div className="instant-share-heading">
              <div>
                <h2>Instant Share</h2>
                <p>One file. One code. Complete privacy.</p>
              </div>
            </div>

            <div className="instant-share-center">
              <span className="big-arrow">→</span>
            </div>

            <div className="instant-share-bottom">
            </div>
          </Link>
        </div>
      </div>

      <div className="scroll-cue" aria-hidden="true">
        ⌄
      </div>
    </section>
  )
}

export default Hero
