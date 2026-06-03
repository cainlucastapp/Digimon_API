// src/pages/ShowDigimon.jsx

import { useParams } from "react-router-dom"
import { useCallback } from "react"
import useFetch from "../hooks/useFetch"
import { getDigimon } from "../services/digimonApi"

function ShowDigimon() {
  const { id } = useParams()
  const fetchDigimon = useCallback(() => getDigimon(id), [id])
  const { data, loading, error } = useFetch(fetchDigimon, [id])

  if (loading) return <div>Loading...</div>
  if (error) return <div>Error: {error}</div>

  return <div>{data?.name}</div>
}

export default ShowDigimon