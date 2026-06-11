// src/pages/List.jsx

import { useState, useCallback } from "react"
import { useSearchParams } from "react-router-dom"
import useFetch from "../hooks/useFetch"
import { getDigimonList } from "../services/digimonApi"
import DigimonCard from "../components/DigimonCard"
import FilterBar from "../components/FilterBar"
import "../styles/List.css"

function List() {
  const [searchParams, setSearchParams] = useSearchParams()
  const [filterOpen, setFilterOpen] = useState(false)

  const page = parseInt(searchParams.get("page") || "0")
  const attribute = searchParams.get("attribute") || ""
  const level = searchParams.get("level") || ""

  const fetchList = useCallback(
    () => getDigimonList({ page, pageSize: 18, attribute, level }),
    [page, attribute, level]
  )
  const { data, loading, error } = useFetch(fetchList, [page, attribute, level])

  const handleFilterChange = (newFilters) => {
    setSearchParams({
      page: 0,
      ...(newFilters.attribute && { attribute: newFilters.attribute }),
      ...(newFilters.level && { level: newFilters.level }),
    })
    setFilterOpen(false)
  }

  const handlePrev = () => {
    setSearchParams({ page: page - 1, attribute, level })
    window.scrollTo(0, 0)
  }

  const handleNext = () => {
    setSearchParams({ page: page + 1, attribute, level })
    window.scrollTo(0, 0)
  }

  if (loading) return <div>Loading...</div>
  if (error) return <div>Error: {error}</div>

  return (
    <div className="list">
      <div className="list-topbar">
        <span className="list-results">{data?.pageable.totalElements} Results</span>
        <button className="list-filter-btn" onClick={() => setFilterOpen(!filterOpen)}>
          Filter
        </button>
      </div>

      <FilterBar
        open={filterOpen}
        onClose={() => setFilterOpen(false)}
        onFilterChange={handleFilterChange}
      />

      <div className="list-grid">
        {data?.content.map((digimon) => (
          <DigimonCard key={digimon.id} digimon={digimon} />
        ))}
      </div>

      <div className="list-pagination">
        <button disabled={page === 0} onClick={handlePrev}>Prev</button>
        <span>{page + 1} / {data?.pageable.totalPages}</span>
        <button disabled={page + 1 === data?.pageable.totalPages} onClick={handleNext}>Next</button>
      </div>
    </div>
  )
}

export default List