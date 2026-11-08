
import { Logo } from '../home/Ui'

import './Header.css'

function Header() {
  return (
    <header className="site-header">
      <div className="header-inner page-shell">

        <Logo />
        <div className="header-controls">
        </div>
      </div>
    </header>
  )
}

export default Header
