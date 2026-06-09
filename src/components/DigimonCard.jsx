// src/components/DigimonCard.jsx

import { useNavigate } from "react-router-dom"
import "../styles/DigimonCard.css"

function DigimonCard({ digimon }) {
  const navigate = useNavigate()

  const handleClick = () => navigate(`/digimon/${digimon.id}`)

  return (
    <div className="card" onClick={handleClick}>
      <div className="card-header">
        <span className="card-name">{digimon.name}</span>
      </div>
      <div className="card-image-container">
        <img
          src={digimon.images?.[0]?.href || digimon.image}
          alt={digimon.name}
          className="card-image"
        />
      </div>
      <div className="card-footer">
        <span className="card-id">#{digimon.id}</span>
      </div>
    </div>
  )
}

export default DigimonCard