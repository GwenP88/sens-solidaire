// rattachement.js
// Rattachement pays (tâche 172D) : page financeurs où le contenu est mis en avant — partagé par les sections Éducation, actions terrain, articles.

// Valeurs de l'enum Prisma `Rattachement` (schema.prisma)
export const RATTACHEMENTS = ['FRANCE', 'SUISSE', 'COMMUN']

// Vide (null / '') accepté : contenu pas encore renseigné.
// L'obligation d'en choisir un est portée par le formulaire du dashboard (au moins une case cochée).
export const isValidRattachement = (value) =>
  value === null || value === undefined || value === '' || RATTACHEMENTS.includes(value)

// Valeur à enregistrer : '' → null (Prisma refuse une chaîne vide pour un enum)
export const toRattachement = (value) => (RATTACHEMENTS.includes(value) ? value : null)
