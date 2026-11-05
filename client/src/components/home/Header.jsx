
import { Logo } from './Ui'
import { useState } from 'react'
import { getTheme, setTheme } from '../../utils/theme'

import './Header.css'

function Header() {
  const [menuOpen, setMenuOpen] = useState(false)
  const [theme, setCurrentTheme] = useState(getTheme)

  const closeMenu = () => setMenuOpen(false)

  const toggleTheme = () => {
    const newTheme = theme === 'light' ? 'dark' : 'light'

    setTheme(newTheme)
    setCurrentTheme(newTheme)
  }

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
            onClick={toggleTheme}
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
