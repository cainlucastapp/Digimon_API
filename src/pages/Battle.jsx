// src/pages/Battle.jsx
import { useState, useEffect } from "react"
import { useLocation } from "react-router-dom"
import { getDigimonList, getDigimon } from "../services/digimonApi"
import { calcHP, getAttribute, calcDamage, getPlayerLevel, getCPULevel, getRandomSkills, getNextLevel, applyDamage, isFainted } from "../services/battleEngine"
import BattleIntro from "../components/battle/BattleIntro"
import BattleSelect from "../components/battle/BattleSelect"
import BattleArena from "../components/battle/BattleArena"
import BattleWin from "../components/battle/BattleWin"
import BattleGameOver from "../components/battle/BattleGameOver"
import "../styles/Battle.css"

// Default Fighter State
const defaultFighter = {
  digimon: null,
  hp: 0,
  maxHP: 0,
  skills: [],
}

function Battle() {

  // Screen State
  const [screen, setScreen] = useState("start")

  // Round State
  const [round, setRound] = useState(0)

  // Fighter State
  const [player, setPlayer] = useState(defaultFighter)
  const [cpu, setCpu] = useState(defaultFighter)

  // Selection State
  const [choices, setChoices] = useState([])
  const [loadingChoices, setLoadingChoices] = useState(false)

  // Battle State
  const [turn, setTurn] = useState("player")
  const [lastMessage, setLastMessage] = useState("")
  const [isAnimating, setIsAnimating] = useState(false)
  const [isFinalVictory, setIsFinalVictory] = useState(false)

  // Reset on Navigation to battle
  const location = useLocation()
  useEffect(() => {
    setScreen("start")
    setRound(0)
    setPlayer(defaultFighter)
    setCpu(defaultFighter)
    setLastMessage("")
    setTurn("player")
    setIsAnimating(false)
  }, [location.pathname])

  // Build Fighter from Digimon
  const buildFighter = (digimon) => ({
    digimon,
    hp: calcHP(digimon),
    maxHP: calcHP(digimon),
    skills: getRandomSkills(digimon),
  })

  // Load Player Choices
  const loadChoices = async (targetRound) => {
    setLoadingChoices(true)
    try {
      const level = getPlayerLevel(targetRound)
      const res = await getDigimonList({ level, pageSize: 100 })
      const pool = res.content || []
      const shuffled = [...pool].sort(() => Math.random() - 0.5)
      const selected = shuffled.slice(0, 3)
      const detailed = await Promise.all(selected.map((d) => getDigimon(d.id)))
      setChoices(detailed)
    } catch (err) {
        console.error("Failed to load choices:", err)
    } finally {
        setLoadingChoices(false)
    }
  }

  // Load CPU Digimon
  const loadCPU = async (targetRound) => {
      try {
        const level = getCPULevel(targetRound)
        const res = await getDigimonList({ level, pageSize: 100 })
        const pool = res.content || []
        const random = pool[Math.floor(Math.random() * pool.length)]
        const detailed = await getDigimon(random.id)
        setCpu(buildFighter(detailed))
      } catch (err) {
          console.error("Failed to load CPU:", err)
      }
  }

  // Evolve Fighter to Next Valid Level
  const evolveFighter = async (fighter) => {
      if (!fighter.digimon.nextEvolutions?.length) return null

      const currentLevel = fighter.digimon.levels?.[0]?.level || "Baby I"
      const nextLevel = getNextLevel(currentLevel)
      
      if (!nextLevel) return null

      const evoDetails = await Promise.all(
          fighter.digimon.nextEvolutions.map(evo => getDigimon(evo.id))
      )


      // Try direct evolution to next level
      const directEvolutions = evoDetails.filter(evo =>
          evo.levels?.[0]?.level === nextLevel
      )
      
      if (directEvolutions.length > 0) {
          return directEvolutions[Math.floor(Math.random() * directEvolutions.length)]
      }

      // Try chaining through any intermediate
      for (const intermediate of evoDetails) {
          if (!intermediate.nextEvolutions?.length) continue
          const chainDetails = await Promise.all(
              intermediate.nextEvolutions.map(evo => getDigimon(evo.id))
          )
          const chainedEvolutions = chainDetails.filter(evo =>
              evo.levels?.[0]?.level === nextLevel
          )
          if (chainedEvolutions.length > 0) {
              return chainedEvolutions[Math.floor(Math.random() * chainedEvolutions.length)]
          }
      }

      return null
    }

    // Execute Attack (shared by player and CPU)
    const executeAttack = async (attacker, defender, setDefender, skill, onFaint) => {
        const defenderAttribute = getAttribute(defender.digimon)
        const damage = calcDamage(attacker.digimon, attacker.maxHP, defenderAttribute)
        const newHP = applyDamage(defender.hp, damage)

        setDefender(prev => ({ ...prev, hp: Math.max(0, newHP) }))
        setLastMessage(`${attacker.digimon.name} used ${skill.skill} for ${damage} damage!`)

        if (isFainted(newHP)) {
            setTimeout(async () => {
                await onFaint()
            }, 2000)
            return true
        }
        return false
    }

    // Handle Start
    const handleStart = () => setScreen("rules")

    // Handle Rules Continue
    const handleRulesContinue = async () => {
      await loadChoices(round)
      setScreen("select")
    }

    // Handle Player Selection
    const handleSelect = async (digimon) => {
      setPlayer(buildFighter(digimon))
      await loadCPU(round)
      setLastMessage("")
      setScreen("battle")
    }

    // Handle Player Attack
    const handlePlayerAttack = async (skill) => {
        if (isAnimating || turn !== "player") return
        setIsAnimating(true)

        // Player Attacks
        const fainted = await executeAttack(player, cpu, setCpu, skill, async () => {
            const evolvedDigimon = await evolveFighter(player)
            if (evolvedDigimon) {
                setPlayer(buildFighter(evolvedDigimon))
                setLastMessage(`${player.digimon.name} evolved into ${evolvedDigimon.name}!`)
            } else {
                // No evolution available — reset HP to max
                setPlayer(prev => ({ ...prev, hp: prev.maxHP }))
                setLastMessage(`${player.digimon.name} has reached its final form!`)
            }
            setScreen("win")
        })

        if (fainted) {
            return
        }

        // CPU Turn
        setTurn("cpu")
        setTimeout(async () => {
            const cpuSkill = cpu.skills[Math.floor(Math.random() * cpu.skills.length)]
            const cpuFainted = await executeAttack(cpu, player, setPlayer, cpuSkill, async () => {
                setScreen("gameover")
            })

            if (cpuFainted) {
                return
            }

            setTurn("player")
            setIsAnimating(false)
        }, 1500)
    }

    // Handle Continue (Next Round)
    const handleContinue = async () => {
        const nextRound = round + 1

        if (nextRound > 5) {
            setIsFinalVictory(true)
            setLastMessage(`${player.digimon.name} has conquered the Digital World!`)
            setScreen("win")
            return
        }

        setRound(nextRound)
        await loadCPU(nextRound)
        setLastMessage("")
        setTurn("player")
        setIsAnimating(false)
        setScreen("battle")
    }

    // Handle Exit
    const handleExit = () => {
        setScreen("start")
        setRound(0)
        setPlayer(defaultFighter)
        setCpu(defaultFighter)
        setLastMessage("")
        setTurn("player")
        setIsAnimating(false)
        setIsFinalVictory(false)
    }

    // Render Screens
    const renderScreen = () => {
        switch (screen) {
            case "start":
            case "rules":
                return (
                    <BattleIntro
                        screen={screen}
                        loadingChoices={loadingChoices}
                        onStart={handleStart}
                        onContinue={handleRulesContinue}
                    />
                )
            case "select":
                return (
                    <BattleSelect
                        choices={choices}
                        onSelect={handleSelect}
                    />
                )
            case "battle":
                return (
                    <BattleArena
                        player={player}
                        cpu={cpu}
                        turn={turn}
                        isAnimating={isAnimating}
                        lastMessage={lastMessage}
                        onAttack={handlePlayerAttack}
                    />
                )
            case "win":
                return (
                    <BattleWin
                        player={player}
                        lastMessage={lastMessage}
                        isFinalVictory={isFinalVictory}
                        onContinue={handleContinue}
                        onExit={handleExit}
                    />
                )
            case "gameover":
                return (
                    <BattleGameOver
                        onExit={handleExit}
                    />
                )
            default:
                return null
        }
    }

    return (
        <div className="battle">
            {renderScreen()}
        </div>
    )
}

export default Battle