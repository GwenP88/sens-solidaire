// HeroPage.jsx
// Hero secondaire réutilisable pour toutes les pages intérieures
// Plus compact que le Hero home — pas de CTA, juste titre + sous-titre
// Props optionnelles : duration, price — affichées uniquement sur les pages mission détail

// ── Composants UI
import { IconClock, IconMoney } from '../../utils/icons'

function HeroPage({ image, title, subtitle, duration, price }) {
  return (
    <div className="relative w-full h-64 md:h-120 flex items-end pb-6 px-6 md:pb-12 md:px-24">

      {/* Image de fond */}
      <div
        className="absolute inset-0 bg-cover bg-center"
        style={{ backgroundImage: `url(${image})` }}
      ></div>

      {/* Overlay sombre */}
      <div className="absolute inset-0 bg-black/50"></div>

      {/* Contenu */}
      <div className="relative flex flex-col gap-2">

        {/* Surtitre */}
        <span className="text-eyebrow text-surface">
          Sens Solidaire
        </span>

        {/* Titre */}
        <h1 className="h1-style text-surface max-w-3xl">{title}</h1>

        {/* Sous-titre */}
        {subtitle && (
          <p className="text-lead text-surface max-w-2xl">{subtitle}</p>
        )}

        {/* Infos rapides — durée + prix — optionnelles */}
        {(duration || price) && (
          <div className="flex gap-6 mt-2">
            {duration && (
              <span className="text-body text-surface/80 flex items-center gap-2">
                <IconClock className="text-surface text-base" />
                {duration}
              </span>
            )}
            {price && (
              <span className="text-body text-surface/80 flex items-center gap-2">
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