// DelegationEditModal.jsx
// Modale de modification d'une délégation — Photo et Membres uniquement.
// Pays/Titre viennent du lieu associé, non modifiables depuis cette page
// (cf. onglet Lieux et délégations pour ça).

import { useState } from 'react'
import { updateDelegation } from '../../services/api'
import AdminFileUpload from './AdminFileUpload'
import DashboardModal from './DashboardModal'
import { TextareaField } from './FormElements'

function DelegationEditModal({ delegation, onClose, onSaved }) {
  const [photo, setPhoto] = useState(
    delegation.image_url ? [{ file_url: delegation.image_url, label: '' }] : []
  )
  const [contacts, setContacts] = useState(delegation.contacts || '')
  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState(null)

  const locations = delegation.locations || []

  const handleSave = async () => {
    setSubmitting(true)
    setError(null)
    try {
      // ⚠️ Ne jamais envoyer `pays` ici — sinon flag_code serait recalculé
      // sur `undefined` côté service. On ne modifie que photo/contacts.
      await updateDelegation(delegation.id, {
        image_url: photo[0]?.file_url || '',
        contacts,
      })
      onSaved()
    } catch (err) {
      setError(err.message)
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <DashboardModal title="Modifier la délégation">

      {error && (
        <div className="p-3 bg-red-50 text-red-700 text-sm rounded-lg border border-red-200">
          {error}
        </div>
      )}

      {/* ── Titre — lecture seule ── */}
      <div className="flex flex-col gap-1">
        <label className="text-sm font-medium text-dash-text">Titre</label>
        <p className="text-sm text-dash-text">{delegation.lieu}</p>
      </div>

      {/* ── Lien vers le(s) lieu(x) associé(s) ── */}
      <div className="flex flex-col gap-1">
        <span className="text-xs text-dash-legend">
          {locations.length > 1 ? 'Lieux associés' : 'Lieu associé'}
        </span>
        {locations.length > 0 ? (
          locations.map(loc => (
            <a
              key={loc.id}
              href={`/admin/lieux/${loc.id}/edit`}
              target="_blank"
              rel="noopener noreferrer"
              className="text-sm text-dash-action hover:underline"
            >
              {loc.name} →
            </a>
          ))
        ) : (
          <p className="text-xs text-dash-legend italic">Aucun lieu associé actuellement.</p>
        )}
      </div>

      {/* ── Photo — facultative ── */}
      <div className="flex flex-col gap-1">
        <label className="text-sm font-medium text-dash-text">Photo</label>
        <AdminFileUpload
          value={photo}
          onChange={setPhoto}
          accept="image/*"
          maxFiles={1}
          imageType="card"
          showLabel={false}
        />
      </div>

      {/* ── Membres ── */}
      <TextareaField
        label="Membres"
        hint="Indiquez les noms/prénoms des personnes présentes."
        value={contacts}
        onChange={e => setContacts(e.target.value)}
        rows={3}
        clearable
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

export default DelegationEditModal