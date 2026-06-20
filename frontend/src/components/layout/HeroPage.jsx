// HeroPage.jsx
// Hero secondaire réutilisable pour toutes les pages intérieures
// Plus compact que le Hero home — pas de CTA, juste titre + sous-titre
// Props optionnelles : duration, price — affichées uniquement sur les pages mission détail

// ── Composants UI
import { IconClock, IconMoney } from '../../utils/icons'

function HeroPage({ image, title, subtitle, duration, price }) {
  return (
    <div className="relative w-full h-120 flex items-end pb-12 px-24">
      {/* Image de fond */}
      <div
        className="absolute inset-0 bg-cover bg-center"
        style={{ backgroundImage: `url(${image})` }}
      ></div>
      {/* Overlay sombre */}
      <div className="absolute inset-0 bg-black/50"></div>

      {/* Contenu */}
      <div className="relative flex flex-col gap-2">
        {/* Eyebrow */}
        <span className="font-body font-bold text-surface text-lg uppercase tracking-widest">
          Sens Solidaire
        </span>
        {/* Titre */}
        <h1 className="font-heading font-bold text-surface text-6xl max-w-3xl leading-tight">{title}</h1>
        {/* Sous-titre */}
        {subtitle && (
          <p className="font-body font-semibold text-surface text-lg max-w-2xl">{subtitle}</p>
        )}
        {/* Infos rapides — durée + prix — optionnelles */}
        {(duration || price) && (
          <div className="flex gap-6 mt-2">
            {duration && (
              <span className="flex items-center gap-2 font-body text-sm text-surface/80">
                <IconClock className="text-surface text-base" />
                {duration}
              </span>
            )}
            {price && (
              <span className="flex items-center gap-2 font-body text-sm text-surface/80">
                <IconMoney className="text-surface text-base" />
                À partir de {price} €
              </span>
            )}
          </div>
        )}
      </div>
    </div>
  )
}

export default HeroPage