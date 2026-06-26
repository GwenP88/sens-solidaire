// DelegationCard.jsx
// Card délégation internationale — photo immersive avec overlay, drapeau, lieu et contacts
// Props :
//   pays     : nom du pays affiché
//   flag     : URL du drapeau (flagcdn.com)
//   image    : URL de la photo de fond
//   lieu     : nom du lieu partenaire
//   contacts : noms et rôles des contacts locaux

function DelegationCard({ pays, flag, image, lieu, contacts }) {
  return (
    // ── Conteneur relatif — permet le positionnement absolu de l'overlay et du contenu
    <div className="relative h-44 md:h-52 xl:h-44 rounded-2xl overflow-hidden">

      {/* Photo de fond immersive */}
      <img src={image} alt={lieu} className="w-full h-full object-cover" />

      {/* Overlay sombre — améliore la lisibilité du texte */}
      <div className="absolute inset-0 bg-black/40" />

      {/* Contenu superposé — drapeau + pays + lieu + contacts */}
      <div className="absolute inset-0 p-6 flex flex-col justify-start gap-2">

        {/* Ligne drapeau + nom du pays */}
        <div className="flex items-center gap-2">
          <div className="w-7 h-7 rounded-full overflow-hidden shadow-sm shrink-0">
            <img src={flag} alt={pays} className="w-full h-full object-cover" />
          </div>
          <p className="h3-style text-surface">Délégation nationale au {pays}</p>
        </div>

        {/* Nom du lieu partenaire */}
        <p className="text-body text-surface">{lieu}</p>

        {/* Contacts locaux */}
        <p className="text-mention text-surface">{contacts}</p>

      </div>
    </div>
  )
}

export default DelegationCard