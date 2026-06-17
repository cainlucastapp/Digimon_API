// src/components/Navbar.jsx

import { useState } from "react"
import { Link } from "react-router-dom"
import digimonLogo from "../assets/digimon_logo.png"
import "../styles/Navbar.css"

function Navbar() {
  const [menuOpen, setMenuOpen] = useState(false)

  const closeMenu = () => setMenuOpen(false)

  return (
    <nav className="navbar">
      <Link to="/" className="navbar-logo" onClick={closeMenu}>
        <img src={digimonLogo} alt="Digimon Logo" />
      </Link>

      <button
        className={`navbar-hamburger ${menuOpen ? "open" : ""}`}
        onClick={() => setMenuOpen(!menuOpen)}
        aria-label="Toggle menu"
      >
        <span></span>
        <span></span>
        <span></span>
      </button>

      <ul className={`navbar-links ${menuOpen ? "open" : ""}`}>
        <li><Link to="/" onClick={closeMenu}>Home</Link></li>
        <li><Link to="/digimon?page=1" onClick={closeMenu}>Digimon</Link></li>
        <li><Link to="/battle" onClick={closeMenu}>Battle</Link></li>
      </ul>
    </nav>
  )
}

export default Navbar