// DelegationCard.jsx
// Card délégation internationale — photo immersive avec overlay, drapeau, lieu et contacts

function DelegationCard({ pays, flag, image, lieu, contacts }) {
  return (
    <div className="relative h-44 md:h-52 xl:h-44 rounded-2xl overflow-hidden">
      <img src={image} alt={lieu} className="w-full h-full object-cover" />
      <div className="absolute inset-0 bg-black/40" />
      <div className="absolute inset-0 p-6 flex flex-col justify-start gap-xs">

        {/* Ligne drapeau + nom du pays */}
        {/* h3-style mb-0 : dans flex flex-col gap-xs, marge redondante avec gap */}
        <div className="flex items-center gap-xs">
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