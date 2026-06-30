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

  // ── Mise à jour d'un champ — gère texte et checkbox
  const handleChange = (e) => {
    const { name, value, type, checked } = e.target
    setForm(prev => ({ ...prev, [name]: type === 'checkbox' ? checked : value }))
  }

  // ── Soumission du formulaire — envoi vers l'API contact
  const handleSubmit = async (e) => {
    e.preventDefault()
    setStatus('loading')
    try {
      const response = await fetch('http://localhost:3000/api/contact', {
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

  // ── Classe CSS commune pour tous les champs
  const inputClass = "text-body text-primary border border-surface-dark rounded-xl px-4 py-3 bg-surface focus:outline-none focus:border-primary w-full"

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
    <form onSubmit={handleSubmit} className="flex flex-col gap-sm">

      {/* Champs prénom + nom côte à côte — empilés sur mobile */}
      <div className="flex flex-col sm:flex-row gap-sm">
        <div className="flex flex-col gap-xs flex-1">
          {/* text-eyebrow mb-0 : gap-xs du parent gère déjà l'espacement avec l'input */}
          <label className="text-eyebrow text-primary/60 mb-0">Prénom *</label>
          <input name="prenom" value={form.prenom} onChange={handleChange} required className={inputClass} />
        </div>
        <div className="flex flex-col gap-xs flex-1">
          <label className="text-eyebrow text-primary/60 mb-0">Nom *</label>
          <input name="nom" value={form.nom} onChange={handleChange} required className={inputClass} />
        </div>
      </div>

      {/* Champ email */}
      <div className="flex flex-col gap-xs">
        <label className="text-eyebrow text-primary/60 mb-0">Email *</label>
        <input name="email" type="email" value={form.email} onChange={handleChange} required className={inputClass} />
      </div>

      {/* Menu déroulant sujet */}
      <div className="flex flex-col gap-xs">
        <label className="text-eyebrow text-primary/60 mb-0">Sujet *</label>
        <select name="sujet" value={form.sujet} onChange={handleChange} required className={inputClass}>
          <option value="">Sélectionnez un sujet</option>
          <option value="Mission volontariat">Mission de volontariat</option>
          <option value="Service civique">Service civique</option>
          <option value="Voyage groupe jeune">Voyage groupe jeune</option>
          <option value="Congé solidaire">Congé solidaire</option>
          <option value="Don">Faire un don</option>
          <option value="Partenariat">Partenariat</option>
          <option value="Autre">Autre</option>
        </select>
      </div>

      {/* Zone de message libre */}
      <div className="flex flex-col gap-xs">
        <label className="text-eyebrow text-primary/60 mb-0">Message *</label>
        <textarea name="message" value={form.message} onChange={handleChange} required rows={6} className={`${inputClass} resize-none`} />
      </div>

      {/* Case à cocher RGPD — obligatoire */}
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
          J'accepte que mes données soient utilisées pour traiter ma demande. Elles ne seront pas transmises à des tiers. *
        </span>
      </label>

      {/* Message d'erreur si l'envoi échoue */}
      {status === 'error' && (
        <p className="text-body text-accent">Une erreur est survenue. Veuillez réessayer.</p>
      )}

      {/* Bouton de soumission — désactivé si RGPD non coché ou envoi en cours */}
      <Button
        label={status === 'loading' ? 'Envoi en cours...' : 'Envoyer le message →'}
        variant="primary"
        type="submit"
        disabled={!form.rgpd || status === 'loading'}
      />

    </form>
  )
}

export default ContactForm