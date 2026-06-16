// TestimonialForm.jsx
// Formulaire de soumission de témoignage — utilisé dans une modale

import { submitTestimonial } from '../../services/api'
import { useState } from 'react'
import Button from '../ui/Button'

function TestimonialForm({ onClose }) {

  const [form, setForm] = useState({
    prenom: '',
    nom: '',
    type: '',
    destination: '',
    quote: '',
    photo: null,
    rgpd: false,
  })

  const [submitted, setSubmitted] = useState(false)

  const handleChange = (e) => {
    const { name, value, type, checked, files } = e.target
    setForm(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : type === 'file' ? files[0] : value,
      // Reset destination si on change de type
      ...(name === 'type' ? { destination: '' } : {})
    }))
  }

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

  // Message de confirmation après soumission
  if (submitted) return (
    <div className="flex flex-col items-center gap-4 py-8 text-center">
      <p className="font-heading font-bold text-primary text-lg">Merci pour votre témoignage !</p>
      <p className="font-body text-sm text-primary/60">Votre message sera publié après validation par notre équipe.</p>
      <Button label="Fermer" variant="secondary" onClick={onClose} />
    </div>
  )

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-4">

      {/* Prénom + Nom */}
      <div className="flex gap-4">
        <div className="flex flex-col gap-1 flex-1">
          <label className="font-body text-xs font-bold text-primary/60">Prénom *</label>
          <input
            name="prenom"
            value={form.prenom}
            onChange={handleChange}
            required
            className="font-body text-sm text-primary border border-surface-dark rounded-xl px-4 py-2 bg-surface focus:outline-none focus:border-primary"
          />
        </div>
        <div className="flex flex-col gap-1 flex-1">
          <label className="font-body text-xs font-bold text-primary/60">Nom *</label>
          <input
            name="nom"
            value={form.nom}
            onChange={handleChange}
            required
            className="font-body text-sm text-primary border border-surface-dark rounded-xl px-4 py-2 bg-surface focus:outline-none focus:border-primary"
          />
        </div>
      </div>

      {/* Type de mission */}
      <div className="flex flex-col gap-1">
        <label className="font-body text-xs font-bold text-primary/60">Type de mission *</label>
        <select
          name="type"
          value={form.type}
          onChange={handleChange}
          required
          className="font-body text-sm text-primary border border-surface-dark rounded-xl px-4 py-2 bg-surface focus:outline-none focus:border-primary"
        >
          <option value="">Sélectionnez un type</option>
          <option value="individuel">Volontariat individuel</option>
          <option value="service_civique">Service civique</option>
          <option value="groupe_jeune">Groupe jeune</option>
          <option value="conge_solidaire">Congé solidaire</option>
        </select>
      </div>

      {/* Destination — visible si type individuel */}
      {form.type === 'individuel' && (
        <div className="flex flex-col gap-1">
          <label className="font-body text-xs font-bold text-primary/60">Destination *</label>
          <select
            name="destination"
            value={form.destination}
            onChange={handleChange}
            required
            className="font-body text-sm text-primary border border-surface-dark rounded-xl px-4 py-2 bg-surface focus:outline-none focus:border-primary"
          >
            <option value="">Sélectionnez une destination</option>
            <option value="kenya">Kenya</option>
            <option value="senegal">Sénégal</option>
            <option value="sri-lanka">Sri Lanka</option>
            <option value="perou">Pérou</option>
            <option value="sumatra">Sumatra</option>
          </select>
        </div>
      )}

      {/* Témoignage */}
      <div className="flex flex-col gap-1">
        <label className="font-body text-xs font-bold text-primary/60">
          Votre témoignage * — {form.quote.length}/280 caractères
        </label>
        <textarea
          name="quote"
          value={form.quote}
          onChange={handleChange}
          required
          maxLength={280}
          rows={4}
          className="font-body text-sm text-primary border border-surface-dark rounded-xl px-4 py-2 bg-surface focus:outline-none focus:border-primary resize-none"
        />
      </div>

      {/* Photo — optionnel */}
      <div className="flex flex-col gap-1">
        <label className="font-body text-xs font-bold text-primary/60">Photo (optionnel)</label>
        <input
          name="photo"
          type="file"
          accept="image/*"
          onChange={handleChange}
          className="font-body text-sm text-primary/60 file:mr-4 file:py-2 file:px-4 file:rounded-xl file:border-0 file:font-body file:text-sm file:bg-surface-mid file:text-primary hover:file:bg-surface-dark cursor-pointer"
        />
      </div>

      {/* RGPD */}
      <label className="flex items-start gap-3 cursor-pointer">
        <input
          name="rgpd"
          type="checkbox"
          checked={form.rgpd}
          onChange={handleChange}
          required
          className="mt-1 shrink-0 accent-accent"
        />
        <span className="font-body text-xs text-primary/60 leading-relaxed">
          J'accepte que mon témoignage soit publié sur le site de Sens Solidaire après validation. Mes données ne seront pas transmises à des tiers. *
        </span>
      </label>

      {/* Boutons */}
      <div className="flex gap-4 mt-2">
        <Button label="Annuler" variant="secondary" onClick={onClose} />
        <Button label="Envoyer mon témoignage →" variant="primary" type="submit" disabled={!form.rgpd} />
      </div>

    </form>
  )
}

export default TestimonialForm