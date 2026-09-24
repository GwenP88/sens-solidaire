// TestimonialEditModal.jsx
// Modale de création/modification d'un témoignage.
//
// EN MODIFICATION (témoignage soumis par un volontaire) : seuls la mission
// et "Afficher sur l'accueil" sont modifiables — nom, témoignage, date et
// photo appartiennent au volontaire, affichés en lecture seule.
//
// EN CRÉATION (la cliente ajoute elle-même, ex: extrait d'un rapport de
// mission) : tous les champs sont saisissables, y compris la date
// (année + mois, saisie manuelle puisqu'il n'y a pas de soumission
// automatique) et la photo (facultative).

import { useState, useEffect } from 'react'
import { createAdminTestimonial, updateTestimonial, fetchMissions } from '../../services/api'
import AdminFileUpload from './AdminFileUpload'
import DashboardModal from './DashboardModal'
import { Field, TextareaField } from './FormElements'

const TYPE_TO_API = {
  individuel: 'volontariat_individuel',
  service_civique: 'service_civique',
}

const API_TO_TYPE = {
  volontariat_individuel: 'individuel',
  service_civique: 'service_civique',
}

const MONTHS = [
  { value: 1, label: 'Janvier' }, { value: 2, label: 'Février' }, { value: 3, label: 'Mars' },
  { value: 4, label: 'Avril' }, { value: 5, label: 'Mai' }, { value: 6, label: 'Juin' },
  { value: 7, label: 'Juillet' }, { value: 8, label: 'Août' }, { value: 9, label: 'Septembre' },
  { value: 10, label: 'Octobre' }, { value: 11, label: 'Novembre' }, { value: 12, label: 'Décembre' },
]

function TestimonialEditModal({ testimonial, onClose, onSaved }) {
  const isEditing = Boolean(testimonial)

  // ── Champs toujours modifiables (édition ET création) ──
  const [type, setType] = useState(API_TO_TYPE[testimonial?.mission?.type] || testimonial?.mission?.type || '')
  const [missionId, setMissionId] = useState(testimonial?.mission_id ? String(testimonial.mission_id) : '')
  const [destinations, setDestinations] = useState([])

  // ── Champs modifiables UNIQUEMENT en création ──
  const [authorName, setAuthorName] = useState(testimonial?.author_name || '')
  const [content, setContent] = useState(testimonial?.content || '')
  const [annee, setAnnee] = useState(testimonial?.annee?.toString() || '')
  const [mois, setMois] = useState(testimonial?.mois?.toString() || '')
  const [photo, setPhoto] = useState(
    testimonial?.avatar_url ? [{ file_url: testimonial.avatar_url, label: '' }] : []
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
    if (!isEditing && (!authorName.trim() || !content.trim())) {
      setError("Nom et témoignage sont obligatoires.")
      return
    }
    if (needsDestination && !missionId) {
      setError("Sélectionnez une destination.")
      return
    }

    setSubmitting(true)
    setError(null)
    try {
      if (isEditing) {
        // Seuls mission_id et show_homepage sont envoyés — tout le reste
        // (nom, témoignage, date, photo) reste celui du volontaire.
        await updateTestimonial(testimonial.id, {
          mission_id: needsDestination ? Number(missionId) : null,
        })
      } else {
        await createAdminTestimonial({
          author_name: authorName,
          content,
          mission_id: needsDestination ? Number(missionId) : null,
          annee: annee ? Number(annee) : null,
          mois: mois ? Number(mois) : null,
          avatar_url: photo[0]?.file_url || null,
        })
      }
      onSaved()
    } catch (err) {
      setError(err.message)
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <DashboardModal title={isEditing ? 'Modifier le témoignage' : 'Ajouter un témoignage'} maxWidth="max-w-lg">

      {error && (
        <div className="p-3 bg-red-50 text-red-700 text-sm rounded-lg border border-red-200">
          {error}
        </div>
      )}

      {isEditing ? (
        // ── Lecture seule — nom, témoignage, date, photo (appartiennent au volontaire) ──
        <div className="flex flex-col gap-3 p-3 bg-gray-50 rounded-lg border border-gray-200">
          <div>
            <span className="text-xs text-dash-legend">Nom</span>
            <p className="text-sm text-dash-text">{testimonial.author_name}</p>
          </div>
          <div>
            <span className="text-xs text-dash-legend">Témoignage</span>
            <p className="text-sm text-dash-text italic">{testimonial.content}</p>
          </div>
          {(testimonial.annee || testimonial.mois) && (
            <div>
              <span className="text-xs text-dash-legend">Date</span>
              <p className="text-sm text-dash-text">
                {testimonial.mois ? MONTHS.find(m => m.value === testimonial.mois)?.label : ''} {testimonial.annee}
              </p>
            </div>
          )}
          {testimonial.avatar_url && (
            <img src={testimonial.avatar_url} alt={testimonial.author_name} className="w-16 h-16 rounded-full object-cover" />
          )}
        </div>
      ) : (
        // ── Modifiable — création uniquement ──
        <>
          <Field
            label="Nom" name="author_name" value={authorName}
            onChange={e => setAuthorName(e.target.value)}
            required
          />
          <TextareaField
            label={`Témoignage — ${content.length}/280 caractères`}
            value={content}
            onChange={e => setContent(e.target.value.slice(0, 280))}
            rows={4}
            clearable
          />
          <div className="flex gap-2">
            <div className="flex flex-col gap-1 flex-1">
              <label className="text-sm font-medium text-dash-text">Mois (facultatif)</label>
              <select
                value={mois}
                onChange={e => setMois(e.target.value)}
                className="border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-dash-action/30"
              >
                <option value="">—</option>
                {MONTHS.map(m => <option key={m.value} value={m.value}>{m.label}</option>)}
              </select>
            </div>
            <Field
              label="Année (facultatif)" name="annee" value={annee}
              onChange={e => setAnnee(e.target.value)}
            />
          </div>
          <div className="flex flex-col gap-1">
            <label className="text-sm font-medium text-dash-text">Photo (facultatif)</label>
            <AdminFileUpload
              value={photo}
              onChange={setPhoto}
              accept="image/*"
              maxFiles={1}
              imageType="avatar"
              showLabel={false}
            />
          </div>
        </>
      )}

      {/* ── Mission — toujours modifiable ── */}
      <div className="flex flex-col gap-1">
        <label className="text-sm font-medium text-dash-text">Type de mission</label>
        <select
          value={type}
          onChange={e => { setType(e.target.value); setMissionId('') }}
          className="border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-dash-action/30"
        >
          <option value="">Sélectionnez un type</option>
          <option value="individuel">Volontariat individuel</option>
          <option value="service_civique">Service civique</option>
          <option value="groupe_jeunes">Groupe jeune</option>
          <option value="conge_solidaire">Congé solidaire</option>
        </select>
      </div>

      {needsDestination && (
        <div className="flex flex-col gap-1">
          <label className="text-sm font-medium text-dash-text">Destination</label>
          <select
            value={missionId}
            onChange={e => setMissionId(e.target.value)}
            className="border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-dash-action/30"
          >
            <option value="">Sélectionnez une destination</option>
            {destinations.map(m => (
              <option key={m.id} value={m.id}>{m.country}</option>
            ))}
          </select>
        </div>
      )}

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

export default TestimonialEditModal