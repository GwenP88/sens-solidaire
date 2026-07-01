// MissionSteps.jsx
// Bloc "Comment ça fonctionne" — 3 étapes avec icône, numéro, titre, description et liste

function MissionSteps({ title = 'Comment ça fonctionne ?', steps, bgCard = 'bg-white' }) {
  return (
    <div>

      {/* Titre de la section — h3-style porte sa propre marge, pas de mb- en dur */}
      <h3 className="h3-style text-primary text-center">
        {title}
      </h3>

      {/* Grille 3 colonnes desktop — 1 colonne autres */}
      <div className="grid grid-cols-1 xl:grid-cols-3 gap-md items-stretch mt-8">
        {steps.map((step, i) => {
          const Icon = step.icon
          return (
            <div key={i} className={`${bgCard} rounded-xl p-6 flex flex-col gap-xs h-full`}>

              {/* En-tête — icône + numéro + titre */}
              {/* h3-style mb-0 : dans flex flex-col gap-xs, marge redondante avec gap */}
              <div className="flex items-center gap-sm">
                <Icon className="text-primary text-3xl shrink-0" />
                <span className="text-stat text-primary">{i + 1}</span>
                <div>
                  <h4 className="h3-style text-primary mb-0">{step.title}</h4>
                  <p className="text-caption text-primary/60">{step.subtitle}</p>
                </div>
              </div>

              {/* Description */}
              <p className="text-body text-primary/80 min-h-[80px]">
                {step.description}
              </p>

              {/* Liste de points */}
              <ul className="flex flex-col gap-xs">
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