import { Link } from 'react-router-dom'
import './Logo.css'

export default function Logo() {
  return (
    <Link to="/" className="logo-link">
      <img src="/medora-logo.svg" alt="Medora" className="logo-image" />
    </Link>
  )
}
