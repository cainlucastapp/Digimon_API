// src/pages/List.jsx

import { useState, useCallback } from "react"
import { useParams, useNavigate } from "react-router-dom"
import useFetch from "../hooks/useFetch"
import { getDigimonList } from "../services/digimonApi"
import DigimonCard from "../components/DigimonCard"
import FilterBar from "../components/FilterBar"
import "../styles/List.css"

function List() {
  const { page: pageParam } = useParams()
  const navigate = useNavigate()
  const page = parseInt(pageParam || "1", 10)
  const apiPage = page - 1

  const [filters, setFilters] = useState({})
  const [filterOpen, setFilterOpen] = useState(false)

  const fetchList = useCallback(
    () => getDigimonList({ ...filters, page: apiPage, pageSize: 18 }),
    [filters, page]
  )
  const { data, loading, error } = useFetch(fetchList, [filters, page])

  const handleFilterChange = (newFilters) => {
    setFilters(newFilters)
    setFilterOpen(false)
    navigate(`/digimon/page/1`, { replace: true })
    window.scrollTo(0, 0)
  }

  const handlePrev = () => {
    navigate(`/digimon/page/${page - 1}`)
    window.scrollTo(0, 0)
  }

  const handleNext = () => {
    navigate(`/digimon/page/${page + 1}`)
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
        <button disabled={page === 1} onClick={handlePrev}>Prev</button>
        <span>{page} / {data?.pageable.totalPages}</span>
        <button disabled={page === data?.pageable.totalPages} onClick={handleNext}>Next</button>
      </div>
    </div>
  )
}

export default List