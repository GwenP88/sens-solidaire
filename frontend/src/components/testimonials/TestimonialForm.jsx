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

  const inputClass = "text-body text-primary border border-surface-dark rounded-xl px-4 py-2 bg-surface focus:outline-none focus:border-primary"

  // ── Message de confirmation après soumission réussie
  // h3-style mb-0 : dans flex flex-col gap-sm, marge redondante avec gap
  if (submitted) return (
    <div className="flex flex-col items-center gap-sm py-8 text-center">
      <p className="h3-style text-primary mb-0">Merci pour votre témoignage !</p>
      <p className="text-body text-primary/60">Votre message sera publié après validation par notre équipe.</p>
      <Button label="Fermer" variant="secondary" onClick={onClose} />
    </div>
  )

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-sm">

      {/* Champs prénom + nom côte à côte — empilés sur mobile */}
      <div className="flex flex-col sm:flex-row gap-sm">
        <div className="flex flex-col gap-xs flex-1">
          {/* text-eyebrow mb-0 : gap-xs du parent gère l'espacement avec l'input */}
          <label className="text-eyebrow text-primary/60 mb-0">Prénom *</label>
          <input name="prenom" value={form.prenom} onChange={handleChange} required className={inputClass} />
        </div>
        <div className="flex flex-col gap-xs flex-1">
          <label className="text-eyebrow text-primary/60 mb-0">Nom *</label>
          <input name="nom" value={form.nom} onChange={handleChange} required className={inputClass} />
        </div>
      </div>

      {/* Menu déroulant type de mission */}
      <div className="flex flex-col gap-xs">
        <label className="text-eyebrow text-primary/60 mb-0">Type de mission *</label>
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
        <div className="flex flex-col gap-xs">
          <label className="text-eyebrow text-primary/60 mb-0">Destination *</label>
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
      <div className="flex flex-col gap-xs">
        <label className={`text-eyebrow mb-0 ${
          form.quote.length >= 260 ? 'text-red-500' :
          form.quote.length >= 224 ? 'text-orange-400' :
          'text-primary/60'
        }`}>
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
      <div className="flex flex-col gap-xs">
        <label className="text-eyebrow text-primary/60 mb-0">Photo (optionnel)</label>
        <input
          name="photo"
          type="file"
          accept="image/*"
          onChange={handleChange}
          className="text-body text-primary/60 file:mr-4 file:py-2 file:px-4 file:rounded-xl file:border-0 file:text-body file:bg-surface-mid file:text-primary hover:file:bg-surface-dark cursor-pointer"
        />
        <span className="text-caption text-primary/60 leading-relaxed">
          Formats acceptés : JPG, PNG, WEBP • Taille maximale : 5 Mo
        </span>
      </div>

      {/* Case à cocher RGPD — obligatoire avant soumission */}
      <label className="flex items-start gap-xs cursor-pointer">
        <input
          name="rgpd"
          type="checkbox"
          checked={form.rgpd}
          onChange={handleChange}
          required
          className="mt-1 shrink-0 accent-accent"
        />
        <span className="text-caption text-primary/60 leading-relaxed">
          J'autorise Sens Solidaires à publier mon témoignage et, le cas échéant, la photographie que je transmets, sur son site internet après validation. Je peux retirer mon consentement à tout moment en contactant l'association. Consultez notre{' '}
              <a href="/confidentialite" className="link-inline text-accent-2">politique de confidentialité</a>.
        </span>
      </label>

      <span className="text-caption text-primary/60 leading-relaxed">* Champs obligatoires</span>

      {/* Boutons — annuler ou soumettre */}
      <div className="flex flex-col sm:flex-row gap-sm">
        <Button label="Annuler" variant="secondary" onClick={onClose} />
        <Button label="Envoyer mon témoignage →" variant="primary" type="submit" disabled={!form.rgpd} />
      </div>

    </form>
  )
}

export default TestimonialForm