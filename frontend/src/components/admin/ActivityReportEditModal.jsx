// ActivityReportEditModal.jsx
// Modale de création/modification d'un rapport d'activité — Année + fichier PDF.
// Le PDF est envoyé depuis l'ordinateur de la cliente (même principe que les
// rapports de mission) ; son adresse est stockée dans le champ `url`.

import { useState } from 'react'
import { createActivityReport, updateActivityReport } from '../../services/api'
import AdminFileUpload from './AdminFileUpload'
import DashboardModal from './DashboardModal'
import { Field } from './FormElements'
import { isValidYear } from '../../utils/validation'

function ActivityReportEditModal({ report, onClose, onSaved }) {
  const isEditing = Boolean(report)

  const [annee, setAnnee] = useState(report?.annee?.toString() || '')
  const [pdf, setPdf] = useState(
    report?.url ? [{ file_url: report.url, label: '' }] : []
  )
  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState(null)         // erreurs serveur (message en haut)
  const [fieldErrors, setFieldErrors] = useState({}) // erreurs par champ

  // Retire l'erreur d'un champ dès que la cliente le modifie
  const clearError = (fieldName) => {
    if (fieldErrors[fieldName]) setFieldErrors(prev => ({ ...prev, [fieldName]: null }))
  }

  // Même principe que les formulaires pleine page : une erreur par champ
  const validate = () => {
    const newErrors = {}
    if (!annee.trim())            newErrors.annee = "L'année du rapport est obligatoire."
    else if (!isValidYear(annee)) newErrors.annee = "Indiquez une année valide, par exemple 2025."
    if (pdf.length === 0)         newErrors.pdf = "Ajoutez le rapport au format PDF."
    return newErrors
  }

  const handleSave = async () => {
    const validationErrors = validate()
    if (Object.keys(validationErrors).length > 0) {
      setFieldErrors(validationErrors)
      return
    }

    setSubmitting(true)
    setError(null)
    try {
      const payload = { annee: Number(annee), url: pdf[0].file_url }
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
        onChange={e => { setAnnee(e.target.value); clearError('annee') }}
        required
        error={fieldErrors.annee}
      />

      <div className="flex flex-col gap-1">
        <label className="text-sm font-medium text-dash-text">
          Rapport d'activité <span className="text-red-500">*</span>
        </label>
        <p className="text-xs text-dash-legend">
          Sélectionnez le rapport au format PDF à proposer au téléchargement sur le site.
        </p>
        <AdminFileUpload
          value={pdf}
          onChange={(files) => { setPdf(files); clearError('pdf') }}
          accept="application/pdf"
          maxFiles={1}
          showLabel={false}
          error={fieldErrors.pdf}
        />
        {fieldErrors.pdf && <span className="text-xs text-red-500">{fieldErrors.pdf}</span>}
      </div>

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