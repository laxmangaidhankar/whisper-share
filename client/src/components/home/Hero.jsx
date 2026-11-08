
import './Hero.css'

function Hero() {
  const navigateToRoom = (event, path) => {
    event.preventDefault()
    document.body.classList.add('page-leaving')

    window.setTimeout(() => {
      window.location.href = path
    }, 260)
  }

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
            <a
              className="button button--primary"
              href="/create-room"
              onClick={(event) => navigateToRoom(event, '/create-room')}
            >
              Start Sharing <span>→</span>
            </a>

            <a
              className="button button--secondary"
              href="/join-room"
              onClick={(event) => navigateToRoom(event, '/join-room')}
            >
              <span className="plus">↗</span> Access Files
            </a>
          </div>
        </div>

        {/* RIGHT SIDE */}
        <div className="hero-upload">
          <a className="instant-share-panel" href="/instant-upload">
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
          </a>
        </div>
      </div>

      <div className="scroll-cue" aria-hidden="true">
        ⌄
      </div>
    </section>
  )
}

export default Hero
