// utils/rattachement.js
// Rattachement pays (tâche 172D) : conversion entre les 2 cases à cocher du dashboard et la valeur enregistrée (FRANCE / SUISSE / COMMUN).

// Libellés affichés à la cliente (listes du dashboard)
export const RATTACHEMENT_LABELS = {
  FRANCE: 'France',
  SUISSE: 'Suisse',
  COMMUN: 'Les deux',
}

// Valeur enregistrée → état des cases
export const toCheckboxes = (value) => ({
  france: value === 'FRANCE' || value === 'COMMUN',
  suisse: value === 'SUISSE' || value === 'COMMUN',
})

// État des cases → valeur enregistrée (aucune case cochée → null : « à renseigner »)
export const fromCheckboxes = ({ france, suisse }) => {
  if (france && suisse) return 'COMMUN'
  if (france) return 'FRANCE'
  if (suisse) return 'SUISSE'
  return null
}
