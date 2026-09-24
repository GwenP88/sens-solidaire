// MissionReportEditModal.jsx
// Modale de création/modification d'un rapport de mission.

import { useState, useEffect } from 'react'
import { createMissionReport, updateMissionReport, fetchMissions } from '../../services/api'
import AdminFileUpload from './AdminFileUpload'
import DashboardModal from './DashboardModal'
import { Field } from './FormElements'

const TYPES = [
  { value: 'individuel', label: 'Volontariat individuel' },
  { value: 'service_civique', label: 'Service civique' },
  { value: 'groupe_jeunes', label: 'Groupe jeunes' },
  { value: 'conge_solidaire', label: 'Congé solidaire' },
]

const TYPE_TO_API = {
  individuel: 'volontariat_individuel',
  service_civique: 'service_civique',
}

function MissionReportEditModal({ report, onClose, onSaved }) {
  const isEditing = Boolean(report)

  const [auteur, setAuteur] = useState(report?.auteur || '')
  const [type, setType] = useState(report?.type || '')
  const [destination, setDestination] = useState(report?.destination || '')
  const [destinations, setDestinations] = useState([])
  const [annee, setAnnee] = useState(report?.annee?.toString() || '')
  const [pdf, setPdf] = useState(
    report?.pdf_url ? [{ file_url: report.pdf_url, label: '' }] : []
  )
  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState(null)
  const needsDestination = type === 'individuel' || type === 'service_civique'

  useEffect(() => {
    if (!needsDestination) return
    fetchMissions({ type: TYPE_TO_API[type] })
      .then(setDestinations)
      .catch(console.error)
  }, [type])

  const handleSave = async () => {
    if (!auteur.trim() || !type || !annee || pdf.length === 0) {
      setError("Veuillez renseigner l’auteur, le type de mission et l’année, puis ajouter le rapport au format PDF.")
      return
    }

    setSubmitting(true)
    setError(null)
    try {
      const payload = {
        auteur,
        type,
        destination: destination || null,
        annee: Number(annee),
        pdf_url: pdf[0].file_url,
      }
      if (isEditing) {
        await updateMissionReport(report.id, payload)
      } else {
        await createMissionReport(payload)
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
          label="Auteur du rapport"
          name="auteur"
          value={auteur}
          onChange={e => setAuteur(e.target.value)}
          hint="Indiquez le prénom et le nom de la personne ayant rédigé le rapport."
          required
        />

      <div className="flex flex-col gap-1">
        <label className="text-sm font-medium text-dash-text">Type de mission</label>
        <p className="text-xs text-dash-legend">
          Sélectionnez le type de mission concerné par ce rapport.
        </p>
        <select
          value={type}
          onChange={e => setType(e.target.value)}
          className="border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-dash-action/30"
        >
          <option value="">Sélectionnez un type</option>
          {TYPES.map(t => <option key={t.value} value={t.value}>{t.label}</option>)}
        </select>
      </div>

      {needsDestination && (
      <div className="flex flex-col gap-1">
        <label className="text-sm font-medium text-dash-text">Destination</label>
        <p className="text-xs text-dash-legend">
          Sélectionnez le pays dans lequel la mission a été réalisée.
        </p>
        <select
          value={destination}
          onChange={e => setDestination(e.target.value)}
          className="border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-dash-action/30"
        >
          <option value="">Sélectionnez une destination</option>
          {destinations.map(m => (
            <option key={m.id} value={m.country}>{m.country}</option>
          ))}
        </select>
      </div>
    )}

      <Field
        label="Année de la mission"
        name="annee"
        value={annee}
        onChange={e => setAnnee(e.target.value)}
        required
      />

      <div className="flex flex-col gap-1">
        <label className="text-sm font-medium text-dash-text">
          Rapport de mission<span className="text-red-500">*</span>
        </label>
        <p className="text-xs text-dash-legend">
          Sélectionnez le rapport au format PDF à proposer au téléchargement sur le site.
        </p>
        <AdminFileUpload
          value={pdf}
          onChange={setPdf}
          accept="application/pdf"
          maxFiles={1}
          showLabel={false}
        />
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

export default MissionReportEditModal