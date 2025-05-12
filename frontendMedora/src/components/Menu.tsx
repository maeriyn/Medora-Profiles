import { Link } from 'react-router-dom'
import './Menu.css'

export default function Menu() {
  return (
    <nav className="menu">
      <div className="menu-content">
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
    </nav>
  )
}
