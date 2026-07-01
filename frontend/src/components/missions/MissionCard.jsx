// MissionCard.jsx
// Carte mission — image immersive, badge, titre, description, durée, CTA

// ── Composants UI
import Button from '../ui/Button'
import { IconClock } from '../../utils/icons'

function MissionCard({ image, badge, title, description, duration, slug, ctaLabel, ctaUrl }) {

  // ── Couleurs des badges par type de mission — inline car dynamique (Tailwind ne peut pas générer dynamiquement)
  const badgeColors = {
    'Volontariat individuel': '#2F8A3A',
    'Service civique': '#1D6FA4',
    'Groupe jeunes': '#8B5E3C',
    'Congé solidaire': '#8B6914',
  }

  // ── Lien = ctaUrl si fourni, sinon construit depuis le slug
  const href = ctaUrl || `/missions/${slug}`

  return (
    <a href={href}>
      <article className="w-full h-[320px] md:h-[260px] lg:h-[320px] xl:h-[260px] rounded-[20px] relative overflow-hidden cursor-pointer">

        {/* Image de fond */}
        <div className="absolute inset-0 bg-cover bg-center" style={{ backgroundImage: `url(${image})` }}></div>

        {/* Overlay sombre */}
        <div className="absolute inset-0 bg-black/45"></div>

        {/* Contenu — justify-between répartit les 3 zones sur toute la hauteur */}
        <div className="relative h-full flex flex-col justify-between p-6">

          {/* Badge — haut */}
          <div className="w-fit">
            <span className="text-eyebrow text-surface px-2 py-1 rounded" style={{ backgroundColor: badgeColors[badge] }}>
              {badge}
            </span>
          </div>

          {/* Centre — titre + description */}
          {/* h3-style mb-0 : dans justify-between, pas besoin de marge basse en plus */}
          <div className="flex flex-col gap-xs">
            <h3 className="h3-style text-surface mb-0">{title}</h3>
            <p className="text-body text-surface">{description}</p>
          </div>

          {/* Bas — durée + bouton */}
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-xs">
            <span className="text-caption text-surface flex items-center gap-xs">
              <IconClock /> {duration}
            </span>
            <Button label={ctaLabel} variant="primary" />
          </div>

        </div>
      </article>
    </a>
  )
}

export default MissionCard