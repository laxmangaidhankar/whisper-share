import './About.css'

function About() {
  return (
    <section className="about" id="about">
      <div className="about-inner page-shell">

        <div className="about-heading">
          <p className="eyebrow">FILE SHARING, SIMPLIFIED</p>

          <h2>
            YOUR FILES.<br />
            <em>YOUR PEOPLE.</em><br />
            ZERO FUSS.
          </h2>
        </div>

        <div className="about-copy">
          <p>
            WhisperShare makes sharing files effortless. Create a temporary
            room, upload multiple files, and share access with anyone using
            simple keys. Recipients can access and download everything
            directly from their browser — no account or software installation
            required.
          </p>

        </div>

      </div>
    </section>
  )
}

export default About
