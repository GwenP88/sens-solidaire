// HeroPage.jsx
// Hero secondaire réutilisable pour toutes les pages intérieures
// Plus compact que le Hero home — pas de CTA, juste titre + sous-titre
// Props optionnelles : duration, price — affichées uniquement sur les pages mission détail

// ── Composants UI
import { IconClock, IconMoney, IconPin, IconPerson } from '../../utils/icons'

function HeroPage({ image, title, subtitle, duration, price, age, country, tags }) {
  return (
    <div className="relative w-full h-80 md:h-96 lg:h-120 flex items-end padding-x hero-page-py">

      <div className="absolute inset-0 bg-cover bg-center" style={{ backgroundImage: `url(${image})` }}></div>
      <div className="absolute inset-0 bg-black/50"></div>

      {/* gap-xs gère l'espacement entre tous les enfants — text-eyebrow et text-lead
          neutralisés (mb-0) pour éviter le cumul avec ce gap */}
      <div className="relative flex flex-col gap-xs">

        <span className="text-eyebrow text-surface">Sens Solidaires</span>
        <h1 className="h1-style text-surface max-w-5xl">{title}</h1>

        {subtitle && <p className="text-lead text-surface max-w-4xl">{subtitle}</p>}

        {/* Infos rapides — durée + prix + age — missions détail */}
        {(duration || price || age) && (
          <div className="flex gap-md">
            {duration && (
              <span className="text-body text-surface/80 flex items-center gap-xs">
                <IconClock className="text-surface text-base" />{duration}
              </span>
            )}
            {price && (
              <span className="text-body text-surface/80 flex items-center gap-xs">
                <IconMoney className="text-surface text-base" />À partir de {price} €
              </span>
            )}
            {age && (
              <span className="text-body text-surface/80 flex items-center gap-xs">
                <IconPerson className="text-surface text-base" />{age}
              </span>
            )}
          </div>
        )}

        {/* Infos rapides — pays + tags — actions détail */}
        {(country || tags?.length > 0) && (
          <div className="flex flex-wrap items-center gap-md">
            {country && (
              <span className="text-body text-surface/80 flex items-center gap-xs">
                <IconPin className="text-surface text-base" />{country}
              </span>
            )}
            <div className="flex flex-wrap gap-xs">
              {tags?.map(tag => (
                <span key={tag} className="text-caption text-surface/70 px-3 py-1 rounded-full border border-surface/40">
                  {tag}
                </span>
              ))}
            </div>
          </div>
        )}

      </div>
    </div>
  )
}

export default HeroPage