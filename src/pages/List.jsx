// src/pages/List.jsx

import { useState, useCallback } from "react"
import { useSearchParams } from "react-router-dom"
import useFetch from "../hooks/useFetch"
import { getDigimonList } from "../services/digimonApi"
import DigimonCard from "../components/DigimonCard"
import ErrorMessage from "../components/ErrorMessage"
import FilterBar from "../components/FilterBar"
import SearchBar from "../components/SearchBar"
import Spinner from "../components/Spinner"
import "../styles/List.css"

function List() {

  // URL Search Params
  const [searchParams, setSearchParams] = useSearchParams()

  // Filter Panel State
  const [filterOpen, setFilterOpen] = useState(false)

  // Read Params from URL
  const pageParam = parseInt(searchParams.get("page") || "1")
  const page = pageParam - 1 // convert to 0-based for API
  const attribute = searchParams.get("attribute") || ""
  const level = searchParams.get("level") || ""
  const name = searchParams.get("name") || ""

  // Build Clean Params
  const buildParams = (newPage, newAttribute, newLevel, newName) => ({
    page: newPage + 1, // convert back to 1-based for URL
    ...(newAttribute && { attribute: newAttribute }),
    ...(newLevel && { level: newLevel }),
    ...(newName && { name: newName }),
  })

  // Fetch Digimon List
  const fetchList = useCallback(
    () => getDigimonList({ page, pageSize: 18, attribute, level, name }),
    [page, attribute, level, name]
  )
  const { data, loading, error } = useFetch(fetchList, [page, attribute, level, name])

  // Handle Search Submit
  const handleSearch = (value) => {
    setSearchParams(buildParams(0, attribute, level, value))
  }

  // Handle Filter Change
  const handleFilterChange = (newFilters) => {
    setSearchParams(buildParams(0, newFilters.attribute, newFilters.level, name))
    setFilterOpen(false)
  }

  // Handle Pagination
  const handlePrev = () => {
    setSearchParams(buildParams(page - 1, attribute, level, name))
    window.scrollTo(0, 0)
  }

  const handleNext = () => {
    setSearchParams(buildParams(page + 1, attribute, level, name))
    window.scrollTo(0, 0)
  }

  // Redirect to last page if out of range
  if (data && pageParam > data.pageable.totalPages) {
    setSearchParams(buildParams(data.pageable.totalPages - 1, attribute, level, name))
    return null
  }

  // Loading State
  if (loading) return <Spinner />

  // Error State
  if (error) return <ErrorMessage message={error} />

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
          <button disabled={pageParam === 1} onClick={handlePrev}>Prev</button>
          <span>{pageParam} / {data?.pageable.totalPages}</span>
          <button disabled={pageParam >= data?.pageable.totalPages} onClick={handleNext}>Next</button>
        </div>
      )}

    </div>
  )
}

export default List