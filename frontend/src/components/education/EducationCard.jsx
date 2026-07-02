// EducationCard.jsx
// Card atelier éducatif — wrapper de BaseContentCard
// Zone haute : type + public | Zone centrale : titre + description | Zone basse : CTA

// ── Router
import { Link } from 'react-router-dom'

// ── Composants UI
import BaseContentCard from '../ui/BaseContentCard'

// ── Helper — traduit les codes public en labels lisibles
const formatPublic = (pub) => pub.split(',').map(p => {
  if (p === 'primaire') return 'Maternelle & Primaire'
  if (p === 'college_lycee') return 'Collège & Lycée'
  if (p === 'adultes') return 'Adultes & Étudiants'
  return p
}).join(' · ')

function EducationCard({ item }) {
  const isPdf = item.external_url && !item.content
  const ctaLabel = isPdf ? 'Découvrir l\'atelier →' : 'En savoir plus →'

  return (
    <BaseContentCard
      image={item.image_url}
      fallbackImage="/images/placeholders/placeholder-educ-1.png"
      alt={item.title}
    >

      {/* ── Zone haute — type + public cible ── */}
      <div className="flex items-center gap-xs flex-wrap">
        <span className="text-eyebrow text-accent-2 mb-0">{item.type}</span>
        <span className="text-caption text-primary/30">—</span>
        <span className="text-caption text-primary/50">{formatPublic(item.public)}</span>
      </div>

      {/* ── Zone centrale — titre + description ── */}
      <div className="flex flex-col gap-xs flex-1 pt-6">
        <h3 className="h3-style text-primary line-clamp-2 mb-0">{item.title}</h3>
        <p className="text-body text-primary/60 line-clamp-3">{item.description}</p>
      </div>

      {/* ── Zone basse — CTA ── */}
      <div>
        {isPdf ? (
          <a href={item.external_url} target="_blank" rel="noopener noreferrer" className="link-cta text-accent hover:text-accent/80">
            {ctaLabel}
          </a>
        ) : (
          <Link to={`/education-sensibilisation/${item.slug}`} className="link-cta text-accent hover:text-accent/80">
            {ctaLabel}
          </Link>
        )}
      </div>

    </BaseContentCard>
  )
}

export default EducationCard