// src/pages/NotFound.jsx

import { Link } from "react-router-dom"
import "../styles/NotFound.css"

function NotFound() {
  return (
    <div className="not-found">
      <h1 className="not-found-code">404</h1>
      <h2 className="not-found-title">Page Not Found</h2>
      <p className="not-found-message">
        Looks like this page got lost in the Digital World.
      </p>
      <Link to="/" className="not-found-btn">Back to Home</Link>
    </div>
  )
}

export default NotFound