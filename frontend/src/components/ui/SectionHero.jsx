// components/ui/SectionHero.jsx
// Bloc d'en-tête réutilisable — titre, public cible, description, illustration optionnelle

function SectionHero({ title, audience, description, image }) {
  return (
    <>
      <div className="flex items-center justify-between gap-12 mb-6">
        <div className="flex-1">
          <h2 className="section-title text-primary">{title}</h2>
          <p className="font-body text-sm font-semibold text-accent uppercase tracking-widest mt-1 mb-2">
            {audience}
          </p>
          <p className="font-body text-base text-primary/70">
            {description}
          </p>
        </div>
        {image && (
          <div className="w-1/3 shrink-0">
            <img src={image} alt="" aria-hidden="true" className="w-full object-contain max-h-40" />
          </div>
        )}
      </div>
      {/* Séparateur entre l'en-tête et le contenu */}
      <hr className="border-surface-dark mb-10" />
    </>
  )
}

export default SectionHero