// src/components/battle/BattleSelect.jsx

import { calcHP } from "../../services/battleEngine"
import "../../styles/battle/BattleSelect.css"

function BattleSelect({ choices, onSelect }) {
  return (
    <div className="battle-screen">
      <h2 className="battle-title">Choose Your Digimon</h2>
      <div className="battle-choices">
        {choices.map((digimon) => (
          <div key={digimon.id} className="battle-choice" onClick={() => onSelect(digimon)}>
            <img
              src={digimon.images?.[0]?.href}
              alt={digimon.name}
              className="battle-choice-img"
            />
            <span className="battle-choice-name">{digimon.name}</span>
            <span className="battle-choice-hp">HP: {calcHP(digimon)}</span>
            <span className="battle-choice-level">{digimon.levels?.[0]?.level}</span>
          </div>
        ))}
      </div>
    </div>
  )
}

export default BattleSelect