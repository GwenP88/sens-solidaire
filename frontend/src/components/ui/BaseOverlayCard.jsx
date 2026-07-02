// BaseOverlayCard.jsx
// Composant de base — structure image fond + overlay + contenu superposé
// Utilisé par : MissionCard, DelegationCard
// Props :
//   image          : URL de l'image de fond
//   fallbackImage  : image affichée si image absente
//   height         : hauteur de la card (défaut : h-[320px] md:h-[260px] lg:h-[320px] xl:h-[260px])
//   overlayClassName : classes de l'overlay (défaut : bg-black/45)
//   className      : classes additionnelles sur l'article
//   children       : contenu superposé par-dessus l'overlay

function BaseOverlayCard({
  image,
  fallbackImage = '/images/placeholders/placeholder-action-1.png',
  height = 'h-[240px] md:h-[200px] lg:h-[260px] xl:h-[300px]',
  overlayClassName = 'bg-black/45',
  className = '',
  children,
}) {
  return (
    <article className={`${height} ${className} rounded-[20px] relative overflow-hidden`}>

      {/* ── Image de fond ── */}
      <div
        className="absolute inset-0 bg-cover bg-center"
        style={{ backgroundImage: `url(${image || fallbackImage})` }}
      />

      {/* ── Overlay ── */}
      <div className={`absolute inset-0 ${overlayClassName}`} />

      {/* ── Contenu superposé ── */}
      <div className="relative h-full">
        {children}
      </div>

    </article>
  )
}

export default BaseOverlayCard