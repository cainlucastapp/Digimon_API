// src/pages/Hero.jsx

import { useCallback } from "react"
import useFetch from "../hooks/useFetch"
import { getRandomDigimon } from "../services/digimonApi"
import DigimonCard from "../components/DigimonCard"
import ErrorMessage from "../components/ErrorMessage"
import "../styles/Hero.css"

function Hero() {
  const fetchRandom = useCallback(() => getRandomDigimon(), [])
  const { data, loading, error } = useFetch(fetchRandom, [])

  if (loading) return <div className="hero-loading">Loading...</div>
  if (error) return <ErrorMessage message={error} />

  return (
    <div className="hero">
      <div className="hero-text">
        <h1 className="hero-title">Welcome to Digi Fight</h1>
        <p className="hero-body">
          Lorem ipsum dolor sit amet, consectetur adipiscing elit. Donec vel sapien eget nunc efficitur commodo. Sed at ligula a enim efficitur tincidunt. Curabitur ac odio id nisl convallis fermentum. 
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