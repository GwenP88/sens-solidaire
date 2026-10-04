// PartnerEditModal.jsx
// Modale de création/modification d'un partenaire — Nom, Logo, Site web.
// Nom et logo obligatoires (le logo est affiché dans le bandeau partenaires
// du site public), site web facultatif.

import { useState } from 'react'
import { createPartner, updatePartner } from '../../services/api'
import AdminFileUpload from './AdminFileUpload'
import DashboardModal from './DashboardModal'
import { Field } from './FormElements'

function PartnerEditModal({ partner, onClose, onSaved }) {
  const isEditing = Boolean(partner)

  const [name, setName] = useState(partner?.name || '')
  const [websiteUrl, setWebsiteUrl] = useState(partner?.website_url || '')
  const [logo, setLogo] = useState(
    partner?.logo_url ? [{ file_url: partner.logo_url, label: '' }] : []
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
    if (!name.trim())      newErrors.name = "Le nom du partenaire est obligatoire."
    if (logo.length === 0) newErrors.logo = "Ajoutez le logo du partenaire."
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
      const payload = {
        name,
        website_url: websiteUrl || null,
        logo_url: logo[0].file_url,
      }
      if (isEditing) {
        await updatePartner(partner.id, payload)
      } else {
        await createPartner(payload)
      }
      onSaved()
    } catch (err) {
      setError(err.message)
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <DashboardModal title={isEditing ? 'Modifier le partenaire' : 'Ajouter un partenaire'}>

      {error && (
        <div className="p-3 bg-red-50 text-red-700 text-sm rounded-lg border border-red-200">
          {error}
        </div>
      )}

      <Field
        label="Nom du partenaire" name="name" value={name}
        onChange={e => { setName(e.target.value); clearError('name') }}
        required
        error={fieldErrors.name}
      />

      <div className="flex flex-col gap-1">
        <label className="text-sm font-medium text-dash-text">
          Logo <span className="text-red-500">*</span>
        </label>
        <AdminFileUpload
          value={logo}
          onChange={(files) => { setLogo(files); clearError('logo') }}
          accept="image/*"
          maxFiles={1}
          imageType="card"
          showLabel={false}
          error={fieldErrors.logo}
        />
        {fieldErrors.logo && <span className="text-xs text-red-500">{fieldErrors.logo}</span>}
      </div>

      <Field
        label="Site web (facultatif)" name="website_url" value={websiteUrl}
        onChange={e => setWebsiteUrl(e.target.value)}
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

export default PartnerEditModal