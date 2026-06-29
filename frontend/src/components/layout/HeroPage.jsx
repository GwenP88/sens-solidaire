// HeroPage.jsx
// Hero secondaire réutilisable pour toutes les pages intérieures
// Plus compact que le Hero home — pas de CTA, juste titre + sous-titre
// Props optionnelles : duration, price — affichées uniquement sur les pages mission détail

// ── Composants UI
import { IconClock, IconMoney, IconPin } from '../../utils/icons'

function HeroPage({ image, title, subtitle, duration, price, country, tags }) {
  return (
    <div className="relative w-full h-64 md:h-120 flex items-end pb-6 px-6 md:pb-12 md:px-24">

      <div className="absolute inset-0 bg-cover bg-center" style={{ backgroundImage: `url(${image})` }}></div>
      <div className="absolute inset-0 bg-black/50"></div>

      <div className="relative flex flex-col gap-2">

        <span className="text-eyebrow text-surface">Sens Solidaire</span>
        <h1 className="h1-style text-surface max-w-3xl">{title}</h1>

        {subtitle && <p className="text-lead text-surface max-w-2xl">{subtitle}</p>}

        {/* Infos rapides — durée + prix — missions détail */}
        {(duration || price) && (
          <div className="flex gap-6 mt-2">
            {duration && (
              <span className="text-body text-surface/80 flex items-center gap-2">
                <IconClock className="text-surface text-base" />{duration}
              </span>
            )}
            {price && (
              <span className="text-body text-surface/80 flex items-center gap-2">
                <IconMoney className="text-surface text-base" />À partir de {price} €
              </span>
            )}
          </div>
        )}

        {/* Infos rapides — pays + tags — actions détail */}
        {(country || tags?.length > 0) && (
        <div className="flex flex-wrap items-center gap-8 mt-2">
          {country && (
            <span className="text-body text-surface/80 flex items-center gap-1">
              <IconPin className="text-surface text-base" />{country}
            </span>
          )}
          {country && tags?.length > 0 && (
            <span className="text-surface/40">|</span>
          )}
          <div className="flex flex-wrap gap-2">
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