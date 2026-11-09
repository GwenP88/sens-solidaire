// youtube.js
// Lecture d'un lien YouTube (tâche 123) — ⚠️ copie de frontend/src/utils/youtube.js, garder les deux identiques.

// Formats acceptés :
//   https://www.youtube.com/watch?v=ID   https://youtu.be/ID
//   https://www.youtube.com/shorts/ID    https://www.youtube.com/embed/ID
//   (avec ou sans www., m., paramètres en plus comme &t=30s)
const YOUTUBE_PATTERN = /^https?:\/\/(?:www\.|m\.)?(?:youtube\.com\/(?:watch\?(?:.*&)?v=|shorts\/|embed\/)|youtu\.be\/)([A-Za-z0-9_-]{11})(?:[?&#/].*)?$/

// Identifiant de 11 caractères de la vidéo, ou null si le lien n'est pas une vidéo YouTube
export const getYouTubeId = (url) => String(url ?? '').trim().match(YOUTUBE_PATTERN)?.[1] ?? null

export const isYouTubeUrl = (url) => getYouTubeId(url) !== null

// Les « Shorts » sont filmés en portrait (9:16) — les autres vidéos en paysage (16:9)
export const isYouTubeShort = (url) => /\/shorts\//.test(String(url ?? ''))

// Miniature générée par YouTube (aucun fichier à envoyer par la cliente)
export const getYouTubeThumbnail = (id) => `https://i.ytimg.com/vi/${id}/hqdefault.jpg`

// Lecteur youtube-nocookie : pas de cookie publicitaire tant que la vidéo n'est pas lancée.
// autoplay=1 uniquement parce que ce lecteur n'est chargé qu'APRÈS un clic du visiteur sur « Lire ».
export const getYouTubeEmbedUrl = (id) => `https://www.youtube-nocookie.com/embed/${id}?autoplay=1&rel=0`
