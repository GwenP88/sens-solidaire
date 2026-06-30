// EducationCard.jsx
// Card d'un atelier éducatif — image, type, public, titre, description, CTA
// Logique : si external_url sans contenu → lien PDF direct | sinon → page détail interne
// Layout : portrait (image haut / contenu bas) en mobile et à partir de 1024px
//          paysage (image gauche / contenu droite) uniquement entre 768px et 1024px
// Hauteur fixe dans les deux layouts — garantit des cards identiques dans la grille

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
    // ── flex-col par défaut (portrait) → md:flex-row (paysage 768-1023px) → lg:flex-col (retour portrait dès 1024px)
    <article className="flex flex-col md:flex-row lg:flex-col h-[420px] md:h-[240px] lg:h-[450px] bg-surface rounded-2xl overflow-hidden shadow-sm hover:shadow-md transition-shadow">

      {/* Image — hauteur fixe en portrait, largeur fixe en paysage, shrink-0 dans les deux cas */}
      <div className="w-full h-48 md:w-64 md:h-full lg:w-full lg:h-48 shrink-0 overflow-hidden">
        <img
          src={item.image_url || '/images/placeholders/placeholder-educ-1.png'}
          alt={item.title}
          className="w-full h-full object-cover"
        />
      </div>

      {/* Contenu — occupe le reste de l'espace, 3 zones réparties par justify-between */}
      <div className="flex flex-col justify-between flex-1 min-w-0 p-6 md:p-5 lg:p-6">

        {/* ── Zone haute — type + public cible ── */}
        <div className="flex items-center gap-2 flex-wrap">
          <span className="text-eyebrow text-accent-2">{item.type}</span>
          <span className="text-caption text-primary/30">—</span>
          <span className="text-caption text-primary/50">{formatPublic(item.public)}</span>
        </div>

        {/* ── Zone centrale — titre (2 lignes max) + description (3 lignes max) ── */}
        <div className="flex flex-col gap-2 flex-1 justify-center">
          <h3 className="h3-style text-primary line-clamp-2">{item.title}</h3>
          <p className="text-body text-primary/60 line-clamp-3">{item.description}</p>
        </div>

        {/* ── Zone basse — CTA, PDF externe ou page détail interne ── */}
        <div>
          {isPdf ? (
            <a
              href={item.external_url}
              target="_blank"
              rel="noopener noreferrer"
              className="link-cta text-accent hover:text-accent/80"
            >
              {ctaLabel}
            </a>
          ) : (
            <Link
              to={`/actions-educatives/${item.slug}`}
              className="link-cta text-accent hover:text-accent/80"
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