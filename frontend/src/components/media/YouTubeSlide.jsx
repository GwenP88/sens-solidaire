// YouTubeSlide.jsx
// Vignette d'une vidéo YouTube dans un carrousel (tâche 123) — miniature + icône lecture, AUCUN lecteur chargé avant le clic.

import { FaPlay } from 'react-icons/fa'
import { getYouTubeId, getYouTubeThumbnail } from '../../utils/youtube'

// Props :
//   url       : lien YouTube collé dans le dashboard
//   label     : légende facultative (sert aussi de texte alternatif)
//   onPlay    : appelé au clic — la page ouvre alors le lecteur dans une modale
//   className : hauteur / arrondi, pour s'aligner sur les photos du même carrousel
function YouTubeSlide({ url, label, onPlay, className = 'w-full h-56 rounded-xl' }) {
  const id = getYouTubeId(url)
  if (!id) return null

  return (
    <button
      type="button"
      onClick={onPlay}
      className={`group relative block overflow-hidden bg-dark ${className}`}
      aria-label={`Lire la vidéo${label ? ` : ${label}` : ''}`}
    >
      {/* loading="lazy" : la miniature n'est téléchargée que lorsqu'elle approche de l'écran */}
      <img src={getYouTubeThumbnail(id)} alt="" loading="lazy" className="w-full h-full object-cover" />

      {/* Voile + icône lecture centrée (agrandie au survol / focus clavier) */}
      <span className="absolute inset-0 flex items-center justify-center bg-dark/30 group-hover:bg-dark/40 transition-colors">
        <span className="flex items-center justify-center w-16 h-16 rounded-full bg-accent text-surface shadow-lg transition-transform group-hover:scale-110 group-focus-visible:scale-110">
          <FaPlay className="ml-1 text-xl" aria-hidden="true" />
        </span>
      </span>
    </button>
  )
}

export default YouTubeSlide
