// EducationCard.jsx
// Card d'un atelier éducatif — image, type, public, titre, description, CTA
// Logique : si external_url sans contenu → lien PDF direct | sinon → page détail interne

// ── Router
import { Link } from 'react-router-dom'

// ── Helper — traduit les codes public en labels lisibles
const formatPublic = (pub) => pub.split(',').map(p => {
  if (p === 'primaire') return 'Maternelle & Primaire'
  if (p === 'college_lycee') return 'Collège & Lycée'
  if (p === 'adultes') return 'Adultes & Étudiants'
  return p
}).join(' · ')

function EducationCard({ item }) {
  // ── Logique CTA — PDF direct si external_url sans contenu long, sinon page détail
  const isPdf = item.external_url && !item.content
  const ctaLabel = isPdf ? 'Découvrir l\'atelier →' : 'En savoir plus →'

  return (
    <article className="flex flex-col bg-surface rounded-2xl overflow-hidden shadow-sm hover:shadow-md transition-shadow">

      {/* ── Image de couverture ── */}
      <div className="w-full h-48 overflow-hidden">
        <img
          src={item.image_url || '/images/placeholders/placeholder-educ-1.png'}
          alt={item.title}
          className="w-full h-full object-cover"
        />
      </div>

      {/* ── Contenu de la card ── */}
      <div className="flex flex-col gap-3 p-6 flex-1">

        {/* Type et public cible */}
        <div className="flex items-center gap-2 flex-wrap">
          <span className="font-body text-xs font-bold text-accent-2">{item.type}</span>
          <span className="font-body text-xs text-primary/30">—</span>
          <span className="font-body text-xs text-primary/50">{formatPublic(item.public)}</span>
        </div>

        {/* Titre */}
        <h3 className="font-heading font-bold text-primary text-base leading-snug">{item.title}</h3>

        {/* Description courte */}
        <p className="font-body text-sm text-primary/60 leading-relaxed flex-1 line-clamp-3">
          {item.description}
        </p>

        {/* CTA — PDF externe ou page détail interne */}
        <div className="mt-2">
          {isPdf ? (
            <a
              href={item.external_url}
              target="_blank"
              rel="noopener noreferrer"
              className="font-body text-sm font-bold text-accent hover:text-accent/80 transition-colors"
            >
              {ctaLabel}
            </a>
          ) : (
            <Link
              to={`/actions-educatives/${item.slug}`}
              className="font-body text-sm font-bold text-accent hover:text-accent/80 transition-colors"
            >
              {ctaLabel}
            </Link>
          )}
        </div>

      </div>
    </article>
  )
}

export default EducationCard