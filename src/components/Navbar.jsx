// src/components/Navbar.jsx

import { Link } from "react-router-dom"

function Navbar() {
  return (
    <nav>
      <Link to="/">Home</Link>
      <Link to="/digimon">List</Link>
    </nav>
  )
}

export default Navbar