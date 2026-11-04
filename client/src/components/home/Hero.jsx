import './Hero.css'

function Hero() {
  const navigateToRoom = (event, path) => {
    event.preventDefault()
    document.body.classList.add('page-leaving')

    window.setTimeout(() => {
      window.location.href = path
    }, 260)
  }

  const navigateToUpload = () => {
    document.body.classList.add('page-leaving')

    window.setTimeout(() => {
      window.location.href = '/instant-share'
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

        {/* RIGHT SIDE - INSTANT SHARE */}
        <div className="hero-upload">
          <div className="upload-card">

            <div className="upload-card-header">
              <span className="upload-icon">↗</span>
              <div>
                <h3>Instant Share</h3>
                <p>One file. One code. Complete privacy.</p>
              </div>
            </div>

            <button
              className="upload-dropzone"
              type="button"
              onClick={navigateToUpload}
            >
              <span className="upload-cloud">↑</span>

              <strong>Upload your file</strong>

              <span>
                Click to select a file and share it instantly
              </span>
            </button>


          </div>

          <a
            href="/access-file"
            className="access-code-link"
            onClick={(event) => navigateToRoom(event, '/access-file')}
          >
            Already have a code? <strong>Access your file →</strong>
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