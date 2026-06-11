// src/pages/List.jsx

import { useState, useCallback } from "react"
import { useSearchParams } from "react-router-dom"
import useFetch from "../hooks/useFetch"
import { getDigimonList } from "../services/digimonApi"
import DigimonCard from "../components/DigimonCard"
import FilterBar from "../components/FilterBar"
import SearchBar from "../components/SearchBar"
import "../styles/List.css"

function List() {

  // URL Search Params
  const [searchParams, setSearchParams] = useSearchParams()

  // Filter Panel State
  const [filterOpen, setFilterOpen] = useState(false)

  // Read Params from URL
  const page = parseInt(searchParams.get("page") || "0")
  const attribute = searchParams.get("attribute") || ""
  const level = searchParams.get("level") || ""
  const name = searchParams.get("name") || ""

  // Fetch Digimon List
  const fetchList = useCallback(
    () => getDigimonList({ page, pageSize: 18, attribute, level, name }),
    [page, attribute, level, name]
  )
  const { data, loading, error } = useFetch(fetchList, [page, attribute, level, name])

  // Handle Search Submit
  const handleSearch = (value) => {
    setSearchParams({
      page: 0,
      ...(value && { name: value }),
      ...(attribute && { attribute }),
      ...(level && { level }),
    })
  }

  // Handle Filter Change
  const handleFilterChange = (newFilters) => {
    setSearchParams({
      page: 0,
      ...(name && { name }),
      ...(newFilters.attribute && { attribute: newFilters.attribute }),
      ...(newFilters.level && { level: newFilters.level }),
    })
    setFilterOpen(false)
  }

  // Handle Pagination
  const handlePrev = () => {
    setSearchParams({ page: page - 1, attribute, level, name })
    window.scrollTo(0, 0)
  }

  const handleNext = () => {
    setSearchParams({ page: page + 1, attribute, level, name })
    window.scrollTo(0, 0)
  }

  // Loading and Error States
  if (loading) return <div>Loading...</div>
  if (error) return <div>Error: {error}</div>

  return (
    <div className="list">
      <div className="list-topbar">
        <span className="list-results">{data?.pageable.totalElements} Results</span>
        <SearchBar defaultValue={name} onSearch={handleSearch} />
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
        {!data?.content || data.content.length === 0 ? (
          <div className="list-no-results">No Digimon found. Try a different search or filter.</div>
        ) : (
          data.content.map((digimon) => (
            <DigimonCard key={digimon.id} digimon={digimon} />
          ))
        )}
      </div>

      {data?.pageable.totalElements > 0 && (
        <div className="list-pagination">
          <button disabled={page === 0} onClick={handlePrev}>Prev</button>
          <span>{page + 1} / {data?.pageable.totalPages}</span>
          <button disabled={page + 1 >= data?.pageable.totalPages} onClick={handleNext}>Next</button>
        </div>
      )} 

    </div>
  )
}

export default List