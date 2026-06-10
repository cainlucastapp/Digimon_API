// src/components/DigimonDetails.jsx

import "../styles/DigimonDetails.css"

function DigimonDetails({ data }) {
  return (
    <div className="details">
      <div className="details-badges">
        {data.levels?.map((l) => (
          <span key={l.id} className="details-badge details-badge-level">{l.level}</span>
        ))}
        {data.attributes?.map((a) => (
          <span key={a.id} className="details-badge details-badge-attribute">{a.attribute}</span>
        ))}
        {data.types?.map((t) => (
          <span key={t.id} className="details-badge details-badge-type">{t.type}</span>
        ))}
        {data.fields?.map((f) => (
          <img key={f.id} src={f.image} alt={f.field} className="details-field-icon" title={f.field} />
        ))}
      </div>

      <div className="details-description">
        {data.descriptions?.find(d => d.language === "en_us")?.description || "No description available."}
      </div>
    </div>
  )
}

export default DigimonDetails