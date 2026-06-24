// TestimonialForm.jsx
// Formulaire de soumission de témoignage — utilisé dans une modale
// Le témoignage est soumis avec status "pending" et validé par l'admin avant publication

// ── React
import { useState } from 'react'

// ── API
import { submitTestimonial } from '../../services/api'

// ── Composants UI
import Button from '../ui/Button'

function TestimonialForm({ onClose }) {

  // ── État local — champs du formulaire
  const [form, setForm] = useState({
    prenom: '',
    nom: '',
    type: '',
    destination: '',
    quote: '',
    photo: null,
    rgpd: false,
  })

  // ── État de soumission — false | true
  const [submitted, setSubmitted] = useState(false)

  // ── Mise à jour d'un champ — gère texte, checkbox, fichier et reset destination
  const handleChange = (e) => {
    const { name, value, type, checked, files } = e.target
    setForm(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : type === 'file' ? files[0] : value,
      // Reset destination si changement de type de mission
      ...(name === 'type' ? { destination: '' } : {})
    }))
  }

  // ── Soumission — envoi vers l'API avec status pending
  const handleSubmit = async (e) => {
    e.preventDefault()
    try {
      await submitTestimonial({
        author_name: `${form.prenom} ${form.nom}`,
        content: form.quote,
        mission_id: null,
        annee: new Date().getFullYear(),
        consent_given: form.rgpd,
      })
      setSubmitted(true)
    } catch (err) {
      console.error(err)
      alert("Une erreur est survenue, veuillez réessayer.")
    }
  }

  // ── Classe CSS commune pour tous les champs
  const inputClass = "text-body text-primary border border-surface-dark rounded-xl px-4 py-2 bg-surface focus:outline-none focus:border-primary"

  // ── Message de confirmation après soumission réussie
  if (submitted) return (
    <div className="flex flex-col items-center gap-4 py-8 text-center">
      <p className="h3-style text-primary">Merci pour votre témoignage !</p>
      <p className="text-body text-primary/60">Votre message sera publié après validation par notre équipe.</p>
      <Button label="Fermer" variant="secondary" onClick={onClose} />
    </div>
  )

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-4">

      {/* Champs prénom + nom côte à côte — empilés sur mobile */}
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="flex flex-col gap-1 flex-1">
          <label className="text-eyebrow text-primary/60">Prénom *</label>
          <input name="prenom" value={form.prenom} onChange={handleChange} required className={inputClass} />
        </div>
        <div className="flex flex-col gap-1 flex-1">
          <label className="text-eyebrow text-primary/60">Nom *</label>
          <input name="nom" value={form.nom} onChange={handleChange} required className={inputClass} />
        </div>
      </div>

      {/* Menu déroulant type de mission */}
      <div className="flex flex-col gap-1">
        <label className="text-eyebrow text-primary/60">Type de mission *</label>
        <select name="type" value={form.type} onChange={handleChange} required className={inputClass}>
          <option value="">Sélectionnez un type</option>
          <option value="individuel">Volontariat individuel</option>
          <option value="service_civique">Service civique</option>
          <option value="groupe_jeune">Groupe jeune</option>
          <option value="conge_solidaire">Congé solidaire</option>
        </select>
      </div>

      {/* Menu déroulant destination — affiché uniquement pour le volontariat individuel */}
      {form.type === 'individuel' && (
        <div className="flex flex-col gap-1">
          <label className="text-eyebrow text-primary/60">Destination *</label>
          <select name="destination" value={form.destination} onChange={handleChange} required className={inputClass}>
            <option value="">Sélectionnez une destination</option>
            <option value="kenya">Kenya</option>
            <option value="senegal">Sénégal</option>
            <option value="sri-lanka">Sri Lanka</option>
            <option value="perou">Pérou</option>
            <option value="sumatra">Sumatra</option>
          </select>
        </div>
      )}

      {/* Zone de texte témoignage — limité à 280 caractères */}
      <div className="flex flex-col gap-1">
        <label className="text-eyebrow text-primary/60">
          Votre témoignage * — {form.quote.length}/280 caractères
        </label>
        <textarea
          name="quote"
          value={form.quote}
          onChange={handleChange}
          required
          maxLength={280}
          rows={4}
          className={`${inputClass} resize-none`}
        />
      </div>

      {/* Champ photo — optionnel */}
      <div className="flex flex-col gap-1">
        <label className="text-eyebrow text-primary/60">Photo (optionnel)</label>
        <input
          name="photo"
          type="file"
          accept="image/*"
          onChange={handleChange}
          className="text-body text-primary/60 file:mr-4 file:py-2 file:px-4 file:rounded-xl file:border-0 file:text-body file:bg-surface-mid file:text-primary hover:file:bg-surface-dark cursor-pointer"
        />
      </div>

      {/* Case à cocher RGPD — obligatoire avant soumission */}
      <label className="flex items-start gap-3 cursor-pointer">
        <input
          name="rgpd"
          type="checkbox"
          checked={form.rgpd}
          onChange={handleChange}
          required
          className="mt-1 shrink-0 accent-accent"
        />
        <span className="text-caption text-primary/60 leading-relaxed">
          J'accepte que mon témoignage soit publié sur le site de Sens Solidaire après validation. Mes données ne seront pas transmises à des tiers. *
        </span>
      </label>

      {/* Boutons — annuler ou soumettre — empilés sur mobile */}
      <div className="flex flex-col sm:flex-row gap-4 mt-2">
        <Button label="Annuler" variant="secondary" onClick={onClose} />
        <Button label="Envoyer mon témoignage →" variant="primary" type="submit" disabled={!form.rgpd} />
      </div>

    </form>
  )
}

export default TestimonialForm