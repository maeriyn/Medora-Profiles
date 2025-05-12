import { Link } from 'react-router-dom'
import './Menu.css'

interface MenuProps {
  isModalOpen: boolean;
}

export default function Menu({ isModalOpen }: MenuProps) {
  return (
    <nav 
      className="menu"
      style={{
        opacity: isModalOpen ? 0.1 : 1,  // Decreased from 0.3 to 0.1 for more dimming
        transition: 'opacity 0.3s ease'
      }}
    >
      <div className="menu-content">
        <Link to="/" className="menu-logo">
          <img src="/medora-logo.svg" alt="Medora" className="menu-logo-image" />
        </Link>
        <div className="menu-links">
          <Link to="/">HOME</Link>
          <div className="menu-item">
            <Link to="/modalities">MODALITIES</Link>
            <div className="dropdown">
              <Link to="/modalities/healthcare">Healthcare</Link>
              <Link to="/modalities/financial">Financial</Link>
              <Link to="/modalities/educational">Educational</Link>
              <Link to="/modalities/legal">Legal</Link>
            </div>
          </div>
          <Link to="/biography">BIOGRAPHY</Link>
          <Link to="/contact">CONTACT</Link>
        </div>
      </div>
      <div className="brand-name">Medora</div>
    </nav>
  )
}
