// src/components/ErrorMessage.jsx
import "../styles/ErrorMessage.css"

function ErrorMessage({ message }) {
  return (
    <div className="error">
      <h2 className="error-title">Something went wrong</h2>
      <p className="error-message">{message}</p>
      <button className="error-btn" onClick={() => window.location.reload()}>
        Try Again
      </button>
    </div>
  )
}

export default ErrorMessage