// src/components/EvolutionChain.jsx

import { useNavigate } from "react-router-dom"
import "../styles/EvolutionChain.css"

function EvolutionChain({ prior, next }) {
  const navigate = useNavigate()

  const renderEvolutions = (evolutions) => {
    if (!evolutions || evolutions.length === 0) return <p className="evo-empty">None</p>

    return (
      <div className="evo-row">
        {evolutions.map((evo) => (
          <div key={evo.id} className="evo-card" onClick={() => navigate(`/digimon/${evo.id}`)}>
            <div className="evo-image-container">
              <img src={evo.image} alt={evo.digimon} className="evo-image" />
            </div>
            <span className="evo-name">{evo.digimon}</span>
            {evo.condition && <span className="evo-condition">{evo.condition}</span>}
          </div>
        ))}
      </div>
    )
  }

  return (
    <div className="evo">
      <div className="evo-section">
        <h3 className="evo-title">Prior Evolutions</h3>
        {renderEvolutions(prior)}
      </div>
      <div className="evo-section">
        <h3 className="evo-title">Next Evolutions</h3>
        {renderEvolutions(next)}
      </div>
    </div>
  )
}

export default EvolutionChain