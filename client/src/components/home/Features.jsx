
import { Icon } from './Ui'
import './Features.css'

const features = [
  ['home', 'Temporary Sharing', 'Create a temporary space to share files without keeping them permanently.'],
  ['people', 'Simple Access', 'Share your room credentials so recipients can access files directly.'],
  ['spark', 'Multiple File Uploads', 'Upload and share multiple files together in one place.'],
  ['mic', 'No Account Required', 'Start sharing instantly without registration or sign-up.'],
]

function Features() {
  return (
    <section className="features" id="features">
      <div className="features-inner page-shell">
        <div className="section-heading">
          <p className="eyebrow">THE WHISPERSHARE EXPERIENCE</p>

          <h2>
            FILE SHARING,<br />
            <em>WITHOUT THE FRICTION</em>
          </h2>

          <p className="section-lede">
            Share files through temporary spaces. No accounts, complicated
            setup, or unnecessary steps.
          </p>
        </div>

        <div className="feature-grid">
          {features.map(([icon, title, text]) => (
            <article className="feature-card" key={title}>
              <div className={`feature-icon-wrap feature-icon-wrap--${icon}`}>
                <Icon name={icon} />
              </div>

              <h3>{title}</h3>
              <p>{text}</p>

              <span className="card-scribble" aria-hidden="true">~</span>
            </article>
          ))}
        </div>
      </div>
    </section>
  )
}

export default Features
