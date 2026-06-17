// src/pages/Battle.jsx
import { useState, useEffect } from "react"
import { useLocation } from "react-router-dom"

import { calcHP, getAttribute, calcDamage, getPlayerLevel, getCPULevel, getRandomSkills, getNextLevel, applyDamage, isFainted, buildFighter, evolveFighter, executeAttack, getRandomDigimonByLevel } from "../services/battleEngine"
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

    // Load Player Choices
    const loadChoices = async (targetRound) => {
        setLoadingChoices(true)
        try {
            const level = getPlayerLevel(targetRound)
            const detailed = await getRandomDigimonByLevel(level, 3)
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
            const [detailed] = await getRandomDigimonByLevel(level, 1)
            setCpu(buildFighter(detailed))
        } catch (err) {
            console.error("Failed to load CPU:", err)
        }
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
    const result = executeAttack(player, cpu, skill)
        setCpu(prev => ({ ...prev, hp: Math.max(0, result.newHP) }))
        setLastMessage(result.message)

        if (result.fainted) {
            setTimeout(async () => {
                const evolvedDigimon = await evolveFighter(player)
                if (evolvedDigimon) {
                    setPlayer(buildFighter(evolvedDigimon))
                    setLastMessage(`${player.digimon.name} evolved into ${evolvedDigimon.name}!`)
                } else {
                    setPlayer(prev => ({ ...prev, hp: prev.maxHP }))
                    setLastMessage(`${player.digimon.name} has reached its final form!`)
                }
                setScreen("win")
            }, 2000)
            return
        }

        // CPU Turn
        setTurn("cpu")
            setTimeout(async () => {
                const cpuSkill = cpu.skills[Math.floor(Math.random() * cpu.skills.length)]
                const cpuResult = executeAttack(cpu, player, cpuSkill)
                setPlayer(prev => ({ ...prev, hp: Math.max(0, cpuResult.newHP) }))
                setLastMessage(cpuResult.message)

                if (cpuResult.fainted) {
                    setTimeout(() => {
                        setScreen("gameover")
                    }, 2000)
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