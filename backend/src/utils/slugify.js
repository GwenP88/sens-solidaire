// slugify.js
// Transforme un texte en adresse de page valide (voir isValidSlug).
// Ex. : "Forum partir à l'étranger — Thonon" → "forum-partir-a-l-etranger-thonon"

const MAX_LENGTH = 80 // la route publique refuse au-delà de 100

export const slugify = (text) => {
  const slug = String(text ?? '')
    .toLowerCase()
    .normalize('NFD').replace(/[\u0300-\u036f]/g, '') // retire les accents
    .replace(/[^a-z0-9]+/g, '-')                       // tout le reste → tiret
    .replace(/(^-|-$)/g, '')                           // pas de tiret au début / à la fin
    .slice(0, MAX_LENGTH)
    .replace(/-$/, '')                                  // la coupe peut laisser un tiret final

  return slug || 'article' // titre fait uniquement de symboles → valeur de secours
}