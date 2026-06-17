// src/components/battle/BattleWin.jsx

import "../../styles/battle/BattleWin.css"

function BattleWin({ player, lastMessage, isFinalVictory, onContinue, onExit }) {
    
    return (
        <div className="battle-screen">
            {player?.digimon && (
                <img
                    src={player.digimon.images?.[0]?.href}
                    alt={player.digimon.name}
                    className="battle-win-img"
                />
            )}
            <p className="battle-win-message">{lastMessage}</p>
            <div className="battle-actions">
                {!isFinalVictory && <button className="battle-btn" onClick={onContinue}>Continue</button>}
                <button className="battle-btn" onClick={onExit}>
                    {isFinalVictory ? "Play Again" : "Exit"}
                </button>
            </div>
        </div>
    )
}

export default BattleWin