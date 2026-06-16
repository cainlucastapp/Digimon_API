// src/components/battle/BattleIntro.jsx

import "../../styles/battle/BattleIntro.css"

function BattleIntro({ screen, loadingChoices, onStart, onContinue }) {
  return (
    <div className="battle-screen">
      {screen === "start" && (
        <>
          <h1 className="battle-title">Digi Fight Battler</h1>
          <button className="battle-btn" onClick={onStart}>Start</button>
        </>
      )}

      {screen === "rules" && (
        <>
          <h2 className="battle-title">Rules</h2>
          <div className="battle-rules">
            <p>Choose your Digimon from 3 random options.</p>
            <p>Battle CPU controlled Digimon turn by turn.</p>
            <p>Each turn, choose your attack.</p>
            <p>Reduce the CPU's HP to zero to win.</p>
            <p>Win to evolve your Digimon and face stronger opponents.</p>
            <p>Attribute Bonuses: Vaccine beats Virus, Virus beats Data, Data beats Vaccine.</p>
            <p>WARNING: Do NOT navigate away from this page during the battle.</p>
          </div>
          <button className="battle-btn" onClick={onContinue}>
            {loadingChoices ? "Loading..." : "Continue"}
          </button>
        </>
      )}
    </div>
  )
}

export default BattleIntro