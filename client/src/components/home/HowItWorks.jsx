import './HowItWorks.css'

function HowItWorks() {
  return (
    <section className="how" id="how-it-works">
      <div className="how-inner page-shell">
        <div className="how-intro">
          <p className="eyebrow">SHARE WITHOUT THE HASSLE</p>
          <h2>HOW WHISPERSHARE<br /><em>WORKS</em></h2>
          <p>
            Your files, one secure space. Share them with anyone,
            anywhere — no accounts, no complicated setup.
          </p>
        </div>

        <div className="steps">
          <div className="step">
            <span className="step-number">01</span>
            <h3>Create a Room</h3>
            <p>Start a temporary sharing room and upload the files you want to share.</p>
          </div>

          <span className="step-arrow" aria-hidden="true">→</span>

          <div className="step">
            <span className="step-number">02</span>
            <h3>Share Your Keys</h3>
            <p>Get your unique Access Key and Room Key. Send them to your recipients.</p>
          </div>

          <span className="step-arrow" aria-hidden="true">→</span>

          <div className="step">
            <span className="step-number">03</span>
            <h3>Access & Download</h3>
            <p>Recipients enter the keys in their browser and download shared files.</p>
          </div>
        </div>
      </div>
    </section>
  )
}

export default HowItWorks