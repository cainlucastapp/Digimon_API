// src/components/Footer.jsx

import "../styles/Footer.css"

function Footer() {
  return (
    <footer className="footer">
      <p className="footer-powered">
        Powered by{" "}
        <a href="https://www.linkedin.com/in/vinícius-brito-costa/" target="_blank" rel="noreferrer">
          Vinicius Brito Costa
        </a>
        's{" "}
        <a href="https://digi-api.com/" target="_blank" rel="noreferrer">
          digi-api.com
        </a>
      </p>
      <p className="footer-disclaimer">
        Digimon and other media relating to the franchise are registered trademarks of Bandai.
      </p>
    </footer>
  )
}

export default Footer