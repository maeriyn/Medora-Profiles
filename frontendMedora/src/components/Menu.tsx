import { Link } from 'react-router-dom'
import './Menu.css'

export default function Menu() {
  return (
    <nav className="menu">
      <div className="menu-content">
        <Link to="/">HOME</Link>
        <Link to="/biography">BIOGRAPHY</Link>
        <Link to="/contact">CONTACT</Link>
      </div>
    </nav>
  )
}
