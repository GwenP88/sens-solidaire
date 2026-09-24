// ActivityReportEditModal.jsx
// Modale de création/modification d'un rapport d'activité — Année + Lien PDF.

import { useState } from 'react'
import { createActivityReport, updateActivityReport } from '../../services/api'
import DashboardModal from './DashboardModal'
import { Field } from './FormElements'

function ActivityReportEditModal({ report, onClose, onSaved }) {
  const isEditing = Boolean(report)

  const [annee, setAnnee] = useState(report?.annee?.toString() || '')
  const [url, setUrl] = useState(report?.url || '')
  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState(null)

  const handleSave = async () => {
    if (!annee.trim() || !url.trim()) {
      setError("Année et lien du PDF sont obligatoires.")
      return
    }

    setSubmitting(true)
    setError(null)
    try {
      const payload = { annee: Number(annee), url }
      if (isEditing) {
        await updateActivityReport(report.id, payload)
      } else {
        await createActivityReport(payload)
      }
      onSaved()
    } catch (err) {
      setError(err.message)
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <DashboardModal title={isEditing ? 'Modifier le rapport' : 'Ajouter un rapport'}>

      {error && (
        <div className="p-3 bg-red-50 text-red-700 text-sm rounded-lg border border-red-200">
          {error}
        </div>
      )}

      <Field
        label="Année" name="annee" value={annee}
        onChange={e => setAnnee(e.target.value)}
        required
      />
      <Field
        label="Lien du PDF" name="url" value={url}
        onChange={e => setUrl(e.target.value)}
        required
      />

      <div className="flex justify-end gap-2">
        <button
          onClick={onClose}
          className="px-4 py-2 text-sm text-dash-legend hover:bg-gray-100 rounded-lg"
        >
          Annuler
        </button>
        <button
          onClick={handleSave}
          disabled={submitting}
          className="px-4 py-2 text-sm text-white bg-dash-action rounded-lg hover:bg-dash-action/90 disabled:opacity-50"
        >
          {submitting ? 'Enregistrement...' : 'Enregistrer'}
        </button>
      </div>

    </DashboardModal>
  )
}

export default ActivityReportEditModal