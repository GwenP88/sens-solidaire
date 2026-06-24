// LocationCard.jsx
// Card lieu partenaire — réutilisée sur Missions.jsx et MissionDetail.jsx
// TODO V2 : page /lieux/:slug à créer

// ── Router
import { Link } from 'react-router-dom'

function LocationCard({ slug, name, image_url }) {
  return (
    // ── Lien vers la page détail du lieu
    <Link to={`/lieux/${slug}`} className="group">

      <div className="rounded-xl overflow-hidden bg-surface hover:shadow-md transition-shadow">

        {/* Image du lieu — zoom au survol */}
        <div className="h-40 overflow-hidden">
          <img
            src={image_url || '/images/placeholders/placeholder-action-1.png'}
            alt={name}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
          />
        </div>

        {/* Nom du lieu + lien "En savoir plus" */}
        <div className="p-4 flex flex-col gap-2">
          <p className="h3-style text-primary">{name}</p>
          <span className="link-cta text-accent group-hover:text-primary transition-colors">
            En savoir plus →
          </span>
        </div>

      </div>
    </Link>
  )
}

export default LocationCard