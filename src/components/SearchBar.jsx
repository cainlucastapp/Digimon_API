// src/components/SearchBar.jsx

import { useRef } from "react"
import "../styles/SearchBar.css"

function SearchBar({ onSearch, defaultValue = "" }) {
  const inputRef = useRef(null)

  const handleSearch = (e) => {
    if (e.type === "click" || e.key === "Enter") {
      onSearch(inputRef.current.value)
    }
  }

  return (
    <div className="searchbar">
      <input
        className="searchbar-input"
        type="text"
        placeholder="Search by name..."
        defaultValue={defaultValue}
        ref={inputRef}
        onKeyDown={handleSearch}
      />
      <button className="searchbar-btn" onClick={handleSearch}>
        Search
      </button>
    </div>
  )
}

export default SearchBar