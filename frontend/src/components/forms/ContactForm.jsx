// ContactForm.jsx
// Formulaire de contact — composant réutilisable

import { useState } from 'react'
import Button from '../ui/Button'

function ContactForm() {

  const [form, setForm] = useState({
    prenom: '',
    nom: '',
    email: '',
    sujet: '',
    message: '',
    rgpd: false,
  })

  const [status, setStatus] = useState(null)

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target
    setForm(prev => ({ ...prev, [name]: type === 'checkbox' ? checked : value }))
  }

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

  const inputClass = "font-body text-sm text-primary border border-surface-dark rounded-xl px-4 py-3 bg-surface focus:outline-none focus:border-primary w-full"

  if (status === 'success') return (
    <div className="bg-accent-2/10 rounded-xl p-8 text-center">
      <p className="font-heading font-bold text-primary text-lg mb-2">Message envoyé ✓</p>
      <p className="font-body text-sm text-primary/60">Nous vous répondrons dans les plus brefs délais.</p>
      <div className="mt-4">
        <Button label="Envoyer un autre message" variant="secondary" onClick={() => setStatus(null)} />
      </div>
    </div>
  )

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-4">

      {/* Prénom + Nom */}
      <div className="flex gap-4">
        <div className="flex flex-col gap-1 flex-1">
          <label className="font-body text-xs font-bold text-primary/60">Prénom *</label>
          <input name="prenom" value={form.prenom} onChange={handleChange} required className={inputClass} />
        </div>
        <div className="flex flex-col gap-1 flex-1">
          <label className="font-body text-xs font-bold text-primary/60">Nom *</label>
          <input name="nom" value={form.nom} onChange={handleChange} required className={inputClass} />
        </div>
      </div>

      {/* Email */}
      <div className="flex flex-col gap-1">
        <label className="font-body text-xs font-bold text-primary/60">Email *</label>
        <input name="email" type="email" value={form.email} onChange={handleChange} required className={inputClass} />
      </div>

      {/* Sujet */}
      <div className="flex flex-col gap-1">
        <label className="font-body text-xs font-bold text-primary/60">Sujet *</label>
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

      {/* Message */}
      <div className="flex flex-col gap-1">
        <label className="font-body text-xs font-bold text-primary/60">Message *</label>
        <textarea name="message" value={form.message} onChange={handleChange} required rows={6} className={`${inputClass} resize-none`} />
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
          J'accepte que mes données soient utilisées pour traiter ma demande. Elles ne seront pas transmises à des tiers. *
        </span>
      </label>

      {/* Erreur */}
      {status === 'error' && (
        <p className="font-body text-sm text-accent">Une erreur est survenue. Veuillez réessayer.</p>
      )}

      {/* Submit */}
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