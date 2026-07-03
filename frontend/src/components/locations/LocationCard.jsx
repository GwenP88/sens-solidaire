// LocationCard.jsx
// Card lieu partenaire — réutilisée sur MissionDetail.jsx et Missions.jsx

// ── Router
import { Link } from 'react-router-dom'

function LocationCard({ slug, name, image_url }) {
  return (
    <Link to={`/lieux/${slug}`} className="group">

      {/* Hauteur fixe — uniformise les cards en grille/carousel quelle que soit la longueur du titre */}
      <div className="h-[240px] md:h-[240px] lg:h-[260px] xl:h-[300px] flex flex-col rounded-xl overflow-hidden bg-surface hover:shadow-md transition-shadow">

        {/* Image — hauteur fixe, ne rétrécit pas */}
        <div className="h-36 md:h-40 lg:h-44 shrink-0 overflow-hidden">
          <img
            src={image_url || '/images/placeholders/placeholder-photo.png'}
            alt={name}
            onError={e => { e.target.src = '/images/placeholders/placeholder-action-1.png' }}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
          />
        </div>

        {/* Contenu — prend le reste de l'espace disponible */}
        {/* gap-xs : entre le titre et le lien */}
        <div className="p-4 flex flex-col gap-xs flex-1 overflow-hidden">

          {/* mb-0 : dans flex flex-col gap-xs, la marge de h3-style est redondante */}
          <p className="h3-style text-primary mb-0 line-clamp-2">{name}</p>

          <span className="mt-auto link-cta text-primary group-hover:text-accent transition-colors">
            En savoir plus →
          </span>

        </div>

      </div>
    </Link>
  )
}

export default LocationCard