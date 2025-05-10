import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import './Menu.css'

export default function Menu() {
  const [isVisible, setIsVisible] = useState(false)

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (e.clientY < 100) {
        setIsVisible(true)
      } else {
        setIsVisible(false)
      }
    }

    window.addEventListener('mousemove', handleMouseMove)
    return () => window.removeEventListener('mousemove', handleMouseMove)
  }, [])

  return (
    <nav className={`menu ${isVisible ? 'visible' : ''}`}>
      <div className="menu-content">
        <Link to="/">HOME</Link>
        <Link to="/biography">BIOGRAPHY</Link>
        <Link to="/contact">CONTACT</Link>
      </div>
    </nav>
  )
}
