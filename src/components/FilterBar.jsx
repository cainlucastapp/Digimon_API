// src/components/FilterBar.jsx

import { useCallback } from "react"
import useFetch from "../hooks/useFetch"
import { getAttributeList, getLevelList } from "../services/digimonApi"

function FilterBar() {
  const fetchAttributes = useCallback(() => getAttributeList(), [])
  const fetchLevels = useCallback(() => getLevelList(), [])

  const { data: attributes, loading: attrLoading } = useFetch(fetchAttributes, [])
  const { data: levels, loading: levelLoading } = useFetch(fetchLevels, [])

  if (attrLoading || levelLoading) return <div>Loading filters...</div>

  return (
    <div>
      <div>
        <strong>Attributes:</strong>
        {attributes?.map((a) => <div key={a.id}>{a.name}</div>)}
      </div>
      <div>
        <strong>Levels:</strong>
        {levels?.map((l) => <div key={l.id}>{l.name}</div>)}
      </div>
    </div>
  )
}

export default FilterBar