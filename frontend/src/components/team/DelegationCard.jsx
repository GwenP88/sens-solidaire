// DelegationCard.jsx
// Card délégation internationale — wrapper de BaseOverlayCard
// Drapeau + pays + lieu + contacts superposés sur l'image

// ── Composants UI
import BaseOverlayCard from '../ui/BaseOverlayCard'

function DelegationCard({ pays, flag, image, lieu, contacts }) {
  return (
    <BaseOverlayCard
      image={image}
      height="h-44 md:h-52 xl:h-44"
      overlayClassName="bg-black/40"
      className="rounded-2xl"
    >
      {/* Contenu superposé — drapeau + pays + lieu + contacts */}
      <div className="h-full p-6 flex flex-col justify-start gap-xs">

        {/* Ligne drapeau + nom du pays */}
        {/* h3-style mb-0 : dans flex flex-col gap-xs, marge redondante avec gap */}
        <div className="flex items-center gap-xs">
          <div className="w-7 h-7 rounded-full overflow-hidden shadow-sm shrink-0">
            <img src={flag} alt={pays} className="w-full h-full object-cover" />
          </div>
          <p className="h3-style text-surface mb-0">Délégation nationale au {pays}</p>
        </div>

        {/* Nom du lieu partenaire */}
        <p className="text-body text-surface">{lieu}</p>

        {/* Contacts locaux */}
        <p className="text-mention text-surface">{contacts}</p>

      </div>
    </BaseOverlayCard>
  )
}

export default DelegationCard