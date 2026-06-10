// src/components/DigimonSkills.jsx

import "../styles/DigimonSkills.css"

function DigimonSkills({ skills }) {
  if (!skills || skills.length === 0) return null

  return (
    <div className="skills">
      <h3 className="skills-title">Skills</h3>
      {skills.map((s) => (
        <div key={s.id} className="skills-item">
          <span className="skills-name">{s.skill}</span>
          <p className="skills-desc">{s.description}</p>
        </div>
      ))}
    </div>
  )
}

export default DigimonSkills