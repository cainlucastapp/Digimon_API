// src/pages/ShowDigimon.jsx

import { useParams } from "react-router-dom"
import { useCallback } from "react"
import useFetch from "../hooks/useFetch"
import NotFound from "./NotFound"
import { getDigimon } from "../services/digimonApi"
import DigimonCard from "../components/DigimonCard"
import DigimonDetails from "../components/DigimonDetails"
import DigimonSkills from "../components/DigimonSkills"
import ErrorMessage from "../components/ErrorMessage"
import EvolutionChain from "../components/EvolutionChain"
import Spinner from "../components/Spinner"
import "../styles/ShowDigimon.css"

function ShowDigimon() {
  const { id } = useParams()
  const fetchDigimon = useCallback(() => getDigimon(id), [id])
  const { data, loading, error } = useFetch(fetchDigimon, [id])

  // Loading State
  if (loading) return <Spinner />

  //Error State
  if (error) {
    if (error.includes("not found") || error.includes("status 400") || error.includes("status 404")) return <NotFound />
    return <ErrorMessage message={error} />
  }

  return (
    <div className="show">
      <div className="show-main">
        <div className="show-left">
          <DigimonCard digimon={data} onClick={() => {}} />
        </div>
        <div className="show-right">
          <DigimonDetails data={data} />
        </div>
      </div>
      <DigimonSkills skills={data.skills} />
      <EvolutionChain prior={data.priorEvolutions} next={data.nextEvolutions} />
    </div>
  )
}

export default ShowDigimon