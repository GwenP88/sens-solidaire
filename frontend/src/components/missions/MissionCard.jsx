// MissionCard.jsx
// Card mission — wrapper de BaseOverlayCard
// Badge type en haut | titre + description au centre | durée (optionnelle) + CTA en bas
// Soit navigue vers une URL (comportement par défaut), soit déclenche onClick
// (ex: ouvrir une modale) si ce prop est fourni — jamais les deux à la fois.

// ── Composants UI
import Button from '../ui/Button'
import BaseOverlayCard from '../ui/BaseOverlayCard'
import { IconClock } from '../../utils/icons'

function MissionCard({ image, badge, title, description, duration, slug, ctaLabel, ctaUrl, onClick }) {

  // ── Couleurs des badges par type de mission — inline car dynamiques
  const badgeColors = {
    'Volontariat individuel': '#2F8A3A',
    'Service civique': '#1D6FA4',
    'Groupe jeunes': '#8B5E3C',
    'Congé de solidarité': '#8B6914',
  }

  const content = (
    <BaseOverlayCard image={image} overlayClassName="bg-black/45" className="cursor-pointer">

      {/* Contenu — justify-between répartit les zones sur toute la hauteur */}
      <div className="h-full flex flex-col justify-between p-6">

        {/* Badge — haut */}
        <div className="w-fit">
          <span className="text-badge text-surface px-2 py-0.5 rounded uppercase tracking-wider" style={{ backgroundColor: badgeColors[badge] }}>
            {badge}
          </span>
        </div>

        {/* Centre — titre + description */}
        <div className="flex flex-col gap-xs">
          <h3 className="h3-style text-surface mb-0">{title}</h3>
          <p className="text-body text-surface line-clamp-3">{description}</p>
        </div>

        {/* Bas — durée (optionnelle) + bouton */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-xs">
          {duration ? (
            <span className="text-caption text-surface flex items-center gap-xs">
              <IconClock /> {duration}
            </span>
          ) : <span />}
          <Button label={ctaLabel} variant="primary" />
        </div>

      </div>
    </BaseOverlayCard>
  )

  // Modale (onClick fourni) → pas de navigation, juste un déclencheur
  if (onClick) {
    return (
      <div onClick={onClick} role="button" tabIndex={0}>
        {content}
      </div>
    )
  }

  // Comportement par défaut — navigation classique
  const href = ctaUrl || `/missions/${slug}`
  return <a href={href}>{content}</a>
}

export default MissionCard