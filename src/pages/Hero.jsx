// src/pages/Hero.jsx

import { useCallback } from "react"
import useFetch from "../hooks/useFetch"
import { getDigimonList } from "../services/digimonApi"
import DigimonCard from "../components/DigimonCard"
import "../styles/Hero.css"

function Hero() {
  const randomPage = Math.floor(Math.random() * 74)
  const fetchGrid = useCallback(() => getDigimonList({ page: randomPage, pageSize: 9 }), [])
  const { data, loading, error } = useFetch(fetchGrid, [])

  if (loading) return <div>Loading...</div>
  if (error) return <div>Error: {error}</div>

  return (
    <div className="hero">
      <div className="hero-grid">
        {data?.content.map((digimon) => (
          <DigimonCard key={digimon.id} digimon={digimon} />
        ))}
      </div>
    </div>
  )
}

export default Hero