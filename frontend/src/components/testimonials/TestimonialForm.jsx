// TestimonialForm.jsx
// Formulaire de soumission de témoignage — utilisé dans une modale
// Le témoignage est soumis avec status "pending" et validé par l'admin avant publication

// ── React
import { useState, useEffect } from 'react'

// ── API
import { submitTestimonial, uploadFile, fetchMissions } from '../../services/api'

// ── Composants UI
import Button from '../ui/Button'

function TestimonialForm({ onClose }) {

  const [form, setForm] = useState({
    prenom: '',
    nom: '',
    type: '',
    destination: '', // contient désormais l'id de la mission (string issue du select), pas le pays
    quote: '',
    photo: null,
    rgpd: false,
  })

  const [submitted, setSubmitted] = useState(false)
  const [photoPreview, setPhotoPreview] = useState(null)
  const [destinations, setDestinations] = useState([]) // tableau de missions { id, country }, plus de strings
  const [errors, setErrors] = useState({})

  const handleChange = (e) => {
    const { name, value, type, checked, files } = e.target
    setForm(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : type === 'file' ? files[0] : value,
      ...(name === 'type' ? { destination: '' } : {})
    }))

    // Génère une prévisualisation locale si un fichier photo est sélectionné
    if (name === 'photo' && files[0]) {
      setPhotoPreview(URL.createObjectURL(files[0]))
    }

    // Efface l'erreur du champ dès que l'utilisateur le corrige
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: null }))
    }
  }

  // ── Validation — retourne un objet { champ: message } des erreurs trouvées
  const validate = () => {
    const newErrors = {}

    if (!form.prenom.trim())  newErrors.prenom  = "Le prénom est obligatoire."
    if (!form.nom.trim())     newErrors.nom     = "Le nom est obligatoire."
    if (!form.type)           newErrors.type    = "Sélectionnez un type de mission."
    if (form.type === 'individuel' && !form.destination) {
      newErrors.destination = "Sélectionnez une destination."
    }
    if (!form.quote.trim())   newErrors.quote   = "Le témoignage est obligatoire."
    if (!form.rgpd)           newErrors.rgpd    = "Le consentement RGPD est obligatoire pour envoyer votre témoignage."

    return newErrors
  }

  const handleSubmit = async (e) => {
    e.preventDefault()

    const validationErrors = validate()
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors)
      return
    }

    try {
      // Si une photo a été sélectionnée, on l'upload d'abord pour obtenir son URL
      let avatarUrl = null
      if (form.photo) {
        avatarUrl = await uploadFile(form.photo)
      }

      // mission_id : uniquement pour le volontariat individuel, où l'utilisateur
      // choisit une destination précise (1 pays = 1 mission active, cf. vérification BDD).
      // Les autres types (service civique, groupe jeune, congé solidaire) ne sont pas
      // rattachés à une mission précise pour l'instant → null (à valider si besoin d'évoluer).
      await submitTestimonial({
        author_name: `${form.prenom} ${form.nom}`,
        content: form.quote,
        mission_id: form.destination ? Number(form.destination) : null,
        avatar_url: avatarUrl,
        annee: new Date().getFullYear(),
        consent_given: form.rgpd,
      })
      setSubmitted(true)
    } catch (err) {
      console.error(err)
      alert("Une erreur est survenue, veuillez réessayer.")
    }
  }

  // Récupère dynamiquement les missions individuelles actives
  // (même logique que le dropdown navbar) — se met à jour à chaque nouvelle mission créée
  // On garde les missions entières (id + country) pour pouvoir résoudre mission_id à la soumission
  useEffect(() => {
    fetchMissions({ type: 'volontariat_individuel' })
      .then(missions => {
        setDestinations(missions)
      })
      .catch(console.error)
  }, [])

  // Libère l'URL de prévisualisation quand elle n'est plus utilisée (évite une fuite mémoire)
  useEffect(() => {
    return () => {
      if (photoPreview) URL.revokeObjectURL(photoPreview)
    }
  }, [photoPreview])

  const inputClass = "text-body text-primary border border-surface-dark rounded-xl px-4 py-2 bg-surface focus:outline-none focus:border-primary"
  const errorInputClass = "text-body text-primary border border-red-400 rounded-xl px-4 py-2 bg-surface focus:outline-none focus:border-red-500"

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
    <form onSubmit={handleSubmit} noValidate className="flex flex-col gap-sm">

      {/* Champs prénom + nom côte à côte — empilés sur mobile */}
      <div className="flex flex-col sm:flex-row gap-sm">
        <div className="flex flex-col gap-xs flex-1">
          {/* text-eyebrow mb-0 : gap-xs du parent gère l'espacement avec l'input */}
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

      {/* Menu déroulant type de mission */}
      <div className="flex flex-col gap-xs">
        <label className="text-eyebrow text-primary/60 mb-0">Type de mission *</label>
        <select
          name="type" value={form.type} onChange={handleChange}
          className={errors.type ? errorInputClass : inputClass}
        >
          <option value="">Sélectionnez un type</option>
          <option value="individuel">Volontariat individuel</option>
          <option value="service_civique">Service civique</option>
          <option value="groupe_jeune">Groupe jeune</option>
          <option value="conge_solidaire">Congé solidaire</option>
        </select>
        {errors.type && <span className="text-caption text-red-500">{errors.type}</span>}
      </div>

      {/* Menu déroulant destination — affiché uniquement pour le volontariat individuel */}
      {/* value = id de la mission (résolu directement en mission_id à la soumission) */}
      {form.type === 'individuel' && (
        <div className="flex flex-col gap-xs">
          <label className="text-eyebrow text-primary/60 mb-0">Destination *</label>
          <select
            name="destination" value={form.destination} onChange={handleChange}
            className={errors.destination ? errorInputClass : inputClass}
          >
            <option value="">Sélectionnez une destination</option>
            {destinations.map(mission => (
              <option key={mission.id} value={mission.id}>{mission.country}</option>
            ))}
          </select>
          {errors.destination && <span className="text-caption text-red-500">{errors.destination}</span>}
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
          maxLength={280}
          rows={4}
          className={`${errors.quote ? errorInputClass : inputClass} resize-none`}
        />
        {errors.quote && <span className="text-caption text-red-500">{errors.quote}</span>}
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
        {photoPreview && (
          <img
            src={photoPreview}
            alt="Aperçu de la photo"
            className="w-20 h-20 rounded-full object-cover mt-2"
          />
        )}
        <span className="text-caption text-primary/60 leading-relaxed">
          Formats acceptés : JPG, PNG, WEBP • Taille maximale : 5 Mo
        </span>
      </div>

      {/* Case à cocher RGPD — obligatoire avant soumission */}
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
            J'autorise Sens Solidaires à publier mon témoignage et, le cas échéant, la photographie que je transmets, sur son site internet après validation. Je peux retirer mon consentement à tout moment en contactant l'association. Consultez notre{' '}
                <a href="/confidentialite" className="link-inline text-accent-2">politique de confidentialité</a>.
          </span>
        </label>
        {errors.rgpd && <span className="text-caption text-red-500">{errors.rgpd}</span>}
      </div>

      <span className="text-caption text-primary/60 leading-relaxed">* Champs obligatoires</span>

      {/* Boutons — annuler ou soumettre */}
      <div className="flex flex-col sm:flex-row gap-sm">
        <Button label="Annuler" variant="secondary" onClick={onClose} />
        <Button label="Envoyer mon témoignage →" variant="primary" type="submit" />
      </div>

    </form>
  )
}

export default TestimonialForm