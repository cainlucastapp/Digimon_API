// src/services/battleEngine.js

// Attribute Matchups
const ATTRIBUTE_MATCHUPS = {
    "Vaccine": "Virus",
    "Virus": "Data",
    "Data": "Vaccine",
}

// Level Modifier
const LEVEL_MODIFIER = {
    "Baby I": 1,
    "Baby II": 1,
    "Child": 2,
    "Adult": 3,
    "Perfect": 3.5,
    "Hybrid": 4,
    "Ultimate": 4.5,
    "Armor": 5,
    "Unknown": 5,
}

// Level Progression
export const LEVEL_PROGRESSION = [
    { player: "Baby I", cpuMain: "Baby I", cpuBonus: "Child" },
    { player: "Baby II", cpuMain: "Baby II", cpuBonus: "Child" },
    { player: "Child", cpuMain: "Child", cpuBonus: "Adult" },
    { player: "Adult", cpuMain: "Adult", cpuBonus: "Perfect" },
    { player: "Perfect", cpuMain: "Perfect", cpuBonus: "Hybrid" },
    { player: "Hybrid", cpuMain: "Hybrid", cpuBonus: "Ultimate" },
    { player: "Ultimate", cpuMain: "Ultimate", cpuBonus: "Ultimate" },
]

// Basic Attack Fallback
const BASIC_ATTACK = {
    id: 0,
    skill: "Strike",
    description: "A basic attack.",
}

// Get Level Modifier
const getLevelModifier = (digimon) => {
    const level = digimon?.levels?.[0]?.level || "Baby I"
    return LEVEL_MODIFIER[level] || 1
}

// Calc HP
export const calcHP = (digimon) => {
    if (!digimon?.name) return 50
    const modifier = getLevelModifier(digimon)
    return Math.round(50 * modifier + digimon.name.length)
}

// Get Attribute
export const getAttribute = (digimon) => {
    if (!digimon?.attributes || digimon.attributes.length === 0) return null
    return digimon.attributes[0].attribute
}

// Get Attribute Bonus
export const getAttributeBonus = (attackerAttribute, defenderAttribute) => {
    if (!attackerAttribute || !defenderAttribute) return 1
    if (ATTRIBUTE_MATCHUPS[attackerAttribute] === defenderAttribute) return 1.05
    return 1
}

// Calc Damage
export const calcDamage = (attacker, attackerMaxHP, defenderAttribute) => {
    if (!attacker?.name || !attackerMaxHP) return 5

    const modifier = getLevelModifier(attacker)
    const damagePercent = 0.20 + modifier * 0.01
    const baseDamage = Math.round(attackerMaxHP * damagePercent)
    const critBonus = Math.floor(Math.random() * 21)
    const attackerAttribute = getAttribute(attacker)
    const attributeBonus = getAttributeBonus(attackerAttribute, defenderAttribute)

    return Math.round((baseDamage + critBonus) * attributeBonus)
}

// Get Skills
export const getSkills = (digimon) => {
    if (!digimon?.skills || digimon.skills.length === 0) return [BASIC_ATTACK]
    const skills = digimon.skills.slice(0, 3)
    return skills.length > 0 ? skills : [BASIC_ATTACK]
}

// Get Random Skills
export const getRandomSkills = (digimon) => {
    const skills = getSkills(digimon)
    if (skills.length <= 3) return skills
    return [...skills].sort(() => Math.random() - 0.5).slice(0, 3)
}

// Should Evolve
export const shouldEvolve = () => Math.random() < 0.01

// Get Next Level
export const getNextLevel = (currentLevel) => {
    const currentIndex = LEVEL_PROGRESSION.findIndex(p => p.player === currentLevel)
    if (currentIndex === -1 || currentIndex === LEVEL_PROGRESSION.length - 1) return null
    return LEVEL_PROGRESSION[currentIndex + 1].player
}

// Get CPU Level for Round
export const getCPULevel = (round) => {
    const progression = LEVEL_PROGRESSION[round] || LEVEL_PROGRESSION[LEVEL_PROGRESSION.length - 1]
    return progression.cpuMain
}

// Get Player Level
export const getPlayerLevel = (round) => {
    const progression = LEVEL_PROGRESSION[round] || LEVEL_PROGRESSION[LEVEL_PROGRESSION.length - 1]
    return progression.player
}

// Apply Damage
export const applyDamage = (currentHP, damage) => {
    return Math.max(0, currentHP - damage)
}

// Is Fainted
export const isFainted = (hp) => hp <= 0