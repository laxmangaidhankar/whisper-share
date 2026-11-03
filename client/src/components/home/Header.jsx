
import { Logo } from './Ui'
import { useEffect, useState } from 'react'
import './Header.css'

function Header() {
  const [theme, setTheme] = useState(
    () => localStorage.getItem('whispershare-theme') || 'dark'
  )

  const [menuOpen, setMenuOpen] = useState(false)

  useEffect(() => {
    document.documentElement.dataset.theme = theme
    localStorage.setItem('whispershare-theme', theme)
  }, [theme])

  const closeMenu = () => setMenuOpen(false)

  return (
    <header className="site-header">
      <div className="header-inner page-shell">

        <Logo />

        <nav
          className={`main-nav ${menuOpen ? 'is-open' : ''}`}
          id="main-navigation"
          aria-label="Main navigation"
        >
          <a href="/#features" onClick={closeMenu}>Features</a>
          <a href="/#how-it-works" onClick={closeMenu}>How It Works</a>
          <a href="/#about" onClick={closeMenu}>About</a>
        </nav>

        <div className="header-controls">
          <button
            type="button"
            className="theme-toggle"
            onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
            aria-label={`Switch to ${theme === 'dark' ? 'light' : 'dark'} theme`}
          >
            <span aria-hidden="true">
              {theme === 'dark' ? '◐' : '◑'}
            </span>
            <span className="theme-label">Theme</span>
          </button>

          <button
            type="button"
            className="menu-toggle"
            onClick={() => setMenuOpen(!menuOpen)}
            aria-label={menuOpen ? 'Close navigation menu' : 'Open navigation menu'}
            aria-expanded={menuOpen}
            aria-controls="main-navigation"
          >
            <span>{menuOpen ? '✕' : '☰'}</span>
          </button>
        </div>

      </div>
    </header>
  )
}

export default Header
