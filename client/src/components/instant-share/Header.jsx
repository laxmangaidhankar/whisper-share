import { Link } from 'react-router-dom'
import { Logo } from '../home/Ui'

import './Header.css'

function Header() {
  return (
    <header className="site-header">
      <div className="header-inner page-shell">
        <Logo />
        <div className="header-controls">
          <Link className="header-back" to="/">
            <span aria-hidden="true">←</span> Back to home
          </Link>
        </div>
      </div>
    </header>
  )
}

export default Header