// contactController.js
// Contrôleur du formulaire de contact — POST /api/contact
//
// La validation côté serveur est obligatoire ici, même si le formulaire du site
// valide déjà : les contrôles du navigateur ne protègent jamais l'API, car n'importe
// qui peut l'appeler directement (curl, Postman) sans passer par le site.

import { sendContactEmail } from '../services/contactService.js'

const LIMITS = { nom: 80, prenom: 80, email: 254, sujet: 150, message: 2000 }

// Volontairement souple : "quelquechose@quelquechose.quelquechose". Le but est de
// refuser les saisies manifestement fausses, pas de couvrir tous les cas de la norme RFC 5322.
const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

// POST /api/contact
export const sendContact = async (req, res) => {
  try {
    const { nom, prenom, email, sujet, message } = req.body

    if (!nom || !prenom || !email || !sujet || !message) {
      return res.status(400).json({ error: 'Tous les champs sont obligatoires' })
    }

    const fields = { nom, prenom, email, sujet, message }
    for (const field of Object.keys(LIMITS)) {
      if (fields[field].length > LIMITS[field]) {
        return res.status(400).json({ error: `Le champ "${field}" dépasse la longueur maximale (${LIMITS[field]} caractères)` })
      }
    }

    if (!EMAIL_REGEX.test(email)) {
      return res.status(400).json({ error: 'Adresse email invalide' })
    }

    await sendContactEmail({ nom, prenom, email, sujet, message })
    res.status(200).json({ success: true, message: 'Message envoyé avec succès' })
  } catch (err) {
    console.error('[ERROR]', err.message)
    res.status(500).json({ error: 'Erreur lors de l\'envoi du message' })
  }
}
