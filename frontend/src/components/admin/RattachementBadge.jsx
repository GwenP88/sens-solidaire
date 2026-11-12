// RattachementBadge.jsx
// Colonne « Pays concerné » des listes du dashboard (tâche 172D) : France / Suisse / Les deux, ou « À renseigner » en orange.

import { RATTACHEMENT_LABELS } from '../../utils/rattachement'

function RattachementBadge({ value }) {
  return value
    ? <span>{RATTACHEMENT_LABELS[value]}</span>
    : <span className="px-2 py-0.5 rounded-full text-xs font-medium bg-dash-warning/10 text-dash-warning">À renseigner</span>
}

export default RattachementBadge
