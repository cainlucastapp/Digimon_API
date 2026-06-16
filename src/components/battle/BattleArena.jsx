// src/components/battle/BattleArena.jsx

import "../../styles/battle/BattleArena.css"

function BattleArena({ player, cpu, turn, isAnimating, lastMessage, onAttack }) {
    return (
        <div className="battle-screen">
            <div className="battle-arena">

                {/*CPU Fighter*/}
                <div className="battle-fighter battle-fighter-cpu">
                    <span className="battle-fighter-name">{cpu.digimon?.name}</span>
                    <span className="battle-fighter-hp">HP: {cpu.hp} / {cpu.maxHP}</span>
                    <img
                        src={cpu.digimon?.images?.[0]?.href}
                        alt={cpu.digimon?.name}
                        className="battle-fighter-img"
                    />
                </div>

                {/*Battle Message*/}
                <div className="battle-message">
                    {lastMessage || "Choose your attack!"}
                </div>

                {/*Player Fighter*/}
                <div className="battle-fighter battle-fighter-player">
                    <img
                        src={player.digimon?.images?.[0]?.href}
                        alt={player.digimon?.name}
                        className="battle-fighter-img"
                    />
                    <span className="battle-fighter-name">{player.digimon?.name}</span>
                    <span className="battle-fighter-hp">HP: {player.hp} / {player.maxHP}</span>
                </div>

            </div>

            {/*Skills*/}
            <div className="battle-skills">
                {turn === "player" && !isAnimating ? (
                    player.skills.map((skill) => (
                        <button
                            key={skill.id}
                            className="battle-skill-btn"
                            onClick={() => onAttack(skill)}
                        >
                            {skill.skill}
                        </button>
                    ))
                ) : (
                    <p className="battle-waiting">CPU is thinking...</p>
                )}
            </div>
        </div>
    )
}

export default BattleArena