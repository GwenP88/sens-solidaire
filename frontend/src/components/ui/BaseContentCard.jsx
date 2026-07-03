function BaseContentCard({
  image,
  fallbackImage = '/images/placeholders/placeholder-action-1.png',
  alt = '',
  bg = 'bg-surface',
  height = 'h-[440px] md:h-[260px] lg:h-[480px]',
  imageWidth = 'md:w-64',
  imageHeight = 'h-48 lg:h-48',
  padding = 'p-6',
  className = '',
  imageOverlay,
  children,
}) {
  return (
    <article className={`flex flex-col md:flex-row lg:flex-col ${height} ${bg} rounded-2xl overflow-hidden shadow-sm hover:shadow-md transition-shadow ${className}`}>

      {/* ── Zone image ── */}
      <div className={`relative w-full ${imageHeight} ${imageWidth} md:h-full lg:w-full shrink-0 overflow-hidden`}>
        <img src={image || fallbackImage} alt={alt} className="w-full h-full object-cover" />
        {imageOverlay && imageOverlay}
      </div>

      {/* ── Zone contenu ── */}
      <div className={`flex flex-col justify-between flex-1 min-w-0 ${padding}`}>
        {children}
      </div>

    </article>
  )
}

export default BaseContentCard