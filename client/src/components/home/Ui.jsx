
export function Logo({ light = false }) {
  return (
    <a
      className={`logo ${light ? 'logo--light' : ''}`}
      href="/"
      aria-label="SoulTether home"
    >
      <span className="logo-mark" aria-hidden="true">
        <svg
          viewBox="0 0 42 38"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            d="M8 13h25v11c0 6-4 9-12.5 9S8 30 8 24V13Z"
            stroke="currentColor"
            strokeWidth="2.4"
          />
          <path
            d="M33 16h3.5a5 5 0 0 1 0 10H33M5 36h31M14 8c0-2 2-3 2-5M22 8c0-2 2-3 2-5"
            stroke="currentColor"
            strokeWidth="2.4"
            strokeLinecap="round"
          />
        </svg>
      </span>

      <span className="logo-text">WhisperShare</span>
    </a>
  )
}

export function Icon({ name }) {
  const paths = {
    mic: (
      <>
        <path d="M12 3a3 3 0 0 0-3 3v6a3 3 0 0 0 6 0V6a3 3 0 0 0-3-3Z" />
        <path d="M6 11a6 6 0 0 0 12 0M12 17v4M8 21h8" />
      </>
    ),
    people: (
      <>
        <circle cx="9" cy="8" r="3" />
        <circle cx="17" cy="9" r="2.5" />
        <path d="M3 19c.5-3.3 2.4-5 6-5s5.5 1.7 6 5M15 14c3 0 4.7 1.5 5 4" />
      </>
    ),
    home: (
      <>
        <path d="m3 11 9-7 9 7" />
        <path d="M5 10v10h14V10M9 20v-6h6v6" />
      </>
    ),
    spark: (
      <>
        <path d="m12 3 1.7 5.3L19 10l-5.3 1.7L12 17l-1.7-5.3L5 10l5.3-1.7L12 3ZM19 16l.7 2.3L22 19l-2.3.7L19 22l-.7-2.3L16 19l2.3-.7L19 16Z" />
      </>
    ),
  }

  return (
    <svg
      className="feature-icon"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      {paths[name] || null}
    </svg>
  )
}
