// src/pages/List.jsx

import { useCallback } from "react"
import useFetch from "../hooks/useFetch"
import { getDigimonList } from "../services/digimonApi"
import FilterBar from "../components/FilterBar"

function List() {
  const fetchList = useCallback(() => getDigimonList({ page: 0, pageSize: 20 }), [])
  const { data, loading, error } = useFetch(fetchList, [])

  if (loading) return <div>Loading...</div>
  if (error) return <div>Error: {error}</div>

  return (
    <div>
    <FilterBar />    
      {data?.content.map((d) => (
        <div key={d.id}>{d.name}</div>
      ))}
    </div>
  )
}

export default List