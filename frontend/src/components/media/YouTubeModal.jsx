// YouTubeModal.jsx
// Lecteur YouTube dans une modale (tâche 123) — youtube-nocookie, chargé uniquement à l'ouverture ; format portrait (Shorts) ou paysage préservé.

import Modal from '../ui/Modal'
import { getYouTubeId, getYouTubeEmbedUrl, isYouTubeShort } from '../../utils/youtube'

// Props :
//   video   : { file_url, label } ou null (modale fermée)
//   onClose : ferme la modale — l'iframe est retirée du DOM, la vidéo s'arrête
function YouTubeModal({ video, onClose }) {
  const id = video ? getYouTubeId(video.file_url) : null
  const portrait = video ? isYouTubeShort(video.file_url) : false

  return (
    <Modal isOpen={Boolean(id)} onClose={onClose} title={video?.label || 'Vidéo'}>
      {id && (
        // Portrait : largeur calculée depuis la hauteur disponible (70vh) pour ne jamais dépasser l'écran
        <div className={portrait
          ? 'mx-auto aspect-[9/16] h-[70vh] max-w-full rounded-xl overflow-hidden bg-dark'
          : 'w-full aspect-video rounded-xl overflow-hidden bg-dark'}
        >
          <iframe
            src={getYouTubeEmbedUrl(id)}
            title={video.label || 'Vidéo YouTube'}
            className="w-full h-full"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            referrerPolicy="strict-origin-when-cross-origin"
            allowFullScreen
          />
        </div>
      )}
    </Modal>
  )
}

export default YouTubeModal
