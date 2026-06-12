// src/pages/Hero.jsx

import { useCallback } from "react"
import useFetch from "../hooks/useFetch"
import { getRandomDigimon } from "../services/digimonApi"
import DigimonCard from "../components/DigimonCard"
import ErrorMessage from "../components/ErrorMessage"
import Spinner from "../components/Spinner"
import "../styles/Hero.css"

function Hero() {
  const fetchRandom = useCallback(() => getRandomDigimon(), [])
  const { data, loading, error } = useFetch(fetchRandom, [])

  // Loading State
  if (loading) return <Spinner />

  //Error State
  if (error) return <ErrorMessage message={error} />

  return (
    <div className="hero">
      <div className="hero-text">
        <h1 className="hero-title">Welcome to Digi Fight</h1>
        <p className="hero-body">
          Explore a database of over 1,400 Digimon then send them into intense one-on-one battles to prove their strength.

          Watch your Digimon grow through victory, unlock new evolutions, and discover how each form changes the course of battle. 
        </p>
        <a href="/digimon" className="hero-btn">Browse All Digimon</a>
      </div>
      <div className="hero-card">
        {data && <DigimonCard digimon={data} />}
      </div>
    </div>
  )
}

export default Hero