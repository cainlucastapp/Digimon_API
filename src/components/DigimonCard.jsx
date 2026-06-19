// src/components/DigimonCard.jsx

import { useState, useEffect } from "react"
import { useNavigate } from "react-router-dom"
import "../styles/DigimonCard.css"

function DigimonCard({ digimon, onClick }) {
    const navigate = useNavigate()

    // Image Load State
    const [imageLoaded, setImageLoaded] = useState(false)

    // Scan Time State
    const [minTimeElapsed, setMinTimeElapsed] = useState(false)

    // Scan Duration
    useEffect(() => {
        const timer = setTimeout(() => setMinTimeElapsed(true), 800)
        return () => clearTimeout(timer)
    }, [])

    // Show Image Once Loaded and Scan Time Has Passed
    const showImage = imageLoaded && minTimeElapsed

    // Handle Click
    const handleClick = () => {
        if (onClick) {
            onClick(digimon)
        } else {
            navigate(`/digimon/${digimon.id}`)
        }
    }

    return (
        <div className="card" onClick={handleClick}>
            <div className="card-header">
                <span className="card-name">{digimon.name}</span>
            </div>
            <div className="card-image-container">
                {!showImage && (
                    <div className="card-image-scan">
                        <div className="card-image-scan-line card-image-scan-line-1" />
                        <div className="card-image-scan-line card-image-scan-line-2" />
                        <div className="card-image-scan-line card-image-scan-line-3" />
                    </div>
                )}
                <img
                    src={digimon.images?.[0]?.href || digimon.image}
                    alt={digimon.name}
                    className="card-image"
                    style={{ display: showImage ? "block" : "none" }}
                    onLoad={() => setImageLoaded(true)}
                />
            </div>
            <div className="card-footer">
                <span className="card-id">#{digimon.id}</span>
            </div>
        </div>
    )
}

export default DigimonCard