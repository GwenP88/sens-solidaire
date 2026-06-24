// MissionSteps.jsx
// Bloc "Comment ça fonctionne" — 3 étapes avec icône, numéro, titre, description et liste

function MissionSteps({ title = 'Comment ça fonctionne ?', steps, bgCard = 'bg-white' }) {
  return (
    <div>

      {/* Titre de la section */}
      <h3 className="h3-style text-primary text-center mb-6">
        {title}
      </h3>

      {/* Grille 3 colonnes — 1 colonne sur mobile */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 items-stretch">
        {steps.map((step, i) => {
          // ── Icône dynamique — majuscule requise pour JSX
          const Icon = step.icon
          return (
            <div key={i} className={`${bgCard} rounded-xl p-6 flex flex-col gap-3 h-full`}>

              {/* En-tête — icône + numéro + titre */}
              <div className="flex items-center gap-4">
                <Icon className="text-primary text-3xl shrink-0" />
                <span className="text-stat text-primary">{i + 1}</span>
                <div>
                  <h4 className="h3-style text-primary">{step.title}</h4>
                  <p className="text-caption text-primary/60">{step.subtitle}</p>
                </div>
              </div>

              {/* Description */}
              <p className="text-body text-primary/80 min-h-[80px]">
                {step.description}
              </p>

              {/* Liste de points */}
              <ul className="flex flex-col gap-1">
                {step.list.map(item => (
                  <li key={item} className="text-body text-primary/60">- {item}</li>
                ))}
              </ul>

            </div>
          )
        })}
      </div>
    </div>
  )
}

export default MissionSteps