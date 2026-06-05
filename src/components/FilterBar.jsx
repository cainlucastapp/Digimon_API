// src/components/FilterBar.jsx

import { useState, useCallback } from "react"
import useFetch from "../hooks/useFetch"
import { getAttributeList, getLevelList } from "../services/digimonApi"
import "../styles/FilterBar.css"

function FilterBar({ open, onClose, onFilterChange }) {
  const [selectedAttribute, setSelectedAttribute] = useState("")
  const [selectedLevel, setSelectedLevel] = useState("")

  const fetchAttributes = useCallback(() => getAttributeList(), [])
  const fetchLevels = useCallback(() => getLevelList(), [])

  const { data: attributes } = useFetch(fetchAttributes, [])
  const { data: levels } = useFetch(fetchLevels, [])

  const handleApply = () => {
    onFilterChange({
      attribute: selectedAttribute,
      level: selectedLevel,
    })
  }

  const handleClear = () => {
    setSelectedAttribute("")
    setSelectedLevel("")
    onFilterChange({})
  }

  return (
    <>
      <div className={`filterbar-overlay ${open ? "open" : ""}`} onClick={onClose} />
      <div className={`filterbar ${open ? "open" : ""}`}>
        <div className="filterbar-header">
          <h3>Filter Results</h3>
          <button className="filterbar-close" onClick={onClose}>✕</button>
        </div>

        <div className="filterbar-section">
          <h4>Attribute</h4>
          {attributes?.slice().sort((a, b) => a.name.localeCompare(b.name)).map((a) => (
            <label key={a.id} className="filterbar-option">
              <input
                type="radio"
                name="attribute"
                value={a.name}
                checked={selectedAttribute === a.name}
                onChange={() => setSelectedAttribute(a.name)}
              />
              {a.name}
            </label>
          ))}
        </div>

        <div className="filterbar-section">
          <h4>Level</h4>
          {levels?.slice().sort((a, b) => a.name.localeCompare(b.name)).map((l) => (
            <label key={l.id} className="filterbar-option">
              <input
                type="radio"
                name="level"
                value={l.name}
                checked={selectedLevel === l.name}
                onChange={() => setSelectedLevel(l.name)}
              />
              {l.name}
            </label>
          ))}
        </div>

        <div className="filterbar-actions">
          <button className="filterbar-clear" onClick={handleClear}>Clear</button>
          <button className="filterbar-apply" onClick={handleApply}>Apply</button>
        </div>
      </div>
    </>
  )
}

export default FilterBar