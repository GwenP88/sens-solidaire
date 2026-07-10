// ContactForm.jsx
// Formulaire de contact — prénom, nom, email, sujet, message, RGPD

// ── React
import { useState } from 'react'

// ── Composants UI
import Button from '../ui/Button'

function ContactForm() {

  // ── État local — champs du formulaire
  const [form, setForm] = useState({
    prenom: '',
    nom: '',
    email: '',
    sujet: '',
    message: '',
    rgpd: false,
  })

  // ── État d'envoi — null | loading | success | error
  const [status, setStatus] = useState(null)
  const [errors, setErrors] = useState({})

  // ── Mise à jour d'un champ — gère texte et checkbox
  const handleChange = (e) => {
    const { name, value, type, checked } = e.target
    setForm(prev => ({ ...prev, [name]: type === 'checkbox' ? checked : value }))

    // Efface l'erreur du champ dès que l'utilisateur le corrige
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: null }))
    }
  }

  // ── Validation — retourne un objet { champ: message } des erreurs trouvées
  const validate = () => {
    const newErrors = {}

    if (!form.prenom.trim()) newErrors.prenom = "Le prénom est obligatoire."
    if (!form.nom.trim())    newErrors.nom    = "Le nom est obligatoire."

    if (!form.email.trim()) {
      newErrors.email = "L'email est obligatoire."
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) {
      newErrors.email = "Le format de l'email n'est pas valide."
    }

    if (!form.sujet)             newErrors.sujet   = "Sélectionnez un sujet."
    if (!form.message.trim())    newErrors.message = "Le message est obligatoire."
    if (!form.rgpd)              newErrors.rgpd    = "Le consentement RGPD est obligatoire pour envoyer votre message."

    return newErrors
  }

  // ── Soumission du formulaire — envoi vers l'API contact
  const handleSubmit = async (e) => {
    e.preventDefault()

    const validationErrors = validate()
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors)
      return
    }

    setStatus('loading')
    try {
      const response = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      })
      if (!response.ok) throw new Error()
      setStatus('success')
      setForm({ prenom: '', nom: '', email: '', sujet: '', message: '', rgpd: false })
    } catch {
      setStatus('error')
    }
  }

  // ── Classes CSS communes pour tous les champs
  const inputClass = "text-body text-primary border border-surface-dark rounded-xl px-4 py-3 bg-surface focus:outline-none focus:border-primary w-full"
  const errorInputClass = "text-body text-primary border border-red-400 rounded-xl px-4 py-3 bg-surface focus:outline-none focus:border-red-500 w-full"

  // ── Message de succès après envoi
  // h3-style n'a plus de marge automatique (retirée du CSS) — pas de gap parent ici,
  // donc mb-2 reste nécessaire en dur pour espacer le titre du texte suivant
  if (status === 'success') return (
    <div className="bg-accent-2/10 rounded-xl p-8 text-center">
      <p className="h3-style text-primary mb-2">Message envoyé ✓</p>
      <p className="text-body text-primary/60">Nous vous répondrons dans les plus brefs délais.</p>
      <div className="mt-4">
        <Button label="Envoyer un autre message" variant="secondary" onClick={() => setStatus(null)} />
      </div>
    </div>
  )

  return (
    <form onSubmit={handleSubmit} noValidate className="flex flex-col gap-sm">

      {/* Champs prénom + nom côte à côte — empilés sur mobile */}
      <div className="flex flex-col sm:flex-row gap-sm">
        <div className="flex flex-col gap-xs flex-1">
          {/* text-eyebrow mb-0 : gap-xs du parent gère déjà l'espacement avec l'input */}
          <label className="text-eyebrow text-primary/60 mb-0">Prénom *</label>
          <input
            name="prenom" value={form.prenom} onChange={handleChange}
            className={errors.prenom ? errorInputClass : inputClass}
          />
          {errors.prenom && <span className="text-caption text-red-500">{errors.prenom}</span>}
        </div>
        <div className="flex flex-col gap-xs flex-1">
          <label className="text-eyebrow text-primary/60 mb-0">Nom *</label>
          <input
            name="nom" value={form.nom} onChange={handleChange}
            className={errors.nom ? errorInputClass : inputClass}
          />
          {errors.nom && <span className="text-caption text-red-500">{errors.nom}</span>}
        </div>
      </div>

      {/* Champ email */}
      <div className="flex flex-col gap-xs">
        <label className="text-eyebrow text-primary/60 mb-0">Email *</label>
        <input
          name="email" type="email" value={form.email} onChange={handleChange}
          className={errors.email ? errorInputClass : inputClass}
        />
        {errors.email && <span className="text-caption text-red-500">{errors.email}</span>}
      </div>

      {/* Menu déroulant sujet */}
      <div className="flex flex-col gap-xs">
        <label className="text-eyebrow text-primary/60 mb-0">Sujet *</label>
        <select
          name="sujet" value={form.sujet} onChange={handleChange}
          className={errors.sujet ? errorInputClass : inputClass}
        >
          <option value="">Sélectionnez un sujet</option>
          <option value="Mission volontariat">Mission de volontariat</option>
          <option value="Service civique">Service civique</option>
          <option value="Voyage groupe jeune">Voyage groupe jeune</option>
          <option value="Congé solidaire">Congé solidaire</option>
          <option value="Don">Faire un don</option>
          <option value="Partenariat">Partenariat</option>
          <option value="Autre">Autre</option>
        </select>
        {errors.sujet && <span className="text-caption text-red-500">{errors.sujet}</span>}
      </div>

      {/* Zone de message libre */}
      <div className="flex flex-col gap-xs">
        <label className="text-eyebrow text-primary/60 mb-0">Message *</label>
        <textarea
          name="message" value={form.message} onChange={handleChange} rows={6}
          className={`${errors.message ? errorInputClass : inputClass} resize-none`}
        />
        {errors.message && <span className="text-caption text-red-500">{errors.message}</span>}
      </div>

      {/* Case à cocher RGPD — obligatoire */}
      <div className="flex flex-col gap-xs">
        <label className="flex items-start gap-xs cursor-pointer">
          <input
            name="rgpd"
            type="checkbox"
            checked={form.rgpd}
            onChange={handleChange}
            className="mt-1 shrink-0 accent-accent"
          />
          <span className="text-caption text-primary/60 leading-relaxed">
            J'accepte que mes données soient utilisées pour traiter ma demande conformément à la {' '}
                <a href="/confidentialite" className="link-inline text-accent-2">politique de confidentialité</a>.
          </span>
        </label>
        {errors.rgpd && <span className="text-caption text-red-500">{errors.rgpd}</span>}
      </div>

      <span className="text-caption text-primary/60 leading-relaxed">* Champs obligatoires</span>

      {/* Message d'erreur si l'envoi échoue */}
      {status === 'error' && (
        <p className="text-body text-accent">Une erreur est survenue. Veuillez réessayer.</p>
      )}

      {/* Bouton de soumission — désactivé uniquement pendant l'envoi */}
      <Button
        label={status === 'loading' ? 'Envoi en cours...' : 'Envoyer le message →'}
        variant="primary"
        type="submit"
        disabled={status === 'loading'}
      />

    </form>
  )
}

export default ContactForm