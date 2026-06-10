// src/pages/ShowDigimon.jsx

import { useParams } from "react-router-dom"
import { useCallback } from "react"
import useFetch from "../hooks/useFetch"
import { getDigimon } from "../services/digimonApi"
import EvolutionChain from "../components/EvolutionChain"
import "../styles/ShowDigimon.css"

function ShowDigimon() {
  const { id } = useParams()
  const fetchDigimon = useCallback(() => getDigimon(id), [id])
  const { data, loading, error } = useFetch(fetchDigimon, [id])

  if (loading) return <div className="show-loading">Loading...</div>
  if (error) return <div className="show-error">Error: {error}</div>

  return (
    <div className="show">
      <div className="show-main">

        <div className="show-left">
          <div className="show-left-header">
            <span className="show-name">{data.name}</span>
          </div>
          <img
            src={data.images?.[0]?.href}
            alt={data.name}
            className="show-image"
          />
          <div className="show-left-footer">
            <span className="show-id">#{data.id}</span>
            {data.xAntibody && <span className="show-xantibody">X</span>}
          </div>
        </div>

        <div className="show-right">
          <div className="show-badges">
            {data.levels?.map((l) => (
              <span key={l.id} className="show-badge show-badge-level">{l.level}</span>
            ))}
            {data.attributes?.map((a) => (
              <span key={a.id} className="show-badge show-badge-attribute">{a.attribute}</span>
            ))}
            {data.types?.map((t) => (
              <span key={t.id} className="show-badge show-badge-type">{t.type}</span>
            ))}
            {data.fields?.map((f) => (
              <img key={f.id} src={f.image} alt={f.field} className="show-field-icon" title={f.field} />
            ))}
          </div>

          <div className="show-description">
            {data.descriptions?.find(d => d.language === "en_us")?.description || "No description available."}
          </div>
        </div>

      </div>

      <div className="show-skills">
        <h3 className="show-section-title">Skills</h3>
        {data.skills?.map((s) => (
          <div key={s.id} className="show-skill">
            <span className="show-skill-name">{s.skill}</span>
            <p className="show-skill-desc">{s.description}</p>
          </div>
        ))}
      </div>
      <EvolutionChain prior={data.priorEvolutions} next={data.nextEvolutions} />
    </div>
  )
}

export default ShowDigimon