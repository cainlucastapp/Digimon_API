// src/services/battleEngine.js

import { getDigimon, getDigimonList } from "./digimonApi"

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

// Build Fighter from Digimon
export const buildFighter = (digimon) => ({
    digimon,
    hp: calcHP(digimon),
    maxHP: calcHP(digimon),
    skills: getRandomSkills(digimon),
})

/*Evolve Fighter to Next Valid Level*/
export const evolveFighter = async (fighter) => {
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

    // If stuck at Baby I with only Baby II evolution, chain to Child
    if (currentLevel === "Baby I") {
        const babyTwoOptions = evoDetails.filter(evo => evo.levels?.[0]?.level === "Baby II")
        for (const babyTwo of babyTwoOptions) {
            if (!babyTwo.nextEvolutions?.length) continue
            const chainDetails = await Promise.all(
                babyTwo.nextEvolutions.map(evo => getDigimon(evo.id))
            )
            const childOptions = chainDetails.filter(evo => evo.levels?.[0]?.level === "Child")
            if (childOptions.length > 0) {
                return childOptions[Math.floor(Math.random() * childOptions.length)]
            }
        }
    }

    return null
}

/*Execute Attack (shared by player and CPU)*/
export const executeAttack = (attacker, defender, skill) => {
    const defenderAttribute = getAttribute(defender.digimon)
    const damage = calcDamage(attacker.digimon, attacker.maxHP, defenderAttribute)
    const newHP = applyDamage(defender.hp, damage)
    const message = `${attacker.digimon.name} used ${skill.skill} for ${damage} damage!`
    const fainted = isFainted(newHP)

    return { newHP, message, fainted }
}

/*Get Random Digimon by Level*/
export const getRandomDigimonByLevel = async (level, count = 1) => {
    const res = await getDigimonList({ level, pageSize: 100 })
    const pool = res.content || []
    if (pool.length === 0) return []

    const shuffled = [...pool].sort(() => Math.random() - 0.5)
    const selected = shuffled.slice(0, count)
    return Promise.all(selected.map(d => getDigimon(d.id)))
}