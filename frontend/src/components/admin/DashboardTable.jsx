// components/admin/DashboardTable.jsx
// Tableau générique réutilisable pour toutes les sections admin.
// Ne contient AUCUNE logique métier — uniquement de l'affichage + délégation d'actions.

import { FiEdit2, FiPause, FiPlay, FiTrash2 } from 'react-icons/fi'

// columns : [{ key, label, render?: (row) => ReactNode }]
// data    : tableau d'objets (doit contenir keyField, "id" par défaut)
// onEdit / onDelete : callbacks reçoivent la ligne complète (row)
function DashboardTable({ columns, data, onEdit, onDelete, onHardDelete, keyField = 'id' }) {
  if (data.length === 0) {
    return (
      <div className="text-center py-12 text-dash-legend text-sm">
        Aucune donnée à afficher pour le moment.
      </div>
    )
  }

  return (
    <div className="overflow-x-auto rounded-lg border border-gray-200">
      <table className="w-full text-sm text-left">
        <thead className="bg-gray-50 text-dash-legend uppercase text-xs">
          <tr>
            {columns.map((col) => (
              <th key={col.key} className="px-4 py-3 font-medium">
                {col.label}
              </th>
            ))}
            <th className="px-4 py-3 font-medium text-right">Actions</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-gray-100">
          {data.map((row) => (
            <tr key={row[keyField]} className="hover:bg-gray-50">
              {columns.map((col) => (
                <td key={col.key} className="px-4 py-3 text-dash-text">
                  {/* render() permet de personnaliser l'affichage (badge, date formatée...)
                      sans que DashboardTable connaisse le métier de la donnée. */}
                  {col.render ? col.render(row) : row[col.key]}
                </td>
              ))}
              <td className="px-4 py-3 text-right">
                <div className="flex justify-end gap-2">
                  <button
                    onClick={() => onEdit(row)}
                    className="p-1.5 text-dash-legend hover:text-dash-action hover:bg-dash-action/10 rounded"
                    aria-label={`Modifier ${row[keyField]}`}
                  >
                    <FiEdit2 size={16} />
                  </button>
                  {onDelete && (
                    <button
                      onClick={() => onDelete(row)}
                      className={`p-1.5 text-dash-legend rounded ${
                        row.is_active ? 'hover:text-dash-warning hover:bg-dash-warning/10' : 'hover:text-dash-success hover:bg-dash-success/10'
                      }`}
                      aria-label={row.is_active ? `Mettre en pause ${row[keyField]}` : `Reprendre ${row[keyField]}`}
                      title={row.is_active ? 'Rendre invisible (réversible)' : 'Rendre de nouveau visible'}
                    >
                      {row.is_active ? <FiPause size={16} /> : <FiPlay size={16} />}
                    </button>
                  )}
                  {onHardDelete && (
                    <button
                      onClick={() => onHardDelete(row)}
                      className="p-1.5 text-dash-legend hover:text-dash-danger hover:bg-dash-danger/10 rounded"
                      aria-label={`Supprimer définitivement ${row[keyField]}`}
                      title="Supprimer définitivement"
                    >
                      <FiTrash2 size={16} />
                    </button>
                  )}
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}

export default DashboardTable
