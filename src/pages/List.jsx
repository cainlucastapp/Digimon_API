// src/pages/List.jsx

import { useState, useCallback } from "react"
import useFetch from "../hooks/useFetch"
import { getDigimonList } from "../services/digimonApi"
import DigimonCard from "../components/DigimonCard"
import FilterBar from "../components/FilterBar"
import "../styles/List.css"

function List() {
  const [filters, setFilters] = useState({ page: 0, pageSize: 20 })
  const [filterOpen, setFilterOpen] = useState(false)

  const fetchList = useCallback(() => getDigimonList(filters), [filters])
  const { data, loading, error } = useFetch(fetchList, [filters])

  const handleFilterChange = (newFilters) => {
    setFilters({ ...newFilters, page: 0, pageSize: 20 })
    setFilterOpen(false)
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
        <button
          disabled={data?.pageable.currentPage === 0}
          onClick={() => setFilters({ ...filters, page: filters.page - 1 })}
        >
          Prev
        </button>
        <span>{data?.pageable.currentPage + 1} / {data?.pageable.totalPages}</span>
        <button
          disabled={data?.pageable.currentPage + 1 === data?.pageable.totalPages}
          onClick={() => setFilters({ ...filters, page: filters.page + 1 })}
        >
          Next
        </button>
      </div>
    </div>
  )
}

export default List