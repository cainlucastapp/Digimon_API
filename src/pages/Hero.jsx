// src/pages/Hero.jsx

import { useCallback } from "react"
import useFetch from "../hooks/useFetch"
import { getRandomDigimon } from "../services/digimonApi"

function Hero() {
  const fetchRandom = useCallback(() => getRandomDigimon(), [])
  const { data, loading, error } = useFetch(fetchRandom, [])

  if (loading) return <div>Loading...</div>
  if (error) return <div>Error: {error}</div>

  return <div>{data?.name}</div>
}

export default Hero