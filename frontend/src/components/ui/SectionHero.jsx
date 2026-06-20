// SectionHero.jsx
// Bloc d'en-tête de section réutilisable — titre, public cible, description, illustration
// Utilisé sur la page Missions pour introduire chaque type de mission
// Props :
//   title       : titre principal de la section
//   audience    : public cible affiché en petit texte accentué
//   description : phrase d'accroche
//   image       : illustration optionnelle (ligne décorative)

function SectionHero({ title, audience, description, image }) {
  return (
    <>
      {/* ── En-tête — titre + public + description + illustration ── */}
      <div className="flex items-center justify-between gap-12 mb-6">
        <div className="flex-1">

          {/* Titre de section */}
          <h2 className="section-title text-primary">{title}</h2>

          {/* Public cible */}
          <p className="font-body text-sm font-semibold text-accent uppercase tracking-widest mt-1 mb-2">
            {audience}
          </p>

          {/* Description courte */}
          <p className="font-body text-base text-primary/70">
            {description}
          </p>
        </div>

        {/* Illustration décorative — optionnelle */}
        {image && (
          <div className="w-1/3 shrink-0">
            <img src={image} alt="" aria-hidden="true" className="w-full object-contain max-h-40" />
          </div>
        )}
      </div>

      {/* Séparateur entre l'en-tête et le contenu de la section */}
      <hr className="border-surface-dark mb-10" />
    </>
  )
}

export default SectionHero