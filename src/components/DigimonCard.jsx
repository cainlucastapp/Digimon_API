// src/components/DigimonCard.jsx

import { useNavigate } from "react-router-dom"
import { useState } from "react"
import "../styles/DigimonCard.css"

function DigimonCard({ digimon }) {
  const navigate = useNavigate()
  const [imageLoaded, setImageLoaded] = useState(false)

  const handleClick = () => navigate(`/digimon/${digimon.id}`)

  return (
    <div className="card" onClick={handleClick}>
      <div className="card-header">
        <span className="card-name">{digimon.name}</span>
      </div>
      <div className="card-image-container">
        {!imageLoaded && (
            <div className="card-image-scan">
                <div className="card-image-scan-line" />
            </div>
        )}
        <img
            src={digimon.images?.[0]?.href || digimon.image}
            alt={digimon.name}
            className="card-image"
            style={{ display: imageLoaded ? "block" : "none" }}
            onLoad={() => setImageLoaded(true)}
        />
    </div>
      <div className="card-footer">
        <span className="card-id">#{digimon.id}</span>
      </div>
    </div>
  )
}

export default DigimonCard