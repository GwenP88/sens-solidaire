// DelegationCard.jsx
// Card délégation — immersive avec drapeau, pays, lieu, contacts

function DelegationCard({ pays, flag, image, lieu, contacts }) {
  return (
    <div className="relative h-56 rounded-2xl overflow-hidden">
      {/* Image immersive */}
      <img src={image} alt={lieu} className="w-full h-full object-cover" />
      {/* Overlay */}
      <div className="absolute inset-0 bg-black/50" />
      {/* Contenu */}
      <div className="absolute inset-0 p-6 flex flex-col justify-start gap-2">
        <div className="flex items-center gap-2">
          <div className="w-7 h-7 rounded-full overflow-hidden shadow-sm shrink-0">
            <img src={flag} alt={pays} className="w-full h-full object-cover" />
          </div>
          <p className="font-heading font-bold text-surface text-base">Délégation nationale au {pays}</p>
        </div>
        <p className="font-body font-bold text-surface/80 text-sm">{lieu}</p>
        <p className="font-body text-xs text-surface/60 leading-relaxed">{contacts}</p>
      </div>
    </div>
  )
}

export default DelegationCard