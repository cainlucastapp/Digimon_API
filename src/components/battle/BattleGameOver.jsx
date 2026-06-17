// src/components/battle/BattleGameOver.jsx

import "../../styles/battle/BattleGameOver.css"

function BattleGameOver({ onExit }) {
  return (
    <div className="battle-screen">
      <h2 className="battle-title-gameover">Game Over</h2>
      <button className="battle-btn" onClick={onExit}>Exit</button>
    </div>
  )
}

export default BattleGameOver