
import { useState } from 'react'
import './Hero.css'

function Hero() {
  const [showAccess, setShowAccess] = useState(false)
  const [accessCode, setAccessCode] = useState('')

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

  const handleCodeChange = (event) => {
    setAccessCode(
      event.target.value
        .toUpperCase()
        .replace(/[^A-Z0-9]/g, '')
        .slice(0, 6)
    )
  }

  const handleAccessSubmit = (event) => {
    event.preventDefault()

    if (accessCode.length !== 6) return

    window.location.href = `/access-file?code=${accessCode}`
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

          {!showAccess ? (
            <>
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
                href="#access-file"
                className="access-code-link"
                onClick={(event) => {
                  event.preventDefault()
                  setShowAccess(true)
                }}
              >
                Already have a code? <strong>Access your file →</strong>
              </a>
            </>
          ) : (
            <>
              <div className="upload-card access-card">

                <div className="upload-card-header">
                  <span className="upload-icon">↗</span>
                  <div>
                    <h3>Access Your File</h3>
                    <p>Enter the 6-character code to continue.</p>
                  </div>
                </div>

                <form
                  className="access-form"
                  onSubmit={handleAccessSubmit}
                >
                  <label htmlFor="access-code">
                    FILE ACCESS CODE
                  </label>

                  <input
                    id="access-code"
                    type="text"
                    value={accessCode}
                    onChange={handleCodeChange}
                    placeholder="ABC123"
                    maxLength={6}
                    autoComplete="off"
                    autoFocus
                    required
                  />

                  <button
                    className="access-submit"
                    type="submit"
                    disabled={accessCode.length !== 6}
                  >
                    Access File <span>→</span>
                  </button>
                </form>

              </div>

              <button
                className="access-code-link access-back"
                type="button"
                onClick={() => {
                  setShowAccess(false)
                  setAccessCode('')
                }}
              >
                ← Back to Instant Share
              </button>
            </>
          )}

        </div>
      </div>

      <div className="scroll-cue" aria-hidden="true">
        ⌄
      </div>
    </section>
  )
}

export default Hero
